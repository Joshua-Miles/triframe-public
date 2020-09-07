import { Model, belongsTo, include, readonly, hidden, hiddenUnless } from '@triframe/scribe'
import { Resource } from '@triframe/core'
import { iAmThe } from '../mixins/authorizations'
import { User } from './User'
import { Message } from './Message'

export class Invite extends Resource {

    @include(Model)

    @readonly
    @belongsTo({ a: 'User' })
    invitee = null

    @readonly
    @belongsTo
    team = null

    @hiddenUnless(iAmThe('invitee'))
    async accept(){
        let { teamId, inviteeId: senderId } = this;
        let sender = await User.read(senderId)
        let content = `${sender.name} has accepted the invitation to join this group.`
        await Message.create({ content, senderId, teamId })
        sender.teamId = this.teamId
        await this.delete()
        return true
    }

    @hiddenUnless(iAmThe('invitee'))
    async decline(){
        let { teamId, inviteeId: senderId } = this;
        let sender = await User.read(senderId)
        let content = `${sender.name} has declined the invitation to join this group.`
        await Message.create({ content, senderId, teamId })
        await this.delete()
        return true
    }

    @hidden
    delete

    @hidden 
    static create

}