const NGROK = `https://${window.location.hostname}`
const DNS = getDNS;
let socket = io(NGROK, {
    path: '/real-time'
})
console.log('Server IP: ', NGROK)

let userName;
let interface = 'HOME';
let deviceWidth, deviceHeight = 0;
let time = 0;
let counter = 30;
let mupiScreens = [];
let tokens = [];
let currentScreen;
let referenceToken;
let changingToken;
let tokenIndex;

function preload() {
    mupiScreens[0] = loadImage('./mupi-assets/MUPI-Home.png');
    mupiScreens[1] = loadImage('./mupi-assets/MUPI-connected.png');
    mupiScreens[2] = loadImage('./mupi-assets/MUPI-instrucciones.png');
    mupiScreens[3] = loadImage('./mupi-assets/MUPI-Game.png');
    mupiScreens[4] = loadImage('./mupi-assets/MUPI-Win.png');
    mupiScreens[5] = loadImage('./mupi-assets/MUPI-Loose.png');
    mupiScreens[6] = loadImage('./mupi-assets/MUPI-ThankYou.png');

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

    currentScreen = mupiScreens[0]

    let randomIndex = Math.floor(Math.random() * 4)
    console.log(randomIndex)
    referenceToken = tokens[randomIndex];
}

function draw() {
    background(255, 50)
    changingToken = tokens[tokenIndex]
    image(currentScreen, 0, 0, 440, 660);
    changeScreen();
}

function changeScreen() {
    switch (interface) {
        case 'HOME':
            currentScreen = mupiScreens[0];
            break;
        case 'CONNECTED':
            currentScreen = mupiScreens[1];
            break;
        case 'INSTRUCTIONS':
            fill(0)
            currentScreen = mupiScreens[2];
            break;
        case 'GAME':
            currentScreen = mupiScreens[3]
            imageMode(CENTER)
            image(referenceToken, 145, 330, 231, 275)
            image(changingToken, 309, 330, 231, 275)
            imageMode(CORNER)
            countDown();
            if (referenceToken === changingToken) {
                interface = 'WON'
            }
            socket.emit('game-over', interface)
            break;
        case 'WON':
            currentScreen = mupiScreens[4]
            break;
        case 'LOST':
            currentScreen = mupiScreens[5]
            break;
        case 'THANK YOU':
            currentScreen = mupiScreens[6]
            fill('#333333')
            textAlign(CENTER, CENTER);
            textSize(30)
            text(userName, 220, 320);
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
    }
    socket.emit('game-over', interface)
}

socket.on('mupi-instructions', index => {
    tokenIndex = index;
})

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
    userName = newUser.name;
})