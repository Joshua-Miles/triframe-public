import React from 'react'
import { tether, Card, Heading, List, Grid, Column, Button, Area, Caption, Paragraph } from '@triframe/designer'
import { when, otherwise, sleep } from '@triframe/confectioner'

export const EventCard = tether(function* ({ props, Api }) {
    const { User } = Api
    const { event } = props

    return (
        <Card>
            <Card.Content>
                <Caption>{event.startTime.toFormat('MM/dd/yy h:mm a')}</Caption>
                <Heading>{event.name}</Heading>
                <Paragraph>{event.description}</Paragraph>
                <Area alignX="center">
                    {when(event.isRegistered === false, () => (
                        <Button mode="outlined" color="green" onPress={() => event.register()}>
                            Register
                        </Button>
                    ),
                    otherwise(() => (
                        <Button mode="outlined" color="red" onPress={() => event.unregister()}>
                            Unregister
                        </Button>
                    )))}
                </Area>
            </Card.Content>
        </Card>
    )
})