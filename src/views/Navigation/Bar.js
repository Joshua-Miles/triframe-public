import React from 'react'
import { tether, Appbar, Heading, Tab, Area, Button, TouchableOpacity } from '@triframe/designer'
import { when, otherwise } from '@triframe/confectioner'
import { VUser } from '../User'
import { Navigation } from '.'
import { CurrentUser } from '../../contexts/CurrentUser'

export const Bar = tether(function* ({ Api, useRouter, redirect, props, useContext }) {
    const { User } = Api
    const { style } = props
    const currentUser = yield useContext(CurrentUser)
    return (
        <Appbar style={{ zIndex: 100, ...style }}>
            <Heading style={{ color: 'white' }} onPress={() => redirect('/')}>Δ TriFrame</Heading>
            <Area alignX="right">
                {when(currentUser === null, () => (
                    <Area inline>
                        <Button onPress={() => redirect('/register')}>Register</Button>
                        <Button onPress={() => redirect('/login')}>Login</Button>
                    </Area>
                ),
                otherwise(() => (   
                    <Area inline>
                        <Button onPress={() => User.logout()}>Logout</Button>
                        <Navigation.Notifications />
                        <Area alignY="center">
                            <TouchableOpacity onPress={() => redirect('/profile')}>
                                <VUser.Avatar user={currentUser} size={40} />
                            </TouchableOpacity>
                        </Area>
                    </Area>
                )))}
            </Area>
        </Appbar>
    )
})