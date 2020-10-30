import React from 'react'
import { tether, Title, Paragraph, Card, Section, Heading, Subheading, Caption } from '@triframe/designer'
import { entities } from '../../documentation/draw'
import { ArgumentDefinition } from './components/ArgumentDefinitions'
import { toCamelCase } from '@triframe/core/dist/inflection'
import { DatatypeDefinition } from './components/DatatypeDefinition'
import { SchemaDefinition } from './components/SchemaDefinition'

export const ClassDetails = tether(function* ({ models, props, redirect }) {
    const { id } = props
    const $class = entities[id]
    console.log($class)
    return (
        <>
            <Title>{$class.name}</Title>
            {$class.extends &&
                <Caption>extends <DatatypeDefinition property={$class.extends} /></Caption>
            }
            {$class.initialize &&
                <Section>
                    <Heading>Usage:</Heading>
                    <pre style={{ margin: 3, fontSize: 20 }}>
                        let {toCamelCase($class.name)} = new {$class.name}(<ArgumentDefinition args={$class.initialize.arguments} />)
                    </pre>
                </Section>
            }
            {$class.description.length > 0 &&
                <Section>
                    <Paragraph>{$class.description}</Paragraph>
                </Section>
            }
            {$class.initialize &&
                <Section>
                    <Heading>Constructor:</Heading>
                    {$class.initialize.description.length > 0 &&
                        <Section>
                            <Paragraph>{$class.initialize.description}</Paragraph>
                        </Section>
                    }
                    {$class.initialize.arguments.length > 0 &&
                        <Section>
                            <Subheading>Arguments:</Subheading>
                            <SchemaDefinition schema={$class.initialize.arguments} />
                        </Section>
                    }
                </Section>
            }
            {$class.instanceSchema.length > 0 &&
                <Section>
                    <Heading>Instance Properties:</Heading>
                    {$class.instanceSchema.map(property => (
                        <MethodCard instance property={property} $class={$class} redirect={redirect} />
                    ))}
                </Section>
            }
            {$class.staticSchema.length > 0 &&
                <Section>
                    <Heading>Static Properties:</Heading>
                    {$class.staticSchema.map(staticSchema => (
                        <MethodCard static property={staticSchema} $class={$class} redirect={redirect} />
                    ))}
                </Section>
            }
        </>
    )
})

const MethodCard = ({ property, instance, $class, redirect }) => (
    <Section>
        <Card elevation={9}
            onPress={property.datatype.documentationId ? () => redirect(`/documentation/${property.datatype.documentationId}`) : null}>
            <Card.Content>
                <pre>{$class.name}{instance ? '#' : '.'}{property.name}</pre>
                <Paragraph>{property.description}</Paragraph>
            </Card.Content>
        </Card>
    </Section>
)