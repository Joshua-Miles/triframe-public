import { toDashed } from '@triframe/core'

let serial = 1;
let hooks = {}
let byName = {}

let whenDefined = (name, callback) => {
    if(byName[name]) return callback(byName[name])
    hooks[name] = hooks[name] || []
    hooks[name].push(callback)
}

const resolve = obj => {
    obj.description = obj.description || ''
    obj.id = obj.id || serial++
    byName[obj.name] = obj
    entities[obj.id] = obj
    if(hooks[obj.name]) hooks[obj.name].forEach( callback => callback(obj))
    if(['class', 'method', 'decorator', 'component'].includes(obj.datatype.name) && obj.name) {
        obj.datatype.documentationId = obj.id
    }
    return obj
}

const newCursor = (data = {}) => {

    const cursor = (name) => {
        let datatype = { name, documentationId: null }
        whenDefined(name, obj => {
            datatype.documentationId = obj.id
        })
        return newBaseCursor({ ...data, datatype })
    }

    const properties = {

        warning: () => a => a,

        a: () => newCursor({ ...data }),

        either: () => (...options) => newBaseCursor({ ...data, datatype: { ...data.datatype, options: options.map( option => option.resolved() ) } }),

        optional: () => newCursor({ ...data, isOptional: true  }),

        resolved: () => resolve(data), // entities[++serial] = { ...data , id: serial },

    

        package: () => newPackageCursor({ ...data }),

        group: () => newGroupCursor({ ...data }),

        class: () => newClassCursor({ ...data }),

        function: () => newFunctionCursor({ ...data }),

        component: () => newComponentCursor({ ...data }),

        decorator: () => newDecoratorCursor({ ...data }),

        templateTag: () => newTemplateTagCursor({ ...data }),

        cliMethod: () => newCLIMethodCursor({...data}),



        any: () => () => newAnyCursor({ ...data }),

        jsx: () => () => newBaseCursor({ ...data, datatype: { name: 'jsx' }}),

        date: () => newBaseCursor({ ...data, datatype: { name: 'date' }}),

        null: () => newNullCursor({ ...data }),

        string: () => newStringCursor({ ...data }),

        number: () => newNumberCursor({ ...data }),

        array: () => newArrayCursor({ ...data }),

        boolean: () => newBooleanCursor({ ...data }),

        tuple: () => newTupleCursor({ ...data }),

        object: () => newObjectCursor({ ...data }),

        promise: () => newPromiseCursor({ ...data }),

    }
    for (let name in properties) {
        let property = properties[name]
        Object.defineProperty(cursor, name, {
            get: () => property()
        })
    }

    return cursor
}

const parseSchema = (schema, parent = null) => {
    let results = []
    for(let name in schema) {
        let thing = schema[name]
        thing.named(name)
        thing.parent(parent)
        thing = thing.resolved()
        results.push(thing)
    }
    return results
}

const newBaseCursor = (data) => ({
    thatEmits: function(){
        return this
    },
    describe: function (description) {
        data.description = description
        return this
    },
    annotate: function(...annotations){
        data.annotations = annotations
        return this
    },
    named: function (name) {
        data.name = name
        return this
    },
    parent: function(parent){
        data.parent = parent
        return this
    },
    resolved: () => resolve(data) //entities[++serial] = { ...data , id: serial }
})

const newPackageCursor = (data) => {
    data.datatype = { ...data.datatype, name: 'package' }
    let cursor = ({ title, description, name }, contentsSchema) => {
        data.title = title
        data.id = title.toLowerCase()
        data.name = name
        data.description = description
        data.contents = parseSchema(contentsSchema)
        return cursor
    }
    Object.assign(cursor,{
        ...newBaseCursor(data),
    })
    return cursor
}

