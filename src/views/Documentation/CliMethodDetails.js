import React from 'react'
import { tether, Title, Paragraph, Section, Heading } from '@triframe/designer'
import { entities } from '../../documentation/draw'
import { SchemaDefinition } from './components/SchemaDefinition';
import { CliMethodDefinition } from './components/CliMethodDefinition';

export const CliMethodDetails = tether(function* ({ models, props, redirect }) {
    const { id } = props
    const cliMethod = entities[id]
    return (
        <>
            <Title>{cliMethod.name}</Title>
            <Section>
                <Heading>Usage:</Heading>
                <CliMethodDefinition size="lg" method={cliMethod} />
            </Section>
            {cliMethod.description.length > 0 &&
                <Section>
                    <Heading>Description:</Heading>
                    <Paragraph>{cliMethod.description}</Paragraph>
                </Section>
            }
            {cliMethod.arguments.length > 0 &&
                <Section>
                    <Heading>Arguments:</Heading>
                    <SchemaDefinition schema={cliMethod.arguments} />
                </Section>
            }
        </>
    )
})