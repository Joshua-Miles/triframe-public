import { Model, sql, derive, string, hidden, temp, include, readonly, belongsTo, hasMany, hiddenUnless, readonlyUnless, validate, session, stream, integer } from '@triframe/scribe'
import { Resource } from '@triframe/core'
import { hash, compare } from 'bcrypt'
import { emailRequirements, passwordRequirements } from '../mixins/validations'
import { thisIsMe, iAmAnAdmin } from '../mixins/authorizations'
import { Notification } from './Notification'
import { emailServiceFor } from '../services/emailServiceFor'

export class User extends Resource {

    @include(Model)

    static Roles = {
        Member: 0,
        Admin: 1
    }

    @string
    @readonlyUnless(thisIsMe)
    name = ""

    @string
    @readonlyUnless(thisIsMe)
    @validate(emailRequirements)
    email = ""

    @temp
    @validate(passwordRequirements)
    password = ''

    @temp
    @validate(passwordRequirements)
    confirmPassword = ''

    @string
    @hidden
    passwordDigest = ''

    @string
    @readonlyUnless(thisIsMe)
    profileUrl = ''

    @integer
    @readonlyUnless(iAmAnAdmin)
    role = User.Roles.Member

    @derive({ sql: (user) => `
        COUNT(${user.notifications.id}) FILTER (WHERE ${user.notifications.unRead} = TRUE)
    `})
    numberOfUnReadNotifications = 0

    @hasMany 
    notifications = []

    @hasMany({ as: 'invitee' })
    invites = []

    @hasMany({ of: 'EventRegistration' })
    registrations = []

    @hasMany({ through: user => user.registrations.event })
    events = []
    
    @belongsTo
    @readonly
    team = null

    sendEmail = emailServiceFor(this)

    @hidden
    static create

    @hiddenUnless(thisIsMe)
    delete

    @hiddenUnless(thisIsMe)
    async clearNotifications(){
        let notifications = await Notification.where({ userId: this.id, unRead: true })
        if(notifications.length) Notification.emit('*.changed.unRead')
        notifications.forEach(notification => notification.unRead = false)
    }

    @session
    static async register(session, attributes = {}){

        let newUser = new User({ ...attributes, role: User.Roles.Member })

        if(newUser.validation.isInvalid)
            throw Error('Invalid Inputs')

        let existingUsers = await User.where({ email: newUser.email })

        if(existingUsers.length > 0)
            throw Error('There is already a user with this email')

        newUser.passwordDigest = await hash(newUser.password, 10)

        await newUser.persist()

        session.loggedInUserId = newUser.id
        session.loggedInUserRole = newUser.role

        return newUser
    }

    @session
    static async login(session, { email, password }){

        let [ user ] = await User.where({ email })

        if(user === undefined)
            throw Error('Could not find a user with this email')

        if(await compare(password, user.passwordDigest) === false)
            throw Error('Invalid Username or Password')

        session.loggedInUserId = user.id
        session.loggedInUserRole = user.role
        
        return true
    }

    @session
    static logout(session){
        session.loggedInUserId = null
        session.loggedInUserRole = null
    }

    @session
    @stream
    static *current(session, columns = undefined){
        return (
            session.loggedInUserId !== null
                ? yield User.read(session.loggedInUserId, columns)
                : null
        )
    }


}