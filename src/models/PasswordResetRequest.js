import { Model, belongsTo, include, string, readonly, hidden, timestamp } from '@triframe/scribe'
import { Resource } from '@triframe/core'
import { User } from './User'
import { hash } from 'bcrypt'

const { APPLICATION_DOMAIN } = process.env

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

        await user.sendEmail(`TriFrame: Password Reset Request`, `
            <div>
                <h1>TriFrame: Password Reset Request</h1>
                <p>Follow this link to reset your password:</p>
                <a href="${APPLICATION_DOMAIN}/reset-password/${key}">Reset Password</a>
                <p>This link will expire in 2 hours.</p>
                <p>If you have not requested that your password be reset, please ignore this email.</p>
            </div>
        `)

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
