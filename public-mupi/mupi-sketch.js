const NGROK = `https://${window.location.hostname}`
let socket = io(NGROK, { path: '/real-time' })
console.log('Server IP: ', NGROK)

let canvas
let deviceWidth, deviceHeight = 0;
function setup() {
    canvas = createCanvas(windowWidth, windowHeight)
    canvas.style('position', 'fixed')
    canvas.style('top', '0')
    canvas.style('right', '0')
}

function draw() {
    background(255, 50)
    fill(0)
    ellipse(pmouseX, pmouseY, 50, 50)
}

socket.on('mupi-size', deviceSize => {
    let {windowWidth, windowHeight} = deviceSize
    deviceWidth = windowWidth
    deviceHeight = windowHeight
    console.log(`User is using a smatphone size of ${deviceWidth} and ${deviceWidth}`)
})