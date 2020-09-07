import React from 'react'
import { tether, Card, List, Heading, BubbleButton, Area, Redirect, Grid, Column, Button } from "@triframe/designer"
import { VAdmin } from '.'

export const Home = tether(function* ({ Api, redirect }) {
    const { Event } = Api

    const events = yield Event.feed()

    return (
        <>
            <Heading>Admin</Heading>
            <Grid base={2}>
                <Column>
                    <VAdmin.EventList />
                    <Area alignX="right" alignY="bottom">
                        <BubbleButton icon="plus" onPress={() => redirect('/admin/events/new')}>
                            Event
                        </BubbleButton>
                    </Area>
                </Column>
                <Column>

                </Column>
            </Grid>
        </>
    )

})