import React from 'react'
import { toCamelCase } from '@triframe/core'
import { DatatypeDefinition } from './DatatypeDefinition'
import { ArgumentDefinition } from './ArgumentDefinitions'

export const TemplateTagDefinition = ({ templateTag, size = "sm" }) => (
    <pre style={{ margin: 3, fontSize: size === "lg" ? 20 : undefined }}>
        {templateTag.name}{templateTag.arguments.length > 0 &&
            <>(<ArgumentDefinition args={templateTag.arguments} />)</>
        }`{'\n'}
        {`  `}{templateTag.templates}{`\n`}
        ` : <DatatypeDefinition property={templateTag.returns} />
    </pre>
)