const validator = require('./validator')

const services = [];
const index = {};

const grabService = (id) => {
    const location = index[id]

    if (typeof location === 'undefined')
        throw new Error('DOES NOT EXIST')
    
    return services[location]
}

const getServices = () => {
    return services.map(service => service.toJson())
}

const getService = (id) => {
    try {
        return grabService(id).toJson()
    } catch (err) {
        return null
    }
}

const saveService = (data) => {
    if (!(service = validator.validateService(data)))
        throw new Error('INVALID')

    const {id} = service

    if (index.hasOwnProperty(id))
        throw new Error('DUPLICATE')

    services.push(service)
    index[id] = services.findIndex(service => service.id === id)

    let i
    
    for (i = 0; i < data.instances.length; i++)
        saveInstance(service, data.instances[i])
}

const saveInstance = (addTo, data) => {
    if (!(instance = validator.validateInstance(data)))
        throw new Error('INVALID')

    const service = grabService(addTo.id)

    const existingInstance = service.instances.find(
        check => check.address === instance.address
    )

    if (existingInstance)
        throw new Error('DUPLICATE')

    service.instances.push(instance)
}

const touchInstance = (on, address) => {
    const service = grabService(on.id)

    service.grabInstance(address).touch()
}

module.exports = {
    getServices,
    getService,
    saveService,
    saveInstance,
    touchInstance
}