import { Resource } from '@triframe/core'
import { Model, include, timestamp, stream, string, text, hasMany, session, readonlyUnless } from '@triframe/scribe'
import { EventRegistration } from './EventRegistration'
import { iAmAnAdmin } from '../mixins/authorizations'
import { derive } from '@triframe/scribe/dist/decorators'

export class Event extends Resource {

  @include(Model)

  @readonlyUnless(iAmAnAdmin)
  @timestamp
  startTime = null

  @readonlyUnless(iAmAnAdmin)
  @timestamp
  endTime = null

  @readonlyUnless(iAmAnAdmin)
  @string
  name = ""

  @readonlyUnless(iAmAnAdmin)
  @text
  description = ""

  @derive({ sql: (event) => `COUNT(${event.registrations.id})`})
  numberRegistered = 0

  @derive({ sql: (event, { userId }) => `
    (COUNT(${event.registrations.id}) FILTER (WHERE ${event.registrations.attendeeId} = ${userId})) != 0
  `})
  isRegistered = false


  @hasMany({ of: 'EventRegistration' })
  registrations = []

  @hasMany({ of: 'User', through: event => event.registrations.attendee })
  registered = []

  @session
  async register({ loggedInUserId }) {

    if (!loggedInUserId)
      throw Error('Must be logged in to register for an event')

    return await EventRegistration.create({ attendeeId: loggedInUserId, eventId: this.id })
  }

  @session
  async unregister({ loggedInUserId }) {

    if (!loggedInUserId)
      throw Error('Must be logged in to unregister for an event')

    let [ event ] = await EventRegistration.where({ attendeeId: loggedInUserId, eventId: this.id })

    if(event) return await event.delete()
    return false
  }

  @session
  @stream
  static *feed({ loggedInUserId }){
    return yield Event.list(`
      *,
      isRegistered(userId: ${loggedInUserId})
    `)
  }

}