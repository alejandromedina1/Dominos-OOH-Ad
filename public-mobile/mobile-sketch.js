const NGROK = `https://${window.location.hostname}`
console.log('Server IP: ', NGROK)
let socket = io(NGROK, { path: '/real-time' })

function setup() {
    canvas = createCanvas(windowWidth, windowHeight)
    canvas.style('position', 'fixed')
    canvas.style('top', '0')
    canvas.style('right', '0')

    socket.emit('device-size', {windowWidth, windowHeight});
    
    let interactionButton = createButton('Allow interaction')
    interactionButton.mousePressed(function() {
        DeviceOrientationEvent.requestPermission();
    })
}


function draw() {
    background(255, 50)
    fill(0)
    ellipse(pmouseX, pmouseY, 50, 50)
}

function deviceShaken() {
    socket.emit('mobile-instructions', 'Shaken!')
    background(0, 255, 255)
}
