const express = require('express')
const { Server } = require('socket.io')
const PORT = 5050;
const SERVER_IP = '172.30.70.73' //Use computer's IP

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

let user;

expressApp.post('/app', (request, response) => {
    user = request.body
    console.log(user);
    response.end();
})

io.on('connection', (socket) => {
    console.log('Connected!', socket.id)

    socket.on('device-size', deviceSize => {
        socket.broadcast.emit('mupi-size', deviceSize)
    })
    socket.on('mobile-instructions', instruction => {
        console.log(instruction)
        socket.broadcast.emit('mupi-instructions', instruction)
    })
    socket.on('interface', interface => {
        socket.broadcast.emit('currentInterface', interface)
    })
    socket.on('game-over', nextScreen => {
        socket.broadcast.emit('next-interface', nextScreen);
    })
    socket.on('sendingUser', user => {
        socket.broadcast.emit('catchingUser', user);
    })
})


