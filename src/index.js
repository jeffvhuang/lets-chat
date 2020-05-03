const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')

const app = express();
const server = http.createServer(app)
const io = socketio(server)

const publicDirectoryPath = path.join(__dirname, '../public')

const port = process.env.PORT || 3000;

app.use(express.static(publicDirectoryPath))

// Callback function allows server to talk to each client that is connected
io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    // Send only to user who connected
    socket.emit('message', 'Welcome!')
    // Send to everyone except for the connected user
    socket.broadcast.emit('message', 'A new user has joined!')

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }

        // Send to everyone
        io.emit('message', message)
        // Send something back to user that sent this originally as acknowledgement
        callback()
    })

    socket.on('sendLocation', (coords) => {
        io.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left!')
    })
})

server.listen(port, () => {
    console.log('Server is up on port ' + port);
})