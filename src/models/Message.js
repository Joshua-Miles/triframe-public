import { Model, belongsTo, include, readonly, hidden, string, timestamp } from '@triframe/scribe'
import { Resource, DateTime } from '@triframe/core'

export class Message extends Resource {

    @include(Model)

    @string
    content = ''

    @readonly
    @belongsTo({ a: 'User' })
    sender = null

    @readonly
    @belongsTo
    team = null

    @readonly
    @timestamp
    creationDate = DateTime.now() 

    @hidden
    delete

    @hidden 
    static create

    // @hidden 
    // static where

    @hidden 
    static list

    @hidden 
    static search

}