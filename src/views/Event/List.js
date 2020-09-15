import React from 'react'
import { tether, Divider, Card, List, Subheading, Heading, Section, BubbleButton, Area, Redirect, Grid, Column, Button, Paragraph } from "@triframe/designer"
import { when, otherwise } from '@triframe/confectioner'
import { VEvent } from '.'

export const EventList = tether(function* ({ Api, redirect }) {
    const { Event } = Api

    const events = yield Event.orderedList()

    const otherEvents = events.filter(event => !event.isLecture)
    const lectures = events.filter(event => event.isLecture)

    return (
        <>
            <Heading>Events</Heading>
            {when(events.length > 0, () => (
                <>
                    <Section>
                        {otherEvents.map(event => (
                            <Section>
                                <VEvent.Card event={event} />
                            </Section>
                        ))}
                    </Section>
                    <Section>
                        <Divider />
                    </Section>
                    <Section>
                        <Subheading>Lectures</Subheading>
                        <Paragraph>Lectures will be recorded and linked here the next day</Paragraph>
                        {lectures.map(event => (
                            <Section>
                                <VEvent.Card event={event} />
                            </Section>
                        ))}
                    </Section>
                </>

            ),
                otherwise(() => (
                    <Area alignX="center" alignY="center">
                        <Heading>No events to display...</Heading>
                    </Area>
                )))}
        </>
    )

})