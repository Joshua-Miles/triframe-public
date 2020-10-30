import React from 'react'
import { DatatypeDefinition } from './DatatypeDefinition'

export const ArgumentDefinition = ({ args, seperator=", " }) => args.map(({ datatype, rest, name, isOptional, ...remaining }, index) =>
<React.Fragment key={index}>
    {rest && '...'}{name}{isOptional ? '?' : null}:{' '}
    <DatatypeDefinition property={{ datatype, name, isOptional, ...remaining }} />{index !== args.length - 1 ? seperator : null}
</React.Fragment>
)