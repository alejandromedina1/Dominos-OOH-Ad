const express = require('express')
const {
    Server
} = require('socket.io')
const cors = require("cors")
const {
    FireStoreDB
} = require("./firebase-config.js")

const leadsCollection = new FireStoreDB('Leads')
const noLeadsCollection = new FireStoreDB('NoLeads');

//Serial Port configuration
const {
    SerialPort,
    ReadlineParser
} = require('serialport');
const {
    request,
    response
} = require('express')

const protocolConfiguration = {
    path: '/dev/cu.usbserial-A50285BI', //Use port connected to Arduino
    baudRate: 9600
}
const serialPort = new SerialPort(protocolConfiguration);
const parser = serialPort.pipe(new ReadlineParser);

// Express configuration
const PORT = 5050;

const expressApp = express()
expressApp.use(cors({
    origin: "*"
}))
expressApp.use(express.json())
expressApp.use('/app', express.static('public-mobile'))
expressApp.use('/mupi', express.static('public-mupi'))

const httpServer = expressApp.listen(PORT, () => {
    console.log(`http://localhost:${PORT}/app`)
    console.log(`http://localhost:${PORT}/mupi`)
})

// First run on terminal: npm start
// To run on terminal: ngrok http 5050

const io = new Server(httpServer, {
    path: '/real-time'
})

let userName = undefined;


expressApp.post('/gameResult', (request, response) => {
    console.log(request.body);
    let state = request.body;
    console.log(state.result);
    serialPort.write(state.result);
    response.end();
})

expressApp.get('/leads', (request, response) => {
    timeStamp();
    leadsCollection.getCollection()
        .then((leads) => {
            //console.log(leads);
            response.send(leads);
        })
})

expressApp.post('/add-new-lead', (request, response) => {
    userName = request.body.name
    console.log(userName)

    timeStamp();
    console.log(request.body);
    request.body.timeStamp = timeStamp();
    request.body.weekDay = weekDay();
    request.body.location = "ICESI University"
    leadsCollection.addNewDocument(request.body);
    response.status(200).end();
})

expressApp.post('/add-no-lead', (request, response) => {
    

    timeStamp();
    console.log(request.body);
    request.body.timeStamp = timeStamp();
    request.body.weekDay = weekDay();
    request.body.location = "ICESI University"
    noLeadsCollection.addNewDocument(request.body);
    response.status(200).end();
})

expressApp.get('/add-new-lead', (request, response) => {
    if (userName !== undefined) {
        let data = {
            name: userName,
            screen: "THANK YOU"
        }
        response.send(data);
    }
})

function timeStamp() {
    let date = new Date();
    let [month, day, year] = [date.getMonth() + 1, date.getDate(), date.getFullYear()];
    let [hour, minutes, seconds] = [date.getHours(), date.getMinutes(), date.getSeconds()];
    console.log(`${hour}:${minutes}:${seconds} - ${month}/${day}/${year}`);
    return `${hour}:${minutes}:${seconds} - ${month}/${day}/${year}`
}

function weekDay() {
    let date = new Date();
    let weekDay = date.getDay();
    switch (weekDay) {
        case 0:
            weekDay = 'Sun'
            break;
        case 1:
            weekDay = 'Mon'
            break;
        case 2:
            weekDay = 'Tue'
            break;
        case 3:
            weekDay = 'Wed'
            break;
        case 4:
            weekDay = 'Thu'
            break;
        case 5:
            weekDay = 'Fri'
            break;
        case 6:
            weekDay = 'Sat'
            break;
    }
    return weekDay;
}

io.on('connection', (socket) => {
    console.log('Connected!', socket.id)

    socket.on('device-size', deviceSize => {
        socket.broadcast.emit('mupi-size', deviceSize)
    })
    socket.on('interface', interface => {
        socket.broadcast.emit('currentInterface', interface)
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