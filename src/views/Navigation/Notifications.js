import React from 'react'
import { tether, Appbar, Heading, Tab, Area, Button, TouchableOpacity, Menu, List, Badge } from '@triframe/designer'
import { when, otherwise } from '@triframe/confectioner'
import { CurrentUser } from '../../contexts/CurrentUser'

export const Notifications = tether(function* ({ Api, redirect, useContext }) {
    const { User } = Api

    const currentUser = yield useContext(CurrentUser)
    if(currentUser === null) return null

    const menu = yield { isVisible: false }

    const showMenu = () => {
        menu.isVisible = true
        currentUser.clearNotifications()
    }

    const hideMenu = () => {
        menu.isVisible = false
    }

    const bellButton = (
        <>
            <Button icon="bell" onPress={showMenu} />
            {when(currentUser.numberOfUnReadNotifications > 0, () => (
                <Badge style={{ position: 'absolute', top: 15, right: 10 }}>
                    {currentUser.numberOfUnReadNotifications}
                </Badge>
            ))}
        </>
    )

    return (
        <Menu visible={menu.isVisible} anchor={bellButton} onDismiss={hideMenu}>
            {when(currentUser.notifications.length > 0, () => (
                currentUser.notifications.map(notification => (
                    <Menu.Item
                        icon={notification.icon}
                        title={notification.message}
                        onPress={() => redirect(notification.path)}
                    />
                ))
            ),
                otherwise(() => (
                    <Menu.Item
                        title="No Notifications to Display"
                    />
                ))
            )}
        </Menu>
    )
})