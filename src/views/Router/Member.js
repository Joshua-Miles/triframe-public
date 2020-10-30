import React from 'react'
import { tether, Route, Redirect, Switch, Container } from '@triframe/designer'
import { when } from '@triframe/confectioner'
import { VInvite } from '../Invite'
import { VTeam } from '../Team'
import { VUser } from '../User'
import { VEvent } from '../Event'
import { VAdmin } from '../Admin'
import { CurrentUser } from '../../contexts/CurrentUser'
import { ApiDocumentation } from '../Documentation/ApiDocumentation'



const contain = (Component) => () => <Container><Component /></Container>

export const Member = tether(function* ({ Api, useContext }) {
    const { User } = Api

    let currentUser = yield useContext(CurrentUser)
    if (currentUser === null) return null

    let defaultView = currentUser.teamId === null ? '/invites' : '/team'

    return (
        <Switch>
            <Route path="/teams/register" component={contain(VTeam.Register)} />
            <Route path="/invites/:id" component={contain(VInvite.Details)} />
            <Route path="/invites" component={contain(VInvite.List)} />
            <Route path="/team" component={VTeam.Details} />
            <Route path="/events" component={contain(VUser.EventList)} />
            <Route path="/teams/:teamId/invite" component={contain(VTeam.Invite)} />
            <Route path="/profile" component={contain(VUser.Profile)} />
            <Route exact path="/documentation" component={ApiDocumentation} />
            <Route exact path="/documentation/:itemId?" component={ApiDocumentation} />
            {when(currentUser.role === User.Roles.Admin, () => (
                <Switch>
                    <Route exact path="/admin" component={contain(VAdmin.Home)} />
                    <Route path="/admin/events/new" component={contain(VEvent.New)} />
                    <Route path="/admin/events/:id/edit" component={contain(VEvent.Edit)} />
                    <Route path="/" render={() => <Redirect to={defaultView} />} />
                </Switch>
            ))}
            <Route path="/" render={() => <Redirect to={defaultView} />} />
        </Switch>
    )
})