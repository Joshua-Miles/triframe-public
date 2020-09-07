import React from 'react'
import { tether, Card, Heading, List, Grid, Column, Button, Area } from '@triframe/designer'
import { when, otherwise, sleep } from '@triframe/confectioner'
import { VUser } from '../User'

export const InviteCard = tether(function* ({ props }) {
    const state = yield { clickedDecline: false, clickedAccept: false }
    const { invite } = props

    let requestDecline = async () => {
        state.clickedAccept = false
        await sleep(500)
        state.clickedDecline = true
    }

    let requestAccept = async () => {
        state.clickedDecline = false
        await sleep(500)
        state.clickedAccept = true
    }

    return (
        <Card>
            <Card.Content>
                <Heading>{invite.team.name}</Heading>
                {invite.team.members.map(user => (
                    <List.Item
                        left={() => <List.Icon icon={props => <VUser.Avatar user={user} {...props} />} />}
                        title={user.name}
                    />
                ))}
                <Grid base={2}>
                    <Column>
                        {when(state.clickedAccept === false, () => (
                            <Button mode="outlined" color="green" onPress={requestAccept}>
                                Accept
                            </Button>
                        ),
                        otherwise(() => (
                            <Area inline alignX="justify">
                                <Button mode="outlined" color="green" icon="arrow-left" onPress={() => state.clickedAccept = false} />
                                <Button mode="outlined" color="green" onPress={() => invite.accept()}>
                                    Confirm
                                </Button>
                            </Area>
                        )))}
                    </Column>
                    <Column>
                        {when(state.clickedDecline === false, () => (
                            <Button mode="outlined" color="red" onPress={requestDecline}>
                                Decline
                            </Button>
                        ),
                        otherwise(() => (
                            <Area inline alignX="justify">
                                <Button mode="outlined" color="red" icon="arrow-left" onPress={() => state.clickedDecline = false} />
                                <Button mode="outlined" color="red" onPress={() => invite.decline()}>
                                    Confirm
                                </Button>
                            </Area>
                        )))}
                    </Column>
                </Grid>
            </Card.Content>
        </Card>
    )
})