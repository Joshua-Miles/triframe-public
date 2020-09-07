import React from 'react'
import { tether, Avatar } from '@triframe/designer'

export const UserAvatar = tether(({ Api, props: { user, ...rest } }) =>{ 
    return user.profileUrl
        ? <Avatar.Image source={`${Api.url}${user.profileUrl}`} {...rest}/>
        : <Avatar.Icon icon="account" {...rest} color="white" />
})