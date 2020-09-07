import React from 'react'
import { tether, Container, Heading } from '@triframe/designer'
import { VUser } from '.'
import { CurrentUser } from '../../contexts/CurrentUser'

export const Profile = tether(function* ({ Api, useContext }) {

    const { User } = Api

    const user = yield useContext(CurrentUser)
    if(user === null) return null

    const form = yield new User({
        name: user.name,
        email: user.email,
        password: undefined,
        profileUrl: user.profileUrl
    })

    return (
        <Container>
            <Heading>Profile</Heading>
            <VUser.Form
                value={form}
                onSubmit={(form) => {
                    console.log(user)
                    user.name = form.name
                    user.email = form.email
                    user.profileUrl = form.profileUrl
                }}
            />
        </Container>
    )
})