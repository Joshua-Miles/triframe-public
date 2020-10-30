import React from 'react'
import { toPascalCase } from '@triframe/core'
import { DatatypeDefinition } from './DatatypeDefinition'

export const ComponentDefinition = ({ component, size = "sm" }) => (
    component.props.find( prop => prop.name === 'children')
        ? (
            <pre style={{ margin: 3, fontSize: size === "lg" ? 20 : undefined }}>
                {'<'}{toPascalCase(component.name)}<PropDefinition props={component.props.filter( prop => prop.name != 'children')} />{'>\n'}
                {'\t{...jsx...}\n'}
                {'</'}{toPascalCase(component.name)}{'>'}
            </pre>
        )
        : (
            <pre style={{ margin: 3, fontSize: size === "lg" ? 20 : undefined }}>
                {'<'}{toPascalCase(component.name)}{' '}<PropDefinition props={component.props} />{'/>'} : jsx
            </pre>
        )
)

const PropDefinition = ({ props }) => props.map(({ datatype, name, isOptional, ...rest }, index) =>
    <React.Fragment key={index}>
        {' '}{name}{isOptional ? '?' : null}:{' '}
        <DatatypeDefinition property={{ datatype, name, isOptional, ...rest }} />
    </React.Fragment>
)