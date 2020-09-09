import React from 'react'
import { tether, Card, List, Heading, Section, BubbleButton, Area, Redirect, Grid, Column, Button } from "@triframe/designer"
import { VUser } from '.'
import { when, otherwise } from '@triframe/confectioner'

export const EventList = tether(function* ({ Api, redirect }) {
    const { Event } = Api

    const events = yield Event.feed()

    return (
        <>
            <Heading>Events</Heading>
            <Grid>
                <Column xs={12} md={6}>
                    {when(events.length > 0, () => (
                        events.map(event => (
                            <Section>
                                <VUser.EventCard event={event} />
                            </Section>
                        ))
                    ), otherwise(() => (
                        <Area alignX="center" alignY="center">
                            <Heading>No events to display...</Heading>
                        </Area>
                    )))}
                </Column>
            </Grid>
        </>
    )

})