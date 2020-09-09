import React from 'react'
import { tether, Appbar, Heading, Tab, Area, Button, TouchableOpacity, Menu, List, Badge } from '@triframe/designer'
import { when, otherwise } from '@triframe/confectioner'
import { CurrentUser } from '../../contexts/CurrentUser'

export const Notifications = tether(function* ({ Api, redirect, useContext }) {
    const { User } = Api

    const currentUser = yield useContext(CurrentUser)
    if (currentUser === null) return null

    const menu = yield { isVisible: false }

    const showMenu = () => {
        menu.isVisible = true
        currentUser.clearNotifications()
    }

    const hideMenu = () => {
        menu.isVisible = false
    }

    return (
        <>
            <Button icon="bell" onPress={showMenu} />
            {when(currentUser.numberOfUnReadNotifications > 0, () => (
                <Badge style={{ position: 'absolute', top: 10, right: 55 }}>
                    {currentUser.numberOfUnReadNotifications}
                </Badge>
            ))}
            <Menu visible={menu.isVisible} anchor={{ x: window.innerWidth - 300, y: 5 }} onDismiss={hideMenu}>
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
        </>
    )
})