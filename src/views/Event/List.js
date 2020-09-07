import React from 'react'
import { tether, Card, List, Heading, Section, BubbleButton, Area, Redirect, Grid, Column, Button } from "@triframe/designer"
import { when, otherwise } from '@triframe/confectioner'
import { VEvent } from '.'

export const EventList = tether(function* ({ Api, redirect }) {
    const { Event } = Api

    const events = yield Event.list()

    return (
        <>
            <Heading>Events</Heading>
            {when( events.length > 0, () => (
                events.map(event => (
                    <Section>
                        <VEvent.Card event={event}/>
                    </Section>
                ))
            ),
            otherwise(() => (
                <Area alignX="center" alignY="center">
                    <Heading>No events to display...</Heading>
                </Area>
            )))}
        </>
    )

})