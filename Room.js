class Room {
    constructor(id) {
        this.messages = []
        this.clients = new Map()
        this.id = id
    }
    addClient(client) {
        this.clients.set(client.id, client)
    }
}

module.exports = Room