const newGroupCursor = (data) => {
    data.datatype = { ...data.datatype, name: 'group' }
    data.contents = []
    let cursor = function(contentSchema){
        data.contents = parseSchema(contentSchema)
        data.contents.forEach( thing => {
            thing.group = data
        })
        return cursor
    }
    Object.assign(cursor,{
        ...newBaseCursor(data),
    })
    return cursor
}

const newClassCursor = (data) => {
    data.datatype = { ...data.datatype, name: 'class' }
    data.instanceSchema = []
    data.staticSchema = []
    return ({
        ...newBaseCursor(data),
        extends: function(parent){
            data.extends = parent.resolved()
            return this
        },
        constructor: function(construct){
            data.initialize = construct.resolved()
            return this
        },
        instance: function(properties){
            data.instanceSchema = parseSchema(properties, data)
            return this
        },
        static: function(properties){
            data.staticSchema = parseSchema(properties, data)
            return this
        }
    })
}

const newFunctionCursor = (data) => {
    data.datatype = { ...data.datatype, name: 'method' }
    data.arguments = []
    let cursor = function(args) {
        for(let argName in args){
            let arg = args[argName]
            if(argName === 'rest'){
                let [ name ] = Object.keys(arg);
                let [ type ]  = Object.values(arg);
                arg = newCursor().array.of(type).named(name)
            } else {
                arg = arg.named(argName)
            }
            arg = arg.resolved()
            if(argName === 'rest') arg.rest = true
            // arg.type = 'argument'
            arg.index = data.arguments.length
            data.arguments.push(arg)
        }
        return cursor
    }
    Object.assign(cursor, {
        ...newBaseCursor(data),
        returns: function(type) {
            data.returns = type.resolved()
            return this
        }
    })
    return cursor
}

const newComponentCursor = (data) => {
    data.datatype = { ...data.datatype, name: 'component' }
    data.props = []
    data.returns = { datatype: { name: 'jsx' }}
    let cursor = function(args) {
        for(let argName in args){
            let arg = args[argName]
            if(argName === 'rest'){
                ([ argName ] = Object.keys(arg));
                let [ type ]  = Object.values(arg);
                arg = newCursor().array.of(type)
            }
            arg = arg.named(argName).resolved()
            if(argName === 'rest') arg.rest = true
            // arg.type = 'argument'
            arg.index = data.props.length
            data.props.push(arg)
        }
        return cursor
    }
    Object.assign(cursor, {
        ...newBaseCursor(data)
    })
    return cursor
}

const newDecoratorCursor = (data) => {
    data.datatype = { ...data.datatype, name: 'decorator' }
    data.arguments = []
    let cursor = function(args) {
        for(let argName in args){
            let arg = args[argName]
            if(argName === 'rest'){
                ([ argName ] = Object.keys(arg));
                let [ type ]  = Object.values(arg);
                arg = newCursor().array.of(type)
            }
            arg = arg.named(argName).resolved()
            if(argName === 'rest') arg.rest = true
            // arg.type = 'argument'
            arg.index = data.arguments.length
            data.arguments.push(arg)
        }
        return cursor
    }
    Object.assign(cursor, {
        ...newBaseCursor(data),
        returns: function(type) {
            data.returns = type.resolved()
            return this
        }
    })
    return cursor
}


const newCLIMethodCursor = (data) => {
    data.datatype = { ...data.datatype, name: 'cliMethod' }
    data.arguments = []
    let cursor = function(args) {
        for(let argName in args){
            let arg = args[argName]
            if(argName === 'rest'){
                ([ argName ] = Object.keys(arg));
                let [ type ]  = Object.values(arg);
                arg = newCursor().array.of(type)
            }
            arg = arg.named(argName).resolved()
            if(argName === 'rest') arg.rest = true
            // arg.type = 'argument'
            arg.index = data.arguments.length
            data.arguments.push(arg)
        }
        return cursor
    }
    Object.assign(cursor, {
        ...newBaseCursor(data),
        returns: function(type) {
            data.returns = type.resolved()
            return this
        }
    })
    return cursor
}


