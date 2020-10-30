import { draw } from "./draw"

export const Core = draw(({ a, any, warning, either, optional }) => {

    const emit = a.function({ payload: any() })

    const propertyValidator = a.function({
        payload: a.object({
            label: a.string,
            property: any(),
            resource: a('Resource'),
            errors: a.array.of(a.string)
        })
    })



    const Pipe = a.class
        .describe('A composable observable. Pipes wrap a given process that might need to emit multiple times. Emitted values are cached and provided when the observable is inspected. The given process may yield any number of Promises or Pipes, here called dependent Pipes. The emition of a dependent Pipe will result in the given process being re-invoked; any actions will be repeated, but any dependent Pipes (if equivalent) will yield their cached values.')
        .annotate(
            warning('A depentent Pipe will only be recognized as equivalent on subsequent re-invokations if it\'s process is strictly equivalent. This is why it is common to define the process for a Pipe in a modules global scope, rather than where the Pipe is created.')
        )
        .constructor(a.function({ process: either(emit, a.tuple({ thisArg: any().describe('The process will be invoked in the context of this object'), emit })), rest: { args: any() } })
            .returns(a('Pipe'))
            .describe('If a tuple is provided as the first argument, the process will be invoked in the context of the thisArg (the first element in the tuple). emit can be invoked by the process at any time, any number of times, and what is passed to it will be emitted to the observers of the Pipe')
        )
        .instance({
            observe: a.function({ callback: a.function({ payload: any() }) })
                .returns(any())
                .describe('A callback that will be invoked anytime the Pipe emits'),

            then: a.function({ callback: a.function({ payload: any() }) })
                .returns(any())
                .describe('A callback that will be invoked the first time the Pipe emits'),

            destroy: a.function()
                .returns(any())
                .describe('Destroys the Pipe, removing all observers and destroying any dependent Pipes'),

            isEqual: a.function({ pipe: a('Pipe') })
                .returns(a.boolean)
                .describe('Checks to see if two Pipes are equal')
        })
        .static({

            isPipe: a.function({ possiblePipe: any() })
                .returns(a.boolean)
                .describe('Checks to see if an object is a Pipe')

        })


    const EventEmitter = a.class
        .describe('EventEmitter\'s allow users to listen for and emit arbitrary events. Events can be subscribed to using the whole event name, or by using "*" as a wildcard anywhere in the event name.')
        .instance({

            on: a.function({ eventOrEvents: either(a.string, a.array.of(a.string)), callback: a.optional.function({ payload: any() }) })
                .returns(a('Pipe').thatEmits({ payload: any() }))
                .describe('Returned Pipe emits/optional callback is invoked when the provided event is/events are emitted'),

            emit: a.function({ event: a.string, payload: any() })
                .returns(a.promise.thatResolvesWith({ null: a.null }))
                .describe('Emits an event, returns a Promise that resolves after all event listeners have settled'),

            nowAndOn: a.function({ eventOrEvents: either(a.string, a.array.of(a.string)), callback: a.optional.function({ payload: any() }) })
                .returns(a('Pipe').thatEmits({ payload: any() }))
                .describe('Returned Pipe emits/optional callback is invoked once after calling context has settled, and again when the provided event is/events are emitted'),

        })

    const ResourceValidator = a.class
        .describe('A set of utilities to manage the validation of a given resource')
        .instance({
            addHandler: a.function({ propertyName: a.string, validator: propertyValidator })
                .describe('Adds a validation callback for a specified property'),

            errorMessageFor: a.function({ propertyName: a.string })
                .describe('Returns an aggregated error message for a given property'),

            shouldShowErrorsFor: a.function({ propertyName: a.string })
                .returns(a.boolean)
                .describe('Given a property name, returns whether or not errors for that property should be visible'),

            showErrorsFor: a.function({ propertyName: a.string })
                .describe('Marks the error messages for a given property to be visible and emits a change event on the resource (in designer/arbiter-react, this will result in a component re-render)'),

            hideErrorsFor: a.function({ propertyName: a.string })
                .describe('Marks the error messages for a given property to be hidden and emits a change event on the resource (in designer/arbiter-react, this will result in a component re-render)'),

            showAllErrors: a.function({})
                .describe('Marks all error messages for the resource to be visible and emits a change event on the resource (in designer/arbiter-react, this will result in a component re-render)'),

            hideAllErrors: a.function({})
                .describe('Marks the error messages for a given property to be hidden and emits a change event on the resource (in designer/arbiter-react, this will result in a component re-render)'),

            isInvaid: a.boolean
                .describe('True if any validations on the resource generate errors; otherwise false'),

            isValid: a.boolean
                .describe('False if any validations on the resource generate errors; otherwise true'),
        })

    const Resource = a.class
        .describe('A base class for application logic to extend')
        .extends(a('EventEmitter'))
        .constructor(a.function({ attributes: a.optional.object }))
        .instance({
            uid: either(a.string, a.null)
                .describe('A unique identifier for the resource, in the form of `{Class}.{this.id}`. If `this.id` is undefined, the `uid` will evaluate to null'),

            validation: a('ResourceValidator').describe('A Validator for the Resource'),

            startBatchUpdate: a.function({})
                .describe('Stages the resource for multiple mutations. All change events will be suspended untill commitBatchUpdate is called (in designer/arbiter-react, this can help to optimize the number of component re-renders, in arbiter it can help to optimize the number client-server synchronization waves)'),

            commitBatchUpdate: a.function({})
                .describe('Emits a single change event, and restores the normal propogation of change events')
        })
        .static({

            on: a.function({ eventOrEvents: either(a.string, a.array.of(a.string)), callback: a.optional.function({ payload: any() }) })
                .returns(a('Pipe').thatEmits({ payload: any() }))
                .describe('Returned Pipe emits/optional callback is invoked when the provided event is/events are emitted on the target class'),

            emit: a.function({ event: a.string, payload: any() })
                .returns(a.promise.thatResolvesWith({ null: a.null }))
                .describe('Emits an event, returns a Promise that resolves after all event listeners have settled on the target class'),

            nowAndOn: a.function({ eventOrEvents: either(a.string, a.array.of(a.string)), callback: a.optional.function({ payload: any() }) })
                .returns(a('Pipe').thatEmits({ payload: any() }))
                .describe('Returned Pipe emits/optional callback is invoked once after calling context has settled, and again when the provided event is/events are emitted on the target class'),

        })

    const List = a.class
        .describe('A wrapper which augments normal array behavior to record list mutations for use in arbiter')
        .extends(a.array)
        .instance({

            on: a.function({ eventOrEvents: either(a.string, a.array.of(a.string)), callback: a.optional.function({ payload: any() }) })
                .returns(a('Pipe').thatEmits({ payload: any() }))
                .describe('Returned Pipe emits/optional callback is invoked when the provided event is/events are emitted'),

            emit: a.function({ event: a.string, payload: any() })
                .returns(a.promise.thatResolvesWith({ null: a.null }))
                .describe('Emits an event, returns a Promise that resolves after all event listeners have settled'),

            insert: a.function({ element: any(), index: a.number })
                .describe('Inserts the element into a given index in the array, offseting elements at that or a higher index'),

            replace: a.function({ index: a.number, value: any() })
                .describe('Inserts the value into a given index in the array, replacing the existing element at the index if it exists'),

            remove: a.function({ startIndex: a.number, endIndex: a.optional.number })
                .describe('Removes the elements from index startIndex to the endIndex, inclusive. If no endIndex is provided, only one element is removed'),

            mapInPlace: a.function({ callback: a.function({ element: any(), index: a.number }) })
                .describe('Maps over the array. Will replace each element in the existing array with the return value of the callback')

        })



    const Inflection = a.group({
        toPlural: a.function({ string: a.string })
            .returns(a.string)
            .describe('Returns a plural form of the provided string'),

        toSingular: a.function({ string: a.string })
            .returns(a.string)
            .describe('Returns a singular form of the provided string'),

        toCamelCase: a.function({ string: a.string })
            .returns(a.string)
            .describe('Returns the provided string in camel case'),

        toPascalCase: a.function({ string: a.string })
            .returns(a.string)
            .describe('Returns the provided string in pascal case'),

        toTitle: a.function({ string: a.string })
            .returns(a.string)
            .describe('Returns the provided string in title case'),

        toUnderscored: a.function({ string: a.string })
            .returns(a.string)
            .describe('Returns the provided string with underscores in place of spaces'),

        toDashed: a.function({ string: a.string })
            .returns(a.string)
            .describe('Returns the provided string with dashes in place of spaces'),

        toHumanized: a.function({ string: a.string })
            .returns(a.string)
            .describe('Returns the provided string with spaces in place of underscores'),

        toCapitalized: a.function({ string: a.string })
            .returns(a.string)
            .describe('Returns the provided string with an uppercase first letter'),

        toTableName: a.function({ string: a.string })
            .returns(a.string)
            .describe('Returns a plural, underscored string'),

        toColumnName: a.function({ string: a.string })
            .returns(a.string)
            .describe('Returns an underscored string'),

        toClassName: a.function({ string: a.string })
            .returns(a.string)
            .describe('Returns a singular, pacal cased string'),

        toForeignKeyName: a.function({ string: a.string })
            .returns(a.string)
            .describe('Returns an underscored string with an `_id` suffix'),

        replaceNumbersWithOrdianls: a.function({ string: a.string })
            .returns(a.string)
            .describe('Returns a string with numbers properly suffixed with either `st`, `nd`, `rd`, or `th`'),

    })

    const Iterators = a.group({

        each: a.function({ collection: either(a.object, a.array), callback: a.function({ key: either(a.string, a.number), value: any(), collection: a.object }) })
            .returns(either(a.object, a.array))
            .describe('Runs the callback function once for each property of the provided collection'),

        map: a.function({ collection: either(a.object, a.array), callback: a.function({ key: either(a.string, a.number), value: any(), collection: a.object }) })
            .returns(either(a.object, a.array))
            .describe('Runs the callback function once for each property of the provided collection. Returns a collection of the same type, with each element replaced by the return value of the callback'),

        filter: a.function({ collection: either(a.object, a.array), callback: a.function({ key: either(a.string, a.number), value: any(), collection: a.object }).returns(a.boolean) })
            .returns(either(a.object, a.array))
            .describe('Runs the callback function once for each property of the provided collection. Returns a collection of the same type, with only the elements for which the return value of the callback was truthy'),

        find: a.function({ collection: either(a.object, a.array), callback: a.function({ key: either(a.string, a.number), value: any(), collection: a.object }).returns(a.boolean) })
            .returns(any())
            .describe('Runs the callback function once for each property of the provided collection. Returns the first element for which the return value of the callback was truthy'),


        eachAsync: a.function({ collection: either(a.object, a.array), callback: a.function({ key: either(a.string, a.number), value: any(), collection: a.object }) })
            .returns(a.promise.thatResolvesWith(either(a.object, a.array)))
            .describe('Runs the callback function once for each property of the provided collection, waiting for any Promises returned in parallel. Returns a Promise that resolves once all collection elements have been processed'),

        mapAsync: a.function({ collection: either(a.object, a.array), callback: a.function({ key: either(a.string, a.number), value: any(), collection: a.object }) })
            .returns(a.promise.thatResolvesWith(either(a.object, a.array)))
            .describe('Runs the callback function once for each property of the provided collection, waiting for any Promises returned in parallel. Returns a Promise that resolves once all collection elements have been processed. The Promise will resolve with a collection of the same type, with each element replaced by the resolved value of the callback'),

        filterAsync: a.function({ collection: either(a.object, a.array), callback: a.function({ key: either(a.string, a.number), value: any(), collection: a.object }).returns(a.boolean) })
            .returns(a.promise.thatResolvesWith(either(a.object, a.array)))
            .describe('Runs the callback function once for each property of the provided collection, waiting for any Promises returned in parallel. Returns a Promise that resolves once all collection elements have been processed. The Promise will resolve with a collection of the same type, with only the elements for which the resolved value of the callback was truthy'),

        findAsync: a.function({ collection: either(a.object, a.array), callback: a.function({ key: either(a.string, a.number), value: any(), collection: a.object }).returns(a.boolean) })
            .returns(a.promise.thatResolvesWith(any()))
            .describe('Runs the callback function once for each property of the provided collection, waiting for any Promises returned in parallel. Returns a Promise that resolves once all collection elements have been processed. The Promise will resolve with the first element for which the resolved value of the callback was truthy'),

        eachSync: a.function({ collection: either(a.object, a.array), callback: a.function({ key: either(a.string, a.number), value: any(), collection: a.object }) })
            .returns(a.promise.thatResolvesWith(either(a.object, a.array)))
            .annotate(warning('Because each collection element is processed sequentially, Promises returned by the callback will pause the processing of the collection. This can result in very long processing times when processing large collections'))
            .describe('Runs the callback function once for each property of the provided collection, waiting for any Promises returned sequentially. Returns a Promise that resolves once all collection elements have been processed'),

        mapSync: a.function({ collection: either(a.object, a.array), callback: a.function({ key: either(a.string, a.number), value: any(), collection: a.object }) })
            .returns(a.promise.thatResolvesWith(either(a.object, a.array)))
            .annotate(warning('Because each collection element is processed sequentially, Promises returned by the callback will pause the processing of the collection. This can result in very long processing times when processing large collections'))
            .describe('Runs the callback function once for each property of the provided collection, waiting for any Promises returned sequentially. Returns a Promise that resolves once all collection elements have been processed. The Promise will resolve with a collection of the same type, with each element replaced by the resolved value of the callback'),

        filterSync: a.function({ collection: either(a.object, a.array), callback: a.function({ key: either(a.string, a.number), value: any(), collection: a.object }).returns(a.boolean) })
            .returns(a.promise.thatResolvesWith(either(a.object, a.array)))
            .annotate(warning('Because each collection element is processed sequentially, Promises returned by the callback will pause the processing of the collection. This can result in very long processing times when processing large collections'))
            .describe('Runs the callback function once for each property of the provided collection, waiting for any Promises returned sequentially. Returns a Promise that resolves once all collection elements have been processed. The Promise will resolve with a collection of the same type, with only the elements for which the resolved value of the callback was truthy'),

        findSync: a.function({ collection: either(a.object, a.array), callback: a.function({ key: either(a.string, a.number), value: any(), object: a.object }).returns(a.boolean) })
            .returns(a.promise.thatResolvesWith(any()))
            .annotate(warning('Because each collection element is processed sequentially, Promises returned by the callback will pause the processing of the collection. This can result in very long processing times when processing large collections'))
            .describe('Runs the callback function once for each property of the provided collection, waiting for any Promises returned sequentially. Returns a Promise that resolves once all collection elements have been processed. The Promise will resolve with the first element for which the resolved value of the callback was truthy'),

        index: a.function({
            collection: either(a.object, a.array),
            index: optional.either(a.string, a.function({ key: a.string, element: any() }).returns(a.string)),
            select: optional.either(a.string, a.function({ key: a.string, element: any() }).returns(any())),
            defaultValue: optional.any()
        })
            .returns(a.object)
            .describe('Re-structures a collection. If index is a string, the collection is assumed to be a collection of objects, and the string will be used as a property of each object to define the new key of the object in the result object. If select is a string, the collection is assumed to be a collection of objecs, and the string will be used as a property of each object to define the new value of the object in the result object. If either argument is a function, the function will be invoked and it\'s return value used instead. The defaultValue, when provided, will replace every element in the result object that would otherwise be undefined'),

        group: a.function({
            collection: either(a.object, a.array),
            index: optional.either(a.string, a.function({ key: a.string, element: any() }).returns(a.string)),
            select: optional.either(a.string, a.function({ key: a.string, element: any() }).returns(any())),
            defaultValue: optional.any()
        })
            .returns(a.object.of(a.array))
            .describe('Re-structures a collection. Unlike index, each key in the result object will map to an array of values produced by the functinon. If index is a string, the collection is assumed to be a collection of objects, and the string will be used as a property of each object to define the new key of the object in the result object. If select is a string, the collection is assumed to be a collection of objecs, and the string will be used as a property of each object to define the new value of the object in the result object. If either argument is a function, the function will be invoked and it\'s return value used instead. The defaultValue, when provided, will replace every element in the result object that would otherwise be undefined'),

    })


    const Metadata = a.group({

        getMetadata: a.function({ target: either(a.object, a.class), key: a.string })
            .returns(a.object)
            .describe('Retrieves the metadata associated with a particular class or class instance'),

        saveMetadata: a.function({ target: either(a.object, a.class), key: a.string, metadata: a.object })
            .describe('Merges the provided metadata object into the metadata for the provided class or class instance'),

        metadata: a.object
            .describe('A collection of all saved metadata')
    })

    return a.package(
        { title: 'Core', name: '@triframe/core', description: 'blah blah' },
        { Pipe, EventEmitter, List, Resource, ResourceValidator, Inflection, Iterators, Metadata }
    )
})