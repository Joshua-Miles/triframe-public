import React from 'react'
import { tether, Card, List, Heading, BubbleButton, Area, Redirect, Grid, Column, Paragraph } from "@triframe/designer"
import { when, otherwise } from '@triframe/confectioner'
import { VInvite } from '.'
import { CurrentUser } from '../../contexts/CurrentUser'

export const InviteList = tether(function* ({ Api, redirect, useContext }) {
    let { User } = Api

    let currentUser = yield useContext(CurrentUser)

    if (currentUser === null) return null

    if (currentUser.teamId !== null) return <Redirect to="/team" />

    return (
        <>
            <Heading>Invites</Heading>
            {when(currentUser.invites.length > 0, () => (
                <>
                    <Paragraph>Accept an invite to join a project team:</Paragraph>
                    <Grid>
                        {currentUser.invites.map(invite => (
                            <Column xs={6}>
                                <VInvite.Card invite={invite} />
                            </Column>
                        ))}
                    </Grid>
                </>
            ),
                otherwise(() => (
                    <Area alignX="center" alignY="center">
                        <Heading>Awaiting Invites...</Heading>
                        <Paragraph>Invites will appear here once they've been sent by team-creators</Paragraph>
                    </Area>
                )))}
            <Area alignX="right" alignY="bottom">
                <BubbleButton icon="plus" onPress={() => redirect('/teams/register')}>
                    Team
                </BubbleButton>
            </Area>
        </>
    )

})