import React from 'react'
import { tether, Card, Heading, List, Grid, Column, Button, Area } from '@triframe/designer'
import { when, otherwise, sleep } from '@triframe/confectioner'
import { VEvent } from '.'

export const Edit = tether(function* ({ Api, useParams, redirect }) {
    const { Event } = Api

    const { id } = yield useParams()

    const event = yield Event.read(id)

    const form = yield new Event({
        name: event.name,
        startTime: event.startTime,
        endTime: event.endTime,
        description: event.description
    })

    const handleSubmit = () => {
        event.name = form.name
        event.startTime = form.startTime
        event.endTime = form.endTime
        event.description = form.description
        redirect('/admin')
    }

    return (
        <VEvent.Form value={form} onSubmit={handleSubmit} />
    )
})