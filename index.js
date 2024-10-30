var express = require('express')
var socket = require('socket.io')

var app = express()
var server = app.listen(1337, () => {
    console.log('listening on port 1337')
})

const io = socket(server, {
    pingInterval: 10000,
    pingTimeout: 5000
})

const RoomsManager = require('./RoomsManager')
const Rooms = new RoomsManager()

io.on('connection', (socket) => {
    console.log(`New connection from client: ${socket.id}`)

    socket.on('joinRoom', roomId => {
        console.log(`'joinRoom' by client: ${socket.id} with arg ${roomId}`)

        if (!Rooms.$.has(roomId)) return socket.emit('invalidRoom')

        var room = Rooms.$.get(roomId)
        room.addClient(socket)
        socket.join(room.id)

        console.log(`Client ${socket.id} joined room with id '${room.id}'`)
        socket.in(room.id).emit(`Client ${socket.id} joined`)
        socket.emit('joinedRoom', room.id, room.messages,)
    })

    socket.on('createRoom', () => {
        console.log(`'createMatch' by client: ${socket.id}`)

        var room = Rooms.createRoom()
        room.addClient(socket)
        Rooms.addRoom(room)
        socket.join(room.id)

        console.log(`Client ${socket.id} created room with id '${room.id}'`)
        socket.emit('roomCreated', room.id)
    })

    socket.on('send', (clientId, roomId, message) => {
        console.log(`${clientId} sent '${message}' to ${roomId}`)
        Rooms.get(roomId).messages.push({ clientId, message })
        socket.in(roomId).emit('messageRecieved', message, clientId)
    })
})

app.use(express.static('public'))