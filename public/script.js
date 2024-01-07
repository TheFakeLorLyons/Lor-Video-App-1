/*  I wrote this myself, but it is a copy of the code from this tutorial:
/   https://www.youtube.com/watch?v=DvlyzDZDEq4
/   Thanks for teaching me how to code          
/   This is purely for my own self instruction    */

//This room has access to all the socket.io code as well as well as our roomID
//now we can call socket.io('join-room')

const socket    = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer    = new Peer(undefined, { //route host
    host: '/',                          //peer takes all the webRTC information for a user
    port: '3001'                        //and turns it into an easy to use id and to be used with 
})                                      //the rest of the peer library in order to connect peers on the network
const myVideo = document.createElement('video')
const peers = {}

myVideo.muted = true                    //mutes the audio from our own channel coming back at us

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream)

    myPeer.on('call', call => {
        call.answer(stream) //returns the callee's video to the caller
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', userId => {
        connectToNewUser(userId, stream)
    })
})

socket.on('user-disconnected', userId => {
    if(peers[userId]) peers[userId].close()
    console.log('our friend ' + userId + ' disconnected')
})

myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
})

/*socket.on('user-connected', userId => {
    console.log('User connected ' + userId)
})*/   //This was to make sure the code was working earlier

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
        video.remove() //when someone ends the call, it disconnects their video stream
    })

    peers[userId] = call
}

function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}