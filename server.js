const express = require('express')
const { Server } = require('socket.io')
const PORT = 5050;
const SERVER_IP = '172.30.70.73' //Use computer's IP

const expressApp = express()
expressApp.use(express.json())
expressApp.use('/app', express.static('public-mobile'))
expressApp.use('/mupi', express.static('public-mupi'))

const httpServer = expressApp.listen(5050, () => {
    console.log(`http://${SERVER_IP}:${PORT}/app`)
    console.log(`http://${SERVER_IP}:${PORT}/mupi`)
})

// To run on terminal: http ngrok 5050

const io = new Server(httpServer, {path: '/real-time' })

expressApp.get('/app', (req, res) => {
    res.send({message: 'Connected to mobile!'})
})
expressApp.get('/mupi', (req, res) => {
    res.send({message: 'Connected to mupi!'})
})

io.on('connection', (socket) => { //Listening for webSocket connections
    console.log('Connected!', socket.id)
})


