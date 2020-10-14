const socket = io()

var username = null
var roomID = null

socket.on('event', (data) => console.log(data))
socket.on('message', (data) => console.log(data))

// https://stackoverflow.com/a/57192874
var params = new URLSearchParams(document.location.search)
roomID = params.get('room')

socket.on('connect', () => {
    username = socket.id

    if (roomID) joinRoomFunc(roomID)

    function createRoomFunc() {
        username = prompt('Display name:', username) || username
        socket.emit('createRoom', null)

        socket.on('roomCreated', id => {
            changeRoomID(id)
            toggleChatMode()
            console.log('created room ' + id)
        })
    }

    function joinRoomFunc() {
        const joinRoomId = document.getElementById('roomIdInput')

        username = prompt('Display name:', username) || username
        socket.emit('joinRoom', (roomID) ? roomID : joinRoomId.value)

        socket.on('joinedRoom', (id, pasteMessages) => {
            changeRoomID(id)
            toggleChatMode()

            pasteMessages.forEach(({ message, clientId }) => displayMessage(message, clientId))
            console.log('joined room ' + id)
        })
    }

    function changeRoomID(newId) {
        const idDisplay = document.getElementById('matchId')
        const invite = document.getElementById('inviteLink')

        roomID = newId
        idDisplay.innerText = `Room ID: ${roomID}`
        invite.href = `/?room=${roomID}`
    }

    function toggleChatMode() {
        const init = document.getElementById('init')
        const chat = document.getElementById('chat')

        init.hidden = !init.hidden
        chat.hidden = !chat.hidden
    }

    function displayMessage(message, clientId) {
        console.log(message)
        var m = `<p>${clientId}: ${message}</p>`
        feed.innerHTML += m
    }

    const createRoom = document.getElementById('createRoomBtn')
    const joinRoom = document.getElementById('joinRoomBtn')

    createRoom.onclick = createRoomFunc
    joinRoom.onclick = joinRoomFunc

    const sendBtn = document.getElementById('sendBtn')
    const toSend = document.getElementById('toSend')
    const feed = document.getElementById('feed')

    sendBtn.onclick = () => {
        if (toSend.value == '') return
        displayMessage(toSend.value, username)
        socket.emit('send', username, roomID, toSend.value)
        toSend.value = ''
    }

    socket.on('messageRecieved', displayMessage)
})