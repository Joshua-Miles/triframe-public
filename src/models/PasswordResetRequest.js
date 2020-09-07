import { Model, belongsTo, include, string, readonly, hidden, timestamp } from '@triframe/scribe'
import { Resource } from '@triframe/core'
import { User } from './User'
import { hash } from 'bcrypt'

export class PasswordResetRequest extends Resource {

    @include(Model)

    @hidden
    @timestamp
    createdTime = null

    @hidden
    @string
    key = null

    @hidden
    @belongsTo
    user = null

    @hidden
    delete

    @hidden 
    static create

    @hidden 
    static where

    @hidden 
    static find

    @hidden 
    static list


    static async send(email){
        let [user] = await User.where({ email })

        if(!user)
            throw Error('There are no users with this email')

        let key = generateKey()

        await PasswordResetRequest.create({ userId: user.id, key })

        // send email
        console.log(`DOMAIN/reset-password/${key}`)

        return true
    }

    static async fullfill(key, newPassword){
        let [ request ] = await PasswordResetRequest.where({ key }, `
            key,
            user {
                id,
            }
        `)

        if(!request)
            throw Error('Password Reset Request has Expired')

        request.user.passwordDigest = await hash(newPassword, 10)

        return true
    }

}

let generateKey = () =>  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
