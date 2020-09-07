import React from 'react'
import { tether, Card, Heading, List, Grid, Column, Button, Area } from '@triframe/designer'
import { when, otherwise, sleep } from '@triframe/confectioner'
import { VInvite } from '.'

export const Details = tether(function* ({ props, useParams, Api }) {

    const { id } = yield useParams()

    const { Invite } = Api

    const invite = yield Invite.read(id, `
        team {
            name,
            members {
                name,
                profileUrl
            }
        }
    `)

    return (
        <VInvite.Card invite={invite} />
    )
})