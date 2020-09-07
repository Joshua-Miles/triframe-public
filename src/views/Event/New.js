import React from 'react'
import { DateTime, Duration } from '@triframe/core'
import { tether, Card, Heading, List, Grid, Column, Button, Area } from '@triframe/designer'
import { VEvent } from '.'

const oneHour = Duration.fromObject({ hours: 1 })

export const New = tether(function* ({ Api, redirect }) {
    const { Event } = Api

    const event = yield new Event({ 
        name: '',
        description: '',
        startTime: DateTime.now(),
        endTime: DateTime.now().plus(oneHour)
    })

    return (
        <VEvent.Form value={event} onSubmit={ async (value) => {
            await Event.create({
                name: value.name,
                description: value.description,
                startTime: value.startTime,
                endTime: value.endTime
            })
            redirect('/admin')
        }} />
    )
})