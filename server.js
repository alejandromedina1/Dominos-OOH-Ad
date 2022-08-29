const express = require('express')
const { Server } = require('socket.io')
const PORT = 5050;
const SERVER_IP = '192.168.1.2' //Use computer's IP

const expressApp = express()
expressApp.use(express.json())
expressApp.use('/app', express.static('public-mobile'))
expressApp.use('/mupi', express.static('public-mupi'))

const httpServer = expressApp.listen(PORT, () => {
    console.log(`http://${SERVER_IP}:${PORT}/app`)
    console.log(`http://${SERVER_IP}:${PORT}/mupi`)
})

// To run on terminal: ngrok http 5050

const io = new Server(httpServer, {path: '/real-time' })

io.on('connection', (socket) => {
    console.log('Connected!', socket.id)

    socket.on('device-size', deviceSize => {
        socket.broadcast.emit('mupi-size', deviceSize)
    })
    socket.on('mobile-instructions', instructions => {
        console.log(instructions)
        socket.broadcast.emit('mupi-instructions', instructions)
    })
    socket.on('interface', interface => {
        socket.broadcast.emit('interface', interface)
    })
    socket.on('game over', interface => {
        socket.broadcast.emit('interface', interface);
    })
})


