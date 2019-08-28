const Instance = require('./models/Instance')
const Service = require('./models/Service')

const validateInstance = (data) => {
    if (!data.hasOwnProperty('address'))
        return false

    return new Instance(data.address)
}

const validateService = (data) => {
    if (!data.hasOwnProperty('id')
        || !data.hasOwnProperty('name')
        || !data.hasOwnProperty('instances')) return false

    return new Service(
        data.id,
        data.name,
        data.hasOwnProperty('description') ? data.description : ''
    )
}

module.exports = {
    validateInstance,
    validateService
}