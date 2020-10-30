import React from 'react'
import { toCamelCase } from '@triframe/core'
import { DatatypeDefinition } from './DatatypeDefinition'
import { ArgumentDefinition } from './ArgumentDefinitions'

export const DecoratorDefinition = ({ decorator, size = "sm" }) => (
    <pre style={{ margin: 3, fontSize: size === "lg" ? 20 : undefined }}>
        @{decorator.parent ? <>{toCamelCase(decorator.parent.name)}.</> : null}
        {decorator.name}{decorator.arguments.length > 0 &&
            <>(<ArgumentDefinition args={decorator.arguments} />)</>
        }{'\n'}
        property = defaultValue
    </pre>
)