import React from 'react'
import { tether, Switch, Container } from '@triframe/designer'
import { when, otherwise } from '@triframe/confectioner'
import { Router } from '.'
import { Navigation } from '../Navigation'
import { CurrentUser } from '../../contexts/CurrentUser'

export const Main = tether(function* ({ Api, useContext }) {

    const { User } = Api

    const currentUser = yield useContext(CurrentUser)

    return (
        when(currentUser !== null, () => (
            <>
                <Navigation.Main />
                <Router.Member />
            </>
        ),
        otherwise(() => (
            <>
                <Router.Public />
            </>
        )))
    )
})  