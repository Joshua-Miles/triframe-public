
export function* CurrentUser({ Api }) {
    const { User } = Api

    const currentUser = yield User.current(`
        *,
        numberOfUnReadNotifications,
        notifications(orderBy: notifications.id, orderDirection: DESC) {
            *
        },
        invites {
            teamId,
            inviteeId, 
            team {
                name,
                members {
                    name,
                    profileUrl
                }
            }
            
        },
        team {
            name,
            invites {
                invitee {
                    name,
                    profileUrl,
                    email
                }
            }
        }
    `)

    return currentUser
}