const NGROK = `https://${window.location.hostname}`
console.log('Server IP: ', NGROK)
const DNS = getDNS;
let socket = io(NGROK, {
    path: '/real-time'
})



let interface = '';
let user = {};
let mobileScreens = [];
let currentScreen;
let currentIndex = 0;

function preload() {
    mobileScreens[0] = loadImage('./mobile-assets/MOBILE-Skeleton.png')
    mobileScreens[1] = loadImage('./mobile-assets/MOBILE-WinSignIn.png')
    mobileScreens[2] = loadImage('./mobile-assets/MOBILE-LooseSignIn.png')
    mobileScreens[3] = loadImage('./mobile-assets/MOBILE-ThankYou.png')
}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.style('z-index', '-1');
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('right', '0');

    /*firstName = createInput('');
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
    phone.style('display', 'none')*/

    currentScreen = mobileScreens[currentIndex];
    socket.emit('device-size', {
        windowWidth,
        windowHeight
    });
    console.log(currentIndex);
    console.log(interface);
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
    background(255, 50)
    socket.on('next-interface', nextInterface => {
        interface = nextInterface;
        if (interface === 'WON') {
            currentIndex = 1;
        } else {
            currentIndex = 2;
        }
    })
    image(currentScreen, 0, 0);
    image(mobileScreens[currentIndex], 0, 0)
    screens();

    if (interface !== 'WON' || interface !== 'LOST') {
        document.getElementById("container").style.display = "none";
        //console.log('HIDE!')
    } else {
        document.getElementById("container").style.display = "block";
        //console.log('SHOW!')
    }
}

function screens() {
    console.log(interface);
    switch (interface) {
        case 'WON':
            currentIndex = 1;
            /*firstName.style('display', 'block')
            lastName.style('display', 'block')
            phone.style('display', 'block')*/
            break;
        case 'LOST':
            currentIndex = 2;
            /*firstName.style('display', 'block')
            lastName.style('display', 'block')
            phone.style('display', 'block')*/

            break;
        case 'THANK YOU':
            currentIndex = 3;
            /*firstName.style('display', 'none')
            lastName.style('display', 'none')
            phone.style('display', 'none')*/
            socket.emit('sendingUser', user);
            socket.emit('interface', interface)
            break;
    }
}

function mousePressed() {
    sendUserData();
}

function sendUserData() {
    if (0 < mouseX && mouseX < windowWidth && 330 < mouseY && mouseY < 800) {
        if (user.name !== undefined && user.lastName !== undefined && user.phone !== undefined) {
            console.log(user)
            interface = 'THANK YOU'
        }
    }
}

let firstName = document.getElementById('firstName');
let lastName = document.getElementById('lastName');
let phone = document.getElementById('phone');


let button = document.getElementById('sendData')


button.addEventListener("click", () => {
    user = {
        firstName: firstName.value,
        lastName: lastName.value,
        phone: phone.value
    }
    console.log(user)
    sendData(user);
    interface = 'THANK YOU'
})



async function sendData(user) {
    const request = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    }
    await fetch(`/user`, request)
}