const newTemplateTagCursor = (data) => {
    data.datatype = { ...data.datatype, name: 'templateTag' }
    data.arguments = []
    let cursor = function(args) {
        for(let argName in args){
            let arg = args[argName]
            if(argName === 'rest'){
                ([ argName ] = Object.keys(arg));
                let [ type ]  = Object.values(arg);
                arg = newCursor().array.of(type)
            }
            arg = arg.named(argName).resolved()
            if(argName === 'rest') arg.rest = true
            // arg.type = 'argument'
            arg.index = data.arguments.length
            data.arguments.push(arg)
        }
        return cursor
    }
    Object.assign(cursor, {
        ...newBaseCursor(data),
        templates: function(templates){
            data.templates = templates
            return this
        },
        returns: function(type) {
            data.returns = type.resolved()
            return this
        }
    })
    return cursor
}

const newAnyCursor = (data) => ({
    ...newBaseCursor({ ...data, datatype: { isAny: true, name: 'any' } }),
})

const newNullCursor = (data) => ({
    ...newBaseCursor({ ...data, datatype: { ...data.datatype, isPrimative: true, name: 'null' } }),
})

const newStringCursor = (data) => ({
    ...newBaseCursor({ ...data, datatype: { ...data.datatype, isPrimative: true, name: 'string' } }),
})

const newNumberCursor = (data) => ({
    ...newBaseCursor({ ...data, datatype: { ...data.datatype, isPrimative: true, name: 'number' } }),
})

const newBooleanCursor = (data) => ({
    ...newBaseCursor({ ...data, datatype: { ...data.datatype, isPrimative: true, name: 'boolean' } }),
})

const newArrayCursor = (data) => {
    data.datatype = data.datatype || {}
    Object.assign(data.datatype, { isPrimative: true, name: 'array' })
    return ({
        ...newBaseCursor(data),
        of: function (type) {
            data.datatype = data.datatype || {}
            data.datatype.of = type.resolved()
            return this
        }
    })
}

const newTupleCursor = (data) => {
    data.datatype = { ...data.datatype, name: 'tuple' }
    data.properties = []
    let cursor = function(properties) {
        for(let elementName in properties){
            let element = properties[elementName].named(elementName).resolved()
            element.index = data.properties.length
            // element.type = 'schema'
            data.properties.push(element)
        }
        return cursor
    }
    Object.assign(cursor, {
        ...newBaseCursor(data),
        returns: function(type) {
            data.returns = type
            return this
        },
        of: function (type) {
            data.datatype = data.datatype || {}
            data.datatype.of = type.resolved()
            return this
        }
    })
    return cursor
}

const newObjectCursor = (data) => {
    data.datatype = { ...data.datatype, name: 'object' }
    data.properties = []
    let cursor = function(properties) {
        for(let propertyName in properties){
            let property = properties[propertyName].named(propertyName).resolved()
            if(propertyName === 'rest'){
                ([ propertyName ] = Object.keys(property));
                let [ type ]  = Object.values(property);
                property = newCursor().array.of(type)
                property.rest = true
            }
            // property.type = 'property'
            data.properties.push(property)
        }
        return cursor
    }
    Object.assign(cursor, {
        ...newBaseCursor(data),
        returns: function(type) {
            data.returns = type.resolved()
            return this
        },
        of: function (type) {
            data.datatype = data.datatype || {}
            data.datatype.of = type.resolved()
            return this
        }
    })
    return cursor
}

const newPromiseCursor = (data) => {
    data.datatype = data.datatype || {}
    Object.assign(data.datatype, { isPrimative: true, name: 'promise', resolvesWith: newCursor().any() })
    return ({
        ...newBaseCursor(data),
        thatResolvesWith: function (type) {
            data.datatype.resolvesWith = type
            return this
        }
    })
}

export const entities = {}

export const draw = callback => callback(newCursor()).resolved()