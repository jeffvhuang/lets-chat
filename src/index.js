const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')

const app = express();
const server = http.createServer(app)
const io = socketio(server)

const publicDirectoryPath = path.join(__dirname, '../public')

const port = process.env.PORT || 3000;

app.use(express.static(publicDirectoryPath))

let count = 0

// Callback function talks to each client that connects
io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.emit('countUpdated', count)

    socket.on('increment', () => {
        count++
        io.emit('countUpdated', count)
    })
})

server.listen(port, () => {
    console.log('Server is up on port ' + port);
})