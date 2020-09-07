import React from 'react'
import { tether, Container } from '@triframe/designer'

export const List = tether(function*({ Api }){
    let { User } = Api

    let users = yield User.all(`
       name
    `)

    return (
        <>
        </>
    )

})