import { draw } from "./draw"

export const Arbiter = draw(({ a, any, warning, either, optional }) => (
    a.package({ title: 'Arbiter', name: '@triframe.arbiter' },{
        connect: a.function({ url: a.string })
            .describe('A function which connects to an interface served by Arbiter at the provided url')
            .returns(a.promise.thatResolvesWith(
                a.object
                    .describe('The interface served at the provided url')
            )),
        serve: a.function({ 
            options: a.object({
                port: a.number,
                interface: a.object,
                session: a.object,
                database: a.object({
                    user: a.string,
                    password: a.string,
                    database: a.string,
                    port: a.string
                })
            })
        })
            .describe('Serves an interface over http/ws connection')
    })
))