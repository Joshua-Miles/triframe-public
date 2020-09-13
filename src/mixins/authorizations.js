import { toForeignKeyName, toCamelCase } from '@triframe/core'

export const thisIsMe = ({ session, resource }) => 
    session.loggedInUserId === resource.id

export const iAmThe = property => ({ session, resource }) => {
    return session.loggedInUserId === resource[toCamelCase(toForeignKeyName(property))]
}

export const iAmAnAdmin = ({ session }) => 
    session.loggedInUserRole === 1


export const either = (...callbacks) => (payload) => callbacks.some(callback => callback(payload))