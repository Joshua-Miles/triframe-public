import React from 'react'
import { tether, Title, Paragraph, Section, Heading } from '@triframe/designer'
import { entities } from '../../documentation/draw'
import { SchemaDefinition } from './components/SchemaDefinition';
import { TemplateTagDefinition } from './components/TemplateTagDefinition';

export const TemplateTagDetails = tether(function* ({ models, props, redirect }) {
    const { id } = props
    const templateTag = entities[id]
    console.log(templateTag)
    return (
        <>
            <Title>{templateTag.name}</Title>
            <Section>
                <Heading>Usage:</Heading>
                <TemplateTagDefinition size="lg" templateTag={templateTag} />
            </Section>
            {templateTag.description.length > 0 &&
                <Section>
                    <Heading>Description:</Heading>
                    <Paragraph>{templateTag.description}</Paragraph>
                </Section>
            }
            {templateTag.arguments.length > 0 &&
                <Section>
                    <Heading>Arguments:</Heading>
                    <SchemaDefinition schema={templateTag.arguments} />
                </Section>
            }
        </>
    )
})