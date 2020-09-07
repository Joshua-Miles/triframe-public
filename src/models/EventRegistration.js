import { Resource } from '@triframe/core'
import { Model, include, belongsTo, readonly, hidden, hiddenUnless } from '@triframe/scribe'
import { iAmThe } from '../mixins/authorizations'

export class EventRegistration extends Resource {
  
    @include(Model)
    
    @readonly
    @belongsTo({ a: 'User' })
    attendee = null

    @readonly
    @belongsTo
    event = null

    @hidden
    static create

    @hiddenUnless(iAmThe('attendee'))
    delete 

}