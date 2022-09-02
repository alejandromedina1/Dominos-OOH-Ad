const NGROK = `https://${window.location.hostname}`
console.log('Server IP: ', NGROK)
const DNS = getDNS;
let socket = io(NGROK, {
    path: '/real-time'
})

let interface = 'CONNECTED';
let user = {};
let mobileScreens = [];
let currentScreen;
let tokens = [];
let currentToken;
let currentIndex;
let interactionButton;

function preload() {
    mobileScreens[0] = loadImage('./mobile-assets/MOBILE-connected.png')
    mobileScreens[1] = loadImage('./mobile-assets/MOBILE-instructions.png')
    mobileScreens[2] = loadImage('./mobile-assets/MOBILE-game.png')
    mobileScreens[3] = loadImage('./mobile-assets/MOBILE-WinSignIn.png')
    mobileScreens[4] = loadImage('./mobile-assets/MOBILE-LooseSignIn.png')
    mobileScreens[5] = loadImage('./mobile-assets/MOBILE-ThankYou.png')

    for (let i = 0; i < 4; i++) {
        tokens[i] = loadImage(`./mobile-assets/Tokens/${i+1}.png`)
    }
}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.style('z-index', '-1');
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('right', '0');

    firstName = createInput('');
    firstName.position(20, 210);
    firstName.size(370, 17);
    firstName.input(nameInputEvent);
    firstName.style('display', 'none')

    lastName = createInput('')
    lastName.position(20, 250)
    lastName.size(370, 17)
    lastName.input(lastNameInputEvent)
    lastName.style('display', 'none')

    phone = createInput('')
    phone.position(20, 300)
    phone.size(370, 17)
    phone.input(phoneInputEvent)
    phone.style('display', 'none')

    currentScreen = mobileScreens[0]

    socket.emit('device-size', {
        windowWidth,
        windowHeight
    });
    interactionButton = createButton("Allow interaction")
    interactionButton.mousePressed(function () {
        DeviceOrientationEvent.requestPermission();
    })
    interactionButton.position(windowWidth / 4, windowHeight / 5 * 4)
    interactionButton.style('display', 'none')

    currentIndex = Math.floor(Math.random() * 4)
    socket.emit('mobile-instructions', currentIndex)
}

function nameInputEvent() {
    user['name'] = this.value();
}

function lastNameInputEvent() {
    user['lastName'] = this.value();
}

function phoneInputEvent() {
    user['phone'] = this.value();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight)

}

function draw() {
    console.log(currentIndex)
    background(255, 50)
    image(currentScreen, 0, 0, windowWidth, windowHeight);
    screens();
    currentToken = tokens[currentIndex]
    fill(0)
}

function screens() {
    switch (interface) {
        case 'CONNECTED':
            socket.emit('interface', interface)
            break;
        case 'INSTRUCTIONS':
            currentScreen = mobileScreens[1];
            break;
        case 'GAME':
            currentScreen = mobileScreens[2];
            imageMode(CENTER)
            image(currentToken, windowWidth / 2, windowHeight / 2, 298, 359);
            imageMode(CORNER)
            interactionButton.style('display', 'block')
            break;
        case 'WON':
            currentScreen = mobileScreens[3];
            firstName.style('display', 'block')
            lastName.style('display', 'block')
            phone.style('display', 'block')
            interactionButton.style('display', 'none')
            break;
        case 'LOST':
            currentScreen = mobileScreens[4];
            firstName.style('display', 'block')
            lastName.style('display', 'block')
            phone.style('display', 'block')
            interactionButton.style('display', 'none')
            break;
        case 'THANK YOU':
            sendData(user);
            currentScreen = mobileScreens[5];
            firstName.style('display', 'none')
            lastName.style('display', 'none')
            phone.style('display', 'none')
            socket.emit('sendingUser', user);
            socket.emit('interface', interface)
            break;
    }
}

function changeScreen() {
    switch (interface) {
        case 'CONNECTED':
            const X = windowWidth / 8
            const Y = windowHeight / 3 * 2
            if (X < mouseX && mouseX < X + 500 && Y < mouseY && mouseY < Y + 200) {
                interface = 'INSTRUCTIONS'
                console.log('Click')
            }
            socket.emit('interface', interface)
            break;
        case 'INSTRUCTIONS':
            const newX = windowWidth / 8
            const newY = windowHeight / 5 * 3
            if (newX < mouseX && mouseX < newX + 700 && newY < mouseY && mouseY < newY + 300) {
                interface = 'GAME'
                console.log('Click')
            }
            socket.emit('interface', interface)
            break;
        case 'GAME':
            //
            break;
        case 'WON':
            break;
        case 'LOST':
            break;
    }
}

function mousePressed() {
    changeScreen();
    sendUserData();
}

function deviceShaken() {
    currentIndex = Math.floor(Math.random() * 4)
    socket.emit('mobile-instructions', currentIndex)
}

function sendUserData() {
    if (0 < mouseX && mouseX < windowWidth && 330 < mouseY && mouseY < 800) {
        if (user.name !== undefined && user.lastName !== undefined && user.phone !== undefined) {
            console.log(user)
            interface = 'THANK YOU'
        }
    }
}

async function sendData(user) {
    const request = {
        method: 'POST',
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(user)
    }
    await fetch(`${DNS}/app`, request)
}

socket.on('next-interface', nextInterface => {
    interface = nextInterface;
})