const Room = require('./Room')

class RoomsManager {
    constructor() {
        this.$ = new Map()
    }
    // I couldn't find the actual answer but it was found in StackOverflow :D
    _generateId() {
        var result = ''
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        var charactersLength = characters.length
        for (var i = 0; i < 3; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength))
        }
        return result
    }
    _idExists(id) {
        return this.$.has(id)
    }
    createRoom(isPublic = false) {
        var id = this._generateId()
        while (this._idExists(id)) {
            id = this._generateId()
        }

        var room = new Room(id, isPublic)
        return room
    }
    addRoom(room) {
        if (!(room instanceof Room)) return
        this.$.set(room.id, room)
    }
    get(id) {
        return this.$.get(id)
    }
    has(id) {
        return this.$.has(id)
    }
    toArray() {
        return Array.from(this.$.values())
    }
}

module.exports = RoomsManager