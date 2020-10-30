import React from 'react'
import { Subheading, Badge, Caption, Section, Divider } from '@triframe/designer'
import { DatatypeDefinition } from "./DatatypeDefinition"
import { MethodDefinition } from './MethodDefinition'

export const SchemaDefinition = function ({ schema }) {
    console.log(schema)
    return (
        <>
            {schema.map((property, index) => (
                <Section key={index}>
                    <Subheading>
                        {property.rest && '...'}{property.name}
                        <Badge style={{ padding: 5, marginLeft: 10 }}>
                            <DatatypeDefinition
                                property={property}
                                verbose
                            />
                        </Badge>
                    </Subheading>
                    <PropertyDetails property={property} />
                </Section>
            ))}
            <Divider />
        </>
    )
}


const PropertyDetails = ({ property }) => {
    return (
        <>
            {property.description ? <Caption>{property.description}</Caption> : null}
            {property.datatype.name === 'method' ? <MethodDefinition method={property} /> : null}
            {property.datatype.name === 'object' ? <NestedProperties object={property} /> : null}
            {property.datatype.name === 'tuple' ? <NestedTuple tuple={property} /> : null}
            {property.datatype?.options && 
                <>
                    {property.datatype.options.map( (x, index) => 
                        <React.Fragment key={index}><Caption>{property.datatype.options[index].datatype.name}:</Caption><PropertyDetails property={x} /></React.Fragment>
                    )}
                </>
            }
        </>
    )
}

const NestedProperties = ({ object }) => {
    return (
        <>
            {object.properties.length ? <Caption>Properties:</Caption> : null}
            <ul style={{ margin: 0, listStyle: 'none' }}>
                {object.properties.map((property, index) => (
                    <li key={index}>
                        <pre style={{ display: 'inline' }}>
                            {property.name}
                        </pre>
                        <Badge style={{ padding: 5, marginLeft: 10 }}>
                            <DatatypeDefinition verbose property={property} />
                        </Badge>
                        <div>
                            <PropertyDetails property={property} />
                        </div>
                    </li>
                ))}
            </ul>
        </>
    )
}

const NestedTuple = ({ tuple }) => {
    return (
        <>
            <ul style={{ margin: 0, listStyle: 'none' }}>
                {tuple.properties.map((property, index) => (
                    <li key={index}>
                        <pre style={{ display: 'inline' }}>
                            {index + 1}. {property.name}
                        </pre>
                        <Badge style={{ padding: 5, marginLeft: 10 }}>
                            <DatatypeDefinition verbose property={property} />
                        </Badge>
                        <div>
                            <PropertyDetails property={property} />
                        </div>
                    </li>
                ))}
            </ul>
        </>
    )
}