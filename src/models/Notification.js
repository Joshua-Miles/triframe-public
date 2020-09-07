import { Model, include, belongsTo, string, hidden, readonly, boolean } from '@triframe/scribe'
import { Resource } from '@triframe/core'
import { hiddenUnless } from '@triframe/scribe/dist/decorators'
import { iAmThe } from '../mixins/authorizations'

export class Notification extends Resource {

    @include(Model)

    @belongsTo
    @readonly
    user = null

    @boolean
    @readonly
    unRead = true

    @string
    @readonly
    message = ''

    @string
    @readonly
    icon= null

    @string
    @readonly
    path = null
    
    @hidden
    static create

    @hiddenUnless(iAmThe('user'))
    delete

    @hidden
    static async send({ userId, message, path = null }){
        return await Notification.create({ userId, message, path })
    }

}   