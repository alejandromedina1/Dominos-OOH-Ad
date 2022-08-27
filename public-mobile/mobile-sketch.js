const NGROK = `https://${window.location.hostname}`
let socket = io(NGROK, { path: '/real-time' })
console.log('Server IP: ', NGROK)
let canvas;
function setup() {
    canvas = createCanvas(windowWidth, windowHeight)
    canvas.style('position', 'fixed')
    canvas.style('top', '0')
    canvas.style('right', '0')
}

let interactionButton = createButton('Allow interaction')
interactionButton.mousePressed(function() {
    DeviceOrientationEvent.requestPermission();
})

function draw() {
    background(255, 50)
    fill(0)
    ellipse(pmouseX, pmouseY, 50, 50)
}
