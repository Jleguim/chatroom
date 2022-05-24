class Room {
    constructor(id, isPublic = false) {
        this.messages = []
        this.clients = new Map()
        this.id = id
        this.isPublic = isPublic
    }
    addClient(client) {
        this.clients.set(client.id, client)
    }
}

module.exports = Room