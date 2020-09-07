import { Resource } from '@triframe/core'
import { Model, sql, literal, include, stream, readonly, hasMany, hidden, hiddenUnless, readonlyUnless, session, string } from '@triframe/scribe'
import { Invite } from './Invite'
import { User } from './User'
import { Notification } from './Notification'
import { Message } from './Message'

export const iAmAMember = async ({ session, resource }) => {
  let user = await User.read(session.loggedInUserId)
  return user.teamId === resource.id
}

export class Team extends Resource {
  
  @include(Model)

  @string
  @readonlyUnless(iAmAMember)
  name = ""

  @hasMany({ of: 'User' })
  members = []

  @hasMany
  invites = []

  @hasMany({ of: 'User', through: team => team.invites.invitee })
  invited = []

  @hasMany
  @hiddenUnless(iAmAMember)
  messages = []

  @hidden
  delete

  @session
  @hiddenUnless(iAmAMember)
  async sendMessage(session, content){
    const { loggedInUserId: senderId, } = session
    const { id: teamId } = this
    return await Message.create({ senderId, teamId, content })
  }

  @hiddenUnless(iAmAMember)
  @stream
  *feed(limit = 5, select = `*`){
    return yield sql`
      SELECT {
        messages {
          ${literal(select)}
        }
      }
      WHERE messages.teamId = ${this.id}
      ORDER BY messages.creationDate DESC
      LIMIT ${limit}
    `
  }

  @hidden 
  static create
  
  @session
  @hiddenUnless(iAmAMember)
  async invite({ loggedInUserId }, userId){
    let invite =  await Invite.create({ inviteeId: userId, teamId: this.id })
    let currentUser = await User.read(loggedInUserId)
    await Notification.send({ userId, 
      icon: 'call-received',
      message: `You have been invited to join ${this.name} by ${currentUser.name}`,
      path: `/invites/${invite.id}`
    })
    return invite
  }

  @session
  static async register({ loggedInUserId }, { name }){

    if (!loggedInUserId)
      throw Error('Must be logged in to register for an event')

    let existingTeams = await Team.where({ name })
    
    if(existingTeams.length > 0)
      throw Error('There is already a team with this name')

    let team = await Team.create({ name })
    let user = await User.read(loggedInUserId)
    user.teamId = team.id
    return team
  }

}