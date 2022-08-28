const NGROK = `https://${window.location.hostname}`
let socket = io(NGROK, { path: '/real-time' })
console.log('Server IP: ', NGROK)

let deviceWidth, deviceHeight = 0;
let ballSize = 20
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
    fill(0)
    const x = deviceWidth/2
    const y = deviceHeight/2
    ellipse(pmouseX, pmouseY, 50, 50)
    fill(0,0, 255)
    ellipse(x, y, ballSize, ballSize)
}


socket.on('mupi-instructions', instructions => {
    let { pAccelerationX, pAccelerationY, pAccelerationZ } = instructions
    ballSize = pAccelerationY < 0 ? pAccelerationY * -2 : pAccelerationY * 2;
})

socket.on('mupi-size', deviceSize => {
    let {windowWidth, windowHeight} = deviceSize
    deviceWidth = windowWidth
    deviceHeight = windowHeight
    console.log(`User is using a smatphone size of ${deviceWidth} and ${deviceWidth}`)
})