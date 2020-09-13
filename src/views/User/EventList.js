import React from 'react'
import { tether, Card, List, Divider, Subheading, Heading, Section, BubbleButton, Area, Redirect, Grid, Column, Button, Paragraph } from "@triframe/designer"
import { VUser } from '.'
import { when, otherwise } from '@triframe/confectioner'

export const EventList = tether(function* ({ Api, redirect }) {
    const { Event } = Api

    const events = yield Event.feed()

    const otherEvents = events.filter(event => !event.isLecture)
    const lectures = events.filter(event => event.isLecture)

    return (
        <>
            <Heading>Events</Heading>
            <Grid>
                <Column xs={12} md={6}>
                    {when(events.length > 0, () => (
                        <>
                            <Section>
                                {otherEvents.map(event => (
                                    <Section>
                                        <VUser.EventCard event={event} />
                                    </Section>
                                ))}
                            </Section>
                            <Section>
                                <Divider />
                            </Section>
                            <Section>
                                <Subheading>Lectures</Subheading>
                                <Paragraph>Lectures will be recorded and made available the next day</Paragraph>
                                {lectures.map(event => (
                                    <Section>
                                        <VUser.EventCard event={event} />
                                    </Section>
                                ))}
                            </Section>
                        </>
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