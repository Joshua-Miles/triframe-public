import React, { createRef, useContext } from 'react'
import { tether, Heading, Grid, Column, List, Button, ScrollView, BubbleButton, Container, Area, Card, Redirect, Portal, Paragraph, Subheading, TextInput } from '@triframe/designer'
import { VUser } from '../User'
import { VTeam } from '.'
import { CurrentUser } from '../../contexts/CurrentUser'

export const Details = tether(function* ({ redirect, useContext }) {

    let currentUser = yield useContext(CurrentUser)
    if(currentUser === null) return null

    const { team } = currentUser

    if (team === null) return <Redirect to="/invites" />


    return (
        <>
            <Grid base={3} style={{ flex: 1 }}>
                <Column xs={12} md={2} style={{ height: '100%' }}>
                    <VTeam.Messages team={team} />
                </Column>
                <Column xs={12} md={1}>
                    <Card elevation={2}>
                        <Card.Content>
                            <Heading>Invites</Heading>
                            {team.invites.map(invite => (
                                <List.Item
                                    left={() => <List.Icon icon={() => <VUser.Avatar user={invite.invitee} size={30} />} />}
                                    title={invite.invitee.name}
                                />
                            ))}
                            <Area alignX="right">
                                <BubbleButton icon="plus" onPress={() => redirect(`/teams/${team.id}/invite`)} >
                                    Invite
                                </BubbleButton>
                            </Area>
                        </Card.Content>
                    </Card>
                </Column>
            </Grid>
        </>
    )

})