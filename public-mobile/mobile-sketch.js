let socket = io("http://localhost:5050", { path: '/real-time' })
let canvas;
function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('right', '0');
}

function draw() {
    background(255, 50);
    fill(0);
    ellipse(pmouseX, pmouseY, 50, 50);
}