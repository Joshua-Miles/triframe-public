import React from 'react'
import { tether, Card, Heading, List, Grid, Column, Button, Area, Caption, Paragraph, View, Badge } from '@triframe/designer'
import { when, otherwise, sleep } from '@triframe/confectioner'

export const EventCard = tether(function* ({ props, Api, redirect }) {
    const { User } = Api
    const { event } = props

    return (
        <Card>
            <Card.Content>
                <Caption>{event.startTime.toFormat('MM/dd/yy h:mm a')}</Caption>
                <Area inline >
                    <Heading>{event.name}</Heading>
                    <Area alignX="right">
                        <Badge>{event.numberRegistered} Registred</Badge>
                    </Area>
                </Area>
                <Paragraph>{event.description}</Paragraph>
                <Area alignX="center" >
                    <Button
                        mode="outlined"
                        icon="pencil"
                        onPress={() => redirect(`/admin/events/${event.id}/edit`)}
                    >Edit</Button>
                </Area>
            </Card.Content>
        </Card>
    )
})