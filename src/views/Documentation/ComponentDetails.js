import React from 'react'
import { tether, Title, Paragraph, Section, Heading } from '@triframe/designer'
import { entities } from '../../documentation/draw'
import { SchemaDefinition } from './components/SchemaDefinition';
import { ComponentDefinition } from './components/ComponentDefinition';

export const ComponentDetails = tether(function* ({ models, props, redirect }) {
    const { id } = props
    const component = entities[id]
    return (
        <>
            <Title>{component.name}</Title>
            <Section>
                <Heading>Usage:</Heading>
                <ComponentDefinition size="lg" component={component} />
            </Section>
            {component.description.length > 0 &&
                <Section>
                    <Heading>Description:</Heading>
                    <Paragraph>{component.description}</Paragraph>
                </Section>
            }
            {component.props.length > 0 &&
                <Section>
                    <Heading>Props:</Heading>
                    <SchemaDefinition schema={component.props} />
                </Section>
            }
            {component.annotations && 
                component.annotations.map( Annotation => (
                    <Annotation />
                ))
            }
        </>
    )
})