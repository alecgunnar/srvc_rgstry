class Instance {
    constructor (address) {
        this.address = address
        this.since = Date.now()
    }

    touch () {
        this.since = Date.now()
    }

    toJson () {
        return {
            address: this.address,
            since: this.since
        }
    }
}

module.exports = Instance
