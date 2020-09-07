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
            </Card.Content>
        </Card>
    )
})