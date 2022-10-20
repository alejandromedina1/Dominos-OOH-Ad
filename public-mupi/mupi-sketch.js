const NGROK = `https://${window.location.hostname}`
const DNS = getDNS;
let socket = io(NGROK, {
    path: '/real-time'
})
console.log('Server IP: ', NGROK)

let userName = '';
let interface = 'HOME';
let deviceWidth, deviceHeight = 0;
let time = 0;
let counter = 60;
let mupiScreens = [];
let tokens = [];
let currentScreen;
let currentIndex;
let referenceToken;
let changingToken;
let tokenIndex;
let previousSignal = 0;
let sensorState = false;
let sensorIsActivated = false;

function preload() {
    mupiScreens[0] = loadImage('./mupi-assets/MUPI-Home.png');
    mupiScreens[1] = loadImage('./mupi-assets/MUPI-connected.png');
    mupiScreens[2] = loadImage('./mupi-assets/MUPI-instrucciones.png');
    mupiScreens[3] = loadImage('./mupi-assets/MUPI-Game.png');
    mupiScreens[4] = loadImage('./mupi-assets/MUPI-Win.png');
    mupiScreens[5] = loadImage('./mupi-assets/MUPI-Loose.png');
    mupiScreens[6] = loadImage('./mupi-assets/MUPI-ThankYou.png');

    currentIndex = 0;

    for (let i = 0; i < 4; i++) {
        tokens[i] = loadImage(`./mupi-assets/Tokens/${i+1}.png`)
    }
}

function setup() {
    frameRate(60);
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.style('z-index', '-1');
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('right', '0');

    currentScreen = mupiScreens[currentIndex];

    referenceToken = tokens[indexGenerator()];
    tokenIndex = indexGenerator()
    changingToken = tokens[tokenIndex];

    if (referenceToken === changingToken) {
        tokenIndex = indexGenerator()
        if (referenceToken === changingToken) {
            tokenIndex = indexGenerator()
        }
    }
}

function indexGenerator() {
    let randomIndex = Math.floor(Math.random() * 4)
    console.log(randomIndex)
    return randomIndex;
}

function draw() {
    background(255, 50)
    currentScreen = mupiScreens[currentIndex];
    changingToken = tokens[tokenIndex];
    image(currentScreen, 0, 0, 440, 660);
    changeScreen();
}

async function changeScreen() {
    switch (interface) {
        case 'HOME':
            currentIndex = 0;
            /*socket.on('arduino-message', signal => {
                if (signal.motionSignal !== 0) {
                    interface = 'CONNECTED';
                }
            })*/
            break;
        case 'CONNECTED':
            currentIndex = 1;
            /*socket.on('arduino-message', signal => {
                if (signal.motionSignal !== 0) {
                    interface = 'INSTRUCTIONS';
                }
            })*/
            break;
        case 'INSTRUCTIONS':
            fill(0)
            currentIndex = 2;
            /*socket.on('arduino-message', signal => {
                if (signal.motionSignal !== 0) {
                    interface = 'GAME';
                }
            })*/
            break;
        case 'GAME':
            currentIndex = 3;
            imageMode(CENTER)
            image(referenceToken, 145, 330, 231, 275)
            image(changingToken, 309, 330, 231, 275)
            imageMode(CORNER)
            countDown();
            /*sensorState = false;
            sensorIsActivated = false;
            socket.on('arduino-message', signal => {
                if (signal.motionSignal !== 0 && interface === 'GAME') {
                    sensorState = true
                    if (sensorState && !sensorIsActivated) {
                        sensorIsActivated = true;
                        tokenIndex = indexGenerator()
                    } else if (!sensorState && sensorIsActivated) {
                        sensorIsActivated = false;
                    }
                }
            })*/
            if (referenceToken === changingToken) {
                setTimeout(() => {
                    interface = 'WON'
                    gameResult();
                }, 3000)
            }
            break;
        case 'WON':
            tokenIndex = undefined;
            counter = 60;
            socket.emit('game-over', interface)
            console.log(interface);
            sensorState = false;
            sensorIsActivated = false;
            currentIndex = 4;
            break;
        case 'LOST':
            socket.emit('game-over', interface)
            tokenIndex = undefined;
            counter = 60;
            console.log(interface);
            sensorState = false;
            sensorIsActivated = false;
            currentIndex = 5;
            break;
        case 'THANK YOU':
            currentIndex = 6;
            fill('#333333')
            textAlign(CENTER, CENTER);
            textSize(30)
            textFont('Poppins')
            text(userName, 220, 320);
            console.log(userName)
            break;
    }
}

function countDown() {
    time++;
    if (time % 60 == 0) {
        counter--;
    }
    textSize(60);
    fill(255);
    textAlign(LEFT, CENTER)
    textFont('Laqonic4FUnicase-SemiBold')
    text(counter, 226, 530);
    if (counter === 0) {
        interface = 'LOST'
        gameResult();
    }
}

async function gameResult() {
    let result;

    if (interface === 'WON') {
        result = 'W'
    } else if (interface === 'LOST') {
        result = 'L'
    }

    const request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            result
        })
    }
    await fetch('/gameResult', request);
}

socket.on('mupi-size', deviceSize => {
    let {
        windowWidth,
        windowHeight
    } = deviceSize
    deviceWidth = windowWidth
    deviceHeight = windowHeight
    console.log(`User is using a smatphone size of ${deviceWidth} and ${deviceHeight}`)
})

socket.on('currentInterface', newInterface => {
    interface = newInterface;
})

socket.on('catchingUser', newUser => {
    userName = newUser.firstName;
})

socket.on('arduino-message', signal => {
    switch (interface) {
        case 'HOME':
            if (signal.motionSignal !== 0) {
                interface = 'CONNECTED';
            }
            break;
        case 'CONNECTED':
            if (signal.motionSignal !== 0) {
                interface = 'INSTRUCTIONS';
            }
            break;
        case 'INSTRUCTIONS':
            if (signal.motionSignal !== 0) {
                interface = 'GAME';
            }
            break;
        case 'GAME':
            sensorState = false;
            sensorIsActivated = false;
            if (signal.motionSignal !== 0 && interface === 'GAME') {
                sensorState = true
                if (sensorState && !sensorIsActivated) {
                    sensorIsActivated = true;
                    tokenIndex = indexGenerator()
                } else if (!sensorState && sensorIsActivated) {
                    sensorIsActivated = false;
                }
            }
            break;
        case 'WON':

            break;
        case 'LOST':

            break;
        case 'THANK YOU':

            break;
    }
})