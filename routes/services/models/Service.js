class Service {
    constructor (id, name, description) {
        this.id = id
        this.name = name
        this.description = description
        this.instances = []
    }

    toJson () {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            instances: this.instances.map(instance => instance.toJson())
        }
    }
}

module.exports = Service
