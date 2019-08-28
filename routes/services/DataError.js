class DataError {
    constructor (reason) {
        this.reason = reason
    }

    toHttpStatusCode () {
        switch (this.reason) {
            case "DUPLICATE":
                return 409
            case "NONEXISTENT":
                return 404
            default:
                return 400
        }
    }
}

module.exports = DataError
