import { hash } from 'bcrypt'
import { User } from './User'

export async function seed(){
    let [ user ] = await User.where({ email: 'joshua@christian-coder.dev'})
    if(user) throw Error('Already seeded')
    await User.create({ role: User.Roles.Admin, email: 'joshua@christian-coder.dev', passwordDigest: await hash(process.env.ADMIN_PASSWORD, 10), name: 'Josh'})
}