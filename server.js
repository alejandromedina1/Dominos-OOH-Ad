const express = require('express')
const { Server } = require('socket.io')

//Serial Port configuration
const { SerialPort, ReadlineParser } = require('serialport');

const protocolConfiguration = {
    path: '/dev/cu.usbserial-A50285BI', //Use port connected to Arduino
    baudRate: 9600
}
const serialPort = new SerialPort(protocolConfiguration);
const parser = serialPort.pipe(new ReadlineParser);

// Express configuration
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

// First run on terminal: npm start
// To run on terminal: ngrok http 5050

const io = new Server(httpServer, {path: '/real-time' })

let user;

expressApp.post('/user', (request, response) => {
    user = request.body
    console.log(user);
    response.end();
})

expressApp.post('/gameResult', (request, response) => {
    console.log(request.body);
    let state = request.body;
    console.log(state.result);
    serialPort.write(state.result);
    response.end();
})

io.on('connection', (socket) => {
    console.log('Connected!', socket.id)

    socket.on('device-size', deviceSize => {
        socket.broadcast.emit('mupi-size', deviceSize)
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

let arduinoMessages = {
    motionSignal: 0
};

parser.on('data', (data) => {
    console.log(data);

    let dataArray = data.split(' ');
    arduinoMessages.motionSignal = parseInt(dataArray[0]);

    io.emit('arduino-message', arduinoMessages);
})


