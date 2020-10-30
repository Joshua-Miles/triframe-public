import React from 'react'
import { toCamelCase } from '@triframe/core'
import { DatatypeDefinition } from './DatatypeDefinition'
import { ArgumentDefinition } from './ArgumentDefinitions'

export const MethodDefinition = ({ method, size = "sm" }) => (
    <pre style={{ margin: 3, fontSize: size === "lg" ? 20 : undefined }}>
        {method.parent ? <>{toCamelCase(method.parent.name)}.</> : null}
        {method.name}(<ArgumentDefinition args={method.arguments} />): <DatatypeDefinition property={method.returns} />
    </pre>
)