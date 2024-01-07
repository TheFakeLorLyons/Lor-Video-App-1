/*  I wrote this myself, but it is a copy of the code from this tutorial:
/   https://www.youtube.com/watch?v=DvlyzDZDEq4
/   Thanks for teaching me how to code          
/   This is purely for my own self instruction    */

const express = require('express')
const app     = express()
const server  = require('http').Server(app)
const io      = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.broadcast.to(roomId).emit('user-connected', userId) //joins a room and tells everyone

        socket.on('disconnect', () => {
            socket.broadcast.to(roomId).emit('user-disconnected', userId)
        } )
    })
})

server.listen(3000)