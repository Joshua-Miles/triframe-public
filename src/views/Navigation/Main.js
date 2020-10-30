import React from 'react'
import { tether, Appbar, Heading, Tab } from '@triframe/designer'
import { when } from '@triframe/confectioner'
import { Navigation } from '.'
import { CurrentUser } from '../../contexts/CurrentUser'

export const Main = tether(function* ({ Api, useRouter, useContext, redirect }) {
    const { history } = yield useRouter()
    const { pathname } = history.location
    const { User } = Api
    
    const currentUser = yield useContext(CurrentUser)
    if(currentUser === null) return null

    let homeTabLabel, homeTabPath;
    if(currentUser.teamId !== null){
        homeTabLabel = 'Team'
        homeTabPath = '/team'
    } else {
        homeTabLabel = 'Team Invites'
        homeTabPath = '/invites'
    }
    return (
        <>
            <Navigation.Bar />
            <Tab.List>
                <Tab selected={pathname === homeTabPath} onPress={() => redirect(homeTabPath)}>
                    {homeTabLabel}
                </Tab>
                <Tab selected={pathname === '/events'} onPress={() => redirect('/events')}>
                    Events
                </Tab>
                <Tab selected={pathname.startsWith('/documentation')} onPress={() => redirect('/documentation')}>
                    Documentation
                </Tab>
                {when(currentUser.role === User.Roles.Admin, () => (
                    <Tab selected={pathname === '/admin'} onPress={() => redirect('/admin')}>
                        Admin
                    </Tab>
                ))}
            </Tab.List>
        </>
    )
})