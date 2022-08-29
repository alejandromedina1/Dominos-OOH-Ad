const NGROK = `https://${window.location.hostname}`
let socket = io(NGROK, {
    path: '/real-time'
})
console.log('Server IP: ', NGROK)

let interface = 'HOME';
let deviceWidth, deviceHeight = 0;
let greenColor = 50;
let time = 0;
let counter = 30;

function setup() {
    frameRate(60);
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.style('z-index', '-1');
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('right', '0');
}

function draw() {
    background(255, 50)
    screens();
    fill(0)
    const x = deviceWidth / 2
    const y = deviceHeight / 2
    ellipse(pmouseX, pmouseY, 50, 50)
    fill(0, 0, 255)
    //ellipse(x, y, ballSize, ballSize)
}

function screens() {
    switch (interface) {
        case 'HOME':
            rectMode(CENTER)
            const X = deviceWidth / 2
            const Y = deviceHeight / 2
            fill(0);
            rect(X, Y, 300, 50);
            textAlign(CENTER, CENTER);
            textSize(15);
            fill(255);
            text('Phone connected!', X, Y);
            break;
        case 'INSTRUCTIONS':
            fill(0)
            text('Here you will see the instructions', 300, 200)
            break;
        case 'GAME':
            fill(0, 150, greenColor)
            const x = deviceWidth / 4 * 3
            const y = deviceHeight / 4 * 3
            const xRef = deviceWidth / 4
            countDown();
            ellipse(x, y, 100, 100)
            fill(0, 150, 255)
            ellipse(xRef, y, 100, 100)
            if (greenColor >= 100) {
                greenColor = 182;
                interface = 'WON'
            }
            socket.emit('game over', interface)
            break;
        case 'WON':
            fill(0);
            text('You Won!', 200, 500);
            break;
        case 'LOST':
            fill(0);
            text('LOST!', 200, 300);
            break;
    }
}

function countDown() {
    time++;
    if (time % 60 == 0) {
        counter--;
    }
    textSize(20);
    text('Time left: ' + counter, 100, 50);
    if (counter === 0) {
        interface = 'LOST'
    }
}

socket.on('mupi-instructions', instructions => {
    let {
        pAccelerationX,
        pAccelerationY,
        pAccelerationZ
    } = instructions
    if (pAccelerationY > 30) {
        greenColor = 255
    }
})

socket.on('mupi-size', deviceSize => {
    let {
        windowWidth,
        windowHeight
    } = deviceSize
    deviceWidth = windowWidth
    deviceHeight = windowHeight
    console.log(`User is using a smatphone size of ${deviceWidth} and ${deviceWidth}`)
})

socket.on('interface', newInterface => {
    interface = newInterface;
})