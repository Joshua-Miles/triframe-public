import { User } from './User'
export const convertEmails = async () => {
    let users = await User.list()
    users.forEach(user => user.email = user.email.toLowerCase())
}