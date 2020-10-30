import React from 'react'
import { tether } from '@triframe/designer'
import { toPlural } from '@triframe/core'

export const DatatypeDefinition = tether(function* ({ props, redirect }) {
    const { plural = false, verbose = false, property = {} } = props
    const seperator = verbose ? ' or ' : ' | '
    if (property.datatype?.options) return property.datatype.options.map((option, index) =>
        <React.Fragment key={index}>
            <DatatypeDefinition property={option} verbose={verbose} />{index !== property.datatype.options.length - 1 ? seperator : null}
        </React.Fragment>
    )
    let datatype = property.datatype || {}
    let name = datatype.name || "any"
    if (plural) name = name === "any" ? "any" : toPlural(name)
    if (datatype.of && verbose) name = <span>{name} of <DatatypeDefinition plural property={datatype.of} /></span>
    if (datatype.of && !verbose) name = <span>{name}{'<'}<DatatypeDefinition property={datatype.of} />{'>'}</span>
    const style = {
        color: datatype.documentationId && !verbose ? 'blue' : undefined,
        cursor: datatype.documentationId ? 'pointer' : undefined
    }
    return (
        <span
            style={style}
            onClick={datatype.documentationId ? () => redirect(`/documentation/${datatype.documentationId}`) : null}>
            {name}
        </span>
    )
})