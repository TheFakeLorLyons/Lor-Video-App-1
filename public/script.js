//This room has access to all the socket.io code as well as well as our roomID
//now we can call socket.io('join-room')

const socket = io('/')

socket.emit('join-room', ROOM_ID, 10)

socket.on('user-connected', userId => {
    console.log('User connected ' + userId)
})