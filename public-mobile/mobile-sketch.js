const NGROK = `https://${window.location.hostname}`
console.log('Server IP: ', NGROK)
let socket = io(NGROK, { path: '/real-time' })

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.style('z-index', '-1');
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('right', '0');

    socket.emit('device-size', {windowWidth, windowHeight});
    
    let interactionButton = createButton("Allow interaction")
    interactionButton.mousePressed(function() {
        DeviceOrientationEvent.requestPermission();
    })
}


function draw() {
    background(255, 50)
    fill(0)
}

function deviceMoved() {
    socket.emit('mobile-instructions', { pAccelerationX, pAccelerationY, pAccelerationZ })
    background(0, 255, 255);
}

function deviceShaken() {
    socket.emit('mobile-instructions', 'Moved!')
    background(0, 255, 255)
}
