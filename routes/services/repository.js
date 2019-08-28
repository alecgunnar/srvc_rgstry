const validator = require('./validator')

const services = [];
const index = {};

const getServices = () => {
    return services.map(service => service.toJson())
}

const getService = (id) => {
    const location = index[id]

    if (typeof location === 'undefined')
        return null

    return services[location].toJson()
}

const saveService = (data) => {
    if (!(service = validator.validateService(data)))
        return 400

    const {id} = service

    if (index.hasOwnProperty(id))
        return 409

    services.push(service)
    index[id] = services.findIndex(service => service.id === id)

    let i
    
    for (i = 0; i < data.instances.length; i++)
        if (saveInstance(service, data.instances[i]) >= 400)
            return 400

    return 201
}

const saveInstance = (addTo, data) => {
    if (!(instance = validator.validateInstance(data)))
        return 400

    const service = services.find(service => service.id === addTo.id)

    const existingInstance = service.instances.find(
        check => check.address === instance.address
    )

    if (existingInstance) {
        existingInstance.touch()
        return 200
    }

    service.instances.push(instance)

    return 201
}

module.exports = {
    getServices,
    getService,
    saveService,
    saveInstance
}