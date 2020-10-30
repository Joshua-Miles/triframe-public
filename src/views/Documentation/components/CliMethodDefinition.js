import React from 'react'
import { toCamelCase } from '@triframe/core'
import { DatatypeDefinition } from './DatatypeDefinition'
import { ArgumentDefinition } from './ArgumentDefinitions'

export const CliMethodDefinition = ({ method, size = "sm" }) => (
    <pre style={{ margin: 3, fontSize: size === "lg" ? 20 : undefined }}>
        npx triframe {method.name} <ArgumentDefinition args={method.arguments} seperator=" " /> 
    </pre>
)