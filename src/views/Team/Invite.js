import React from 'react'
import { tether, Heading, Section, TextInput, HelperText, List, Redirect, Area, Button, Grid, Column } from "@triframe/designer"
import { when, otherwise } from '@triframe/confectioner'
import { VUser } from '../User'
import { CurrentUser } from '../../contexts/CurrentUser'

export const Invite = tether(function* ({ Api, useParams, useContext }) {

    const { teamId } = yield useParams()

    const { User, Team } = Api

    const currentUser = yield useContext(CurrentUser)
    if(currentUser === null) return null

    if (currentUser.teamId != teamId) return <Redirect to="/team" />

    const team = yield Team.read(teamId, `
        name,
        invited {
            id
        }
    `)

    const users = yield User.where({ teamId: null })

    const search = yield { term: '' }

    const matchesSearch = user => [user.name, user.email].some(field => field.toLowerCase().includes(search.term.toLowerCase()))

    const notInvited = user => team.invited.includes(user) === false

    const searchResults = users.filter(user => matchesSearch(user) && notInvited(user))

    return (
        <>
            <Heading>Invite Members to {team.name}</Heading>
            <Grid>
                <Column xs={12} md={6}>
                    <Area>
                        <TextInput
                            placeholder="Search..."
                            value={search.term}
                            onChange={value => search.term = value}
                        />
                        {when(searchResults.length > 0, () => (
                            searchResults.map(user => (
                                <List.Item
                                    left={() => <List.Icon icon={() => <VUser.Avatar user={user} size={30} />} />}
                                    title={user.name}
                                    right={() => <Button mode="text" icon="send" onPress={() => team.invite(user.id)} />}
                                />
                            ))
                        ), otherwise(() => (
                            <Section>
                                <Area alignX="center" alignY="center">
                                    <Heading>No users to display, check back later...</Heading>
                                </Area>
                            </Section>
                        )))}
                    </Area>
                </Column>
            </Grid>
        </>
    )

})
