import { draw } from "./draw"

export const Scribe = draw(({ a, any, warning, either, optional }) => (
    a.package({ title: 'Scribe', name: '@triframe/scribe' },{

        sql: a.templateTag
            // .describe()
            .templates('TriQL')
            .returns(a('Pipe')),

        Model: a.class
            .describe('A base class for resources that should be persisted in a database')
            .static({

                create: a.function({})
                    .describe(''),

                list: a.function({})
                    .describe(''),

                read: a.function({ id: a.number })
                    .describe('A function which retrieves a resource by ID'),

                where: a.function()
                    .describe(''),

                search: a.function()
                    .describe(),

                truncate: a.function()
                    .describe()

            })
            .instance({
                delete: a.function()
                    .describe('')
            }),

        Associations: a.group({
            hasMany: a.decorator,
            belongsTo: a.decorator,
            hasOne: a.decorator
        }),

        "Access Control": a.group({
            hidden: a.decorator,
            readonly: a.decorator,
            hiddenUnless: a.decorator,
            readonlyUnless: a.decorator
        }),

        Datatypes: a.group({

            derive: a.decorator,

            pk: a.decorator
                .describe('Defines an auto-incrementing primary key in the database'),

            serial: a.decorator
                .describe('Defines an auto-incrementing column in the database'),

            string: a.decorator
                .describe('Defines a varchar column in the database'),

            text: a.decorator
                .describe('Defines a text column in the database'),
            
            numeric: a.decorator
                .describe('Defines a numeric column in the database'),
            
            float: a.decorator
                .describe('Defines a float column in the database'),

            integer: a.decorator
                .describe('Defines a integer column in the database'),

            boolean: a.decorator
                .describe('Defines a boolean column in the database'),

            timestamp: a.decorator
                .describe('Defines a timestamp column in the database'),

            timestamptz: a.decorator
                .describe('Defines a timestamp column with a timezone in the database'),

            date: a.decorator
                .describe('Defines a date column in the database'),

            time: a.decorator
                .describe('Defines a time column in the database'),

            json: a.decorator
                .describe('Defines a json column in the database'),

            list: a.decorator
                .describe('Defines a list column in the database'),


        }),

        "Misc. Decorators": a.group({
            validate: a.decorator,
            session: a.decorator,
            shared: a.decorator,
            include: a.decorator
        }),

        connectDB: a.function({ options: a.object({
            user: a.string,
            password: a.string,
            database: a.string,
            port: a.string
        }) })
        .describe('This is usually called internally by Arbiter in a managed workflow'),
    })
))