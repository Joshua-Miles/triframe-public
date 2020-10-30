import React from 'react'
import { tether, Title, Paragraph, Section, Heading } from '@triframe/designer'
import { entities } from '../../documentation/draw'
import { SchemaDefinition } from './components/SchemaDefinition';
import { DecoratorDefinition } from './components/DecoratorDefinition';


export const DecoratorDetails = tether(function* ({ models, props, redirect }) {
    const { id } = props
    const decorator = entities[id]
    return (
        <>
            <Title>{decorator.name}</Title>
            <Section>
                <Heading>Usage:</Heading>
                <DecoratorDefinition size="lg" decorator={decorator} />
            </Section>
            {decorator.description.length > 0 &&
                <Section>
                    <Heading>Description:</Heading>
                    <Paragraph>{decorator.description}</Paragraph>
                </Section>
            }
            {decorator.arguments.length > 0 &&
                <Section>
                    <Heading>Arguments:</Heading>
                    <SchemaDefinition schema={decorator.arguments} />
                </Section>
            }
        </>
    )
})