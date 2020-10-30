import React from 'react'
import { tether, Title, Paragraph, Section, Heading } from '@triframe/designer'
import { entities } from '../../documentation/draw'
import { SchemaDefinition } from './components/SchemaDefinition';
import { MethodDefinition } from './components/MethodDefinition';


export const MethodDetails = tether(function* ({ models, props, redirect }) {
    const { id } = props
    const method = entities[id]
    return (
        <>
            <MethodTitle method={method} />
            <Section>
                <Heading>Usage:</Heading>
                <MethodDefinition size="lg" method={method} />
            </Section>
            {method.description.length > 0 &&
                <Section>
                    <Heading>Description:</Heading>
                    <Paragraph>{method.description}</Paragraph>
                </Section>
            }
            {method.arguments.length > 0 &&
                <Section>
                    <Heading>Arguments:</Heading>
                    <SchemaDefinition schema={method.arguments} />
                </Section>
            }
        </>
    )
})

const MethodTitle = tether(function({ props, redirect }){
    const { method } = props
    const { parent } = method
    let parentTag;
    if (parent) {
        if (parent.datatype.name === 'class') {
            let seperator;
            if (parent.instanceSchema.includes(method)) seperator = '#'
            if (parent.staticSchema.includes(method)) seperator = '.'
            parentTag = (
                <span style={{ color: 'rgba(0, 0, 0, 0.3)', cursor: 'pointer' }} onClick={() => redirect(`/documentation/${parent.id}`)}>
                    {parent.name}{seperator}
                </span>
            )
        }
    }
    return (
        <Title>
            {parentTag}
            {method.name}
        </Title>
    )
})