const NGROK = `https://${window.location.hostname}`
console.log('Server IP: ', NGROK)
let socket = io(NGROK, {
    path: '/real-time'
})

let interface = 'HOME';

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.style('z-index', '-1');
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('right', '0');

    socket.emit('device-size', {
        windowWidth,
        windowHeight
    });
    let interactionButton = createButton("Allow interaction")
    interactionButton.mousePressed(function () {
        DeviceOrientationEvent.requestPermission();
    })
}


function draw() {
    background(255, 50)
    screens();
    fill(0)
}

function screens() {
    switch (interface) {
        case 'HOME':
            rectMode(CENTER)
            const X = windowWidth / 2
            const Y = windowHeight / 2
            fill(0);
            rect(X, Y, 300, 50);
            textAlign(CENTER, CENTER);
            textSize(15);
            fill(255);
            text('Press here', X, Y);
            break;
        case 'INSTRUCTIONS':
            const xRect = windowWidth / 4
            const yRect = windowHeight / 4
            rect(xRect, yRect, 300, 50);
            fill(255);
            text('Click here to continue', xRect, yRect);
            break;
        case 'GAME':

            break;
        case 'WON':

            break;
        case 'LOST':

            break;
        case 'DATA':

            break;
    }
}

function changeScreen() {
    switch (interface) {
        case 'HOME':
            const X = windowWidth / 2
            const Y = windowHeight / 2
            if (X - 150 < mouseX && mouseX < X + 150 && Y - 25 < mouseY && mouseY < Y + 25) {
                interface = 'INSTRUCTIONS'
                console.log('Click')
            }
            socket.emit('interface', interface)
            break;
        case 'INSTRUCTIONS':
            const xRect = windowWidth / 4
            const yRect = windowHeight / 4
            if (xRect - 150 < mouseX && mouseX < xRect + 150 && yRect - 25 < mouseY && mouseY < yRect + 25) {
                interface = 'GAME'
                console.log('Click')
            }
            socket.emit('interface', interface)
            break;
        case 'GAME':

            break;
        case 'WON' || 'LOST':
            text('Now submit your data', X, Y);
            break;
    }
}

function mousePressed() {
    changeScreen();
}


function deviceMoved() {
    socket.emit('mobile-instructions', {
        pAccelerationX,
        pAccelerationY,
        pAccelerationZ
    })
    background(0, 255, 255);
}

function deviceShaken() {
    socket.emit('mobile-instructions', 'Moved!')
    background(0, 255, 255)
}

socket.on('game over', newInterface => {
    interface = newInterface;
})