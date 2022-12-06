const NGROK = `https://${window.location.hostname}`
const DNS = getDNS;
let socket = io(NGROK, {
    path: '/real-time'
})
console.log('Server IP: ', NGROK)

let leadCount = 0;
let currentSignal = 0;
let currentInterface = 'HOME'
let clock = 0;
let timePassed = 30
let userName = undefined;
let interface = 'HOME';
let deviceWidth, deviceHeight = 0;
let time = 0;
let counter = 60;
let mupiScreens = [];
let tokens = [];
let currentScreen;
let currentIndex;
let referenceToken;
let changingToken;
let tokenIndex;
let previousSignal = 0;
let sensorState = false;
let sensorIsActivated = false;
let phrases = [];
let phrasesIndex;
let currentPhrase;
var source = "mupi-assets/audio/dancing-song.mp3"
var audio = document.createElement("audio");
audio.autoplay = true

audio.load()
audio.addEventListener('load', () => {
    audio.play()
}, true)
audio.src = source



function preload() {
    mupiScreens[0] = loadImage('./mupi-assets/MUPI-Home.png');
    mupiScreens[1] = loadImage('./mupi-assets/MUPI-connected.gif');
    mupiScreens[2] = loadImage('./mupi-assets/MUPI-instrucciones.gif');
    mupiScreens[3] = loadImage('./mupi-assets/MUPI-Game.png');
    mupiScreens[4] = loadImage('./mupi-assets/MUPI-Win.png');
    mupiScreens[5] = loadImage('./mupi-assets/MUPI-Loose.png');
    mupiScreens[6] = loadImage('./mupi-assets/MUPI-ThankYou.png');

    
    currentIndex = 0;

    for (let i = 0; i < 4; i++) {
        tokens[i] = loadImage(`./mupi-assets/Tokens/${i+1}.png`)
    }
    tokens[4] = loadImage('./mupi-assets/Tokens/animation.gif');

    for (let i = 0; i < 6; i++) {
        phrases[i] = loadImage(`./mupi-assets/phrases/${i+1}.gif`)
    }
}

function setup() {
    frameRate(60);
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.style('z-index', '-1');
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('right', '0');

    currentScreen = mupiScreens[currentIndex];

    referenceToken = tokens[indexGenerator()];
    tokenIndex = indexGenerator()
    phrasesIndex = phraseGenerator();
    changingToken = tokens[tokenIndex];
    currentPhrase = phrases[phrasesIndex];

    if (referenceToken === changingToken) {
        tokenIndex = indexGenerator()
        if (referenceToken === changingToken) {
            tokenIndex = indexGenerator()
        }
    }
    leadCount = getLeadCount();
}

function indexGenerator() {
    let randomIndex = Math.floor(Math.random() * 4)
    console.log(randomIndex)
    return randomIndex;
}

function phraseGenerator() {
    let randomIndex = Math.floor(Math.random() * 6)
    console.log(randomIndex);
    return randomIndex
}

function draw() {
    background(255, 50)
    currentScreen = mupiScreens[currentIndex];
    changingToken = tokens[tokenIndex];
    currentPhrase = phrases[phrasesIndex];
    image(currentScreen, 0, 0, 440, 660);
    changeScreen();
    //endInteraction();
    
}

function endInteraction() {
    if (interface !== 'HOME' && interface !== 'WON' && interface !== 'LOST'&& interface !== 'THANK YOU' &&currentSignal === 0 ) {
        clock++;
        if (clock % 60 == 0) {
            timePassed --;
        }
        if (timePassed <= 0) {
            clock = 0
            timePassed = 30
            addNoLead()
            window.location.reload();
        }
    }
    if ( interface !== 'HOME' && interface !== 'WON' && interface !== 'LOST' && interface !== 'THANK YOU' && currentSignal === 1) {
        timePassed = 30;
        clock = 0;
    }

    if (interface === "WON" && clock === 0|| interface === "LOST" && interface !== 'THANK YOU' && currentSignal === 1) {
        timePassed = 180;
        clock = 0;
    }

    if (interface === 'WON' && currentSignal === 0 || interface === 'WON' && currentSignal === 0 ) {
        clock++;
        if (clock % 60 == 0) {
            timePassed --;
        }
        if (timePassed <= 0) {
            clock = 0
            timePassed = 180
            addNoLead()
            window.location.reload();
        }
        if (currentSignal === 1) {
            timePassed = 180;
            clock = 0;
        }
    }

    if (interface = "THANK YOU") {
        if (clock % 60 == 0) {
            timePassed --;
        }
        if (timePassed <= 0) {
            clock = 0
            timePassed = 30
            window.location.reload();
        }
    }
    
}

async function addNoLead() {
    let user = null;
    const request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user
        })
    }
    await fetch('/add-no-lead', request);
}

function countDown() {
    time++;
    if (time % 60 == 0) {
        counter--;
    }
    textSize(60);
    fill("#777777");
    textAlign(LEFT, CENTER)
    textFont('Laqonic4FUnicase-SemiBold')
    text(counter, 226, 550);
    if (counter === 0) {
        interface = 'LOST'
        gameResult();
    }
}

async function changeScreen() {
    switch (interface) {
        case 'HOME':
            currentIndex = 0;
            break;
        case 'CONNECTED':
            currentIndex = 1;
            break;
        case 'INSTRUCTIONS':
            fill(0)
            currentIndex = 2;
            break;
        case 'GAME':
            currentIndex = 3;
            imageMode(CENTER)
            image(referenceToken, 145, 330, 231, 275)
            image(changingToken, 309, 330, 231, 275)
            image(currentPhrase, 220, 320)
            imageMode(CORNER)
            countDown();
            /*sensorState = false;
            sensorIsActivated = false;
            socket.on('arduino-message', signal => {
                if (signal.motionSignal !== 0 && interface === 'GAME') {
                    sensorState = true
                    if (sensorState && !sensorIsActivated) {
                        sensorIsActivated = true;
                        tokenIndex = indexGenerator()
                    } else if (!sensorState && sensorIsActivated) {
                        sensorIsActivated = false;
                    }
                }
            })*/
            /*if (referenceToken === changingToken) {
                setTimeout(() => {
                    interface = 'WON'
                    gameResult();
                }, 3000)
            }*/
            break;
        case 'WON':
            tokenIndex = undefined;
            counter = 60;
            console.log(interface);
            sensorState = false;
            sensorIsActivated = false;
            currentIndex = 4;

            break;
        case 'LOST':
            tokenIndex = undefined;
            counter = 60;
            console.log(interface);
            sensorState = false;
            sensorIsActivated = false;
            currentIndex = 5;

            break;
        case 'THANK YOU':
            currentIndex = 6;
            socket.emit('game-over', interface)
            fill('#333333')
            textAlign(CENTER, CENTER);
            textSize(30)
            textFont('Poppins')
            text(userName, 220, 320);
            console.log(userName)
            break;
    }
}


async function gameResult() {
    let result;

    if (interface === 'WON') {
        result = 'W'
    } else if (interface === 'LOST') {
        result = 'L'
    }

    const request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            result
        })
    }
    await fetch('/gameResult', request);
}

socket.on('mupi-size', deviceSize => {
    let {
        windowWidth,
        windowHeight
    } = deviceSize
    deviceWidth = windowWidth
    deviceHeight = windowHeight
    console.log(`User is using a smatphone size of ${deviceWidth} and ${deviceHeight}`)
})

socket.on('currentInterface', newInterface => {
    interface = newInterface;
})


async function getLeadCount() {
    const query = await fetch('http://localhost:5050/leads')
    const data = await query.json();
    return data.length

}

async function getUserName() {
    const query = await fetch('http://localhost:5050/add-new-lead')
    const data = await query.json();
    userName = data.name
}

socket.on('arduino-message', (signal) => {
    currentSignal = signal.motionSignal;
    switch (interface) {
        case 'HOME':
            if (signal.motionSignal !== 0) {
                interface = 'CONNECTED';
            }
            break;
        case 'CONNECTED':
            currentInterface = interface;
            if (signal.motionSignal !== 0) {
                interface = 'INSTRUCTIONS';
            }
            break;
        case 'INSTRUCTIONS':
            currentInterface = interface;
            if (signal.motionSignal !== 0) {
                interface = 'GAME';
            }
            break;
        case 'GAME':
            currentInterface = interface;
            sensorState = false;
            sensorIsActivated = false;
            if (signal.motionSignal !== 0 && interface === 'GAME') {
                sensorState = true
                if (sensorState && !sensorIsActivated) {
                    sensorIsActivated = true;
                    tokenIndex = 4;
                    phrasesIndex = phraseGenerator()
                    setTimeout(() => {
                        tokenIndex = indexGenerator()
                    }, 5000)
                } else if (!sensorState && sensorIsActivated) {
                    sensorIsActivated = false;
                }
            }
            if (referenceToken === changingToken) {
                    interface = 'WON'
                    gameResult();
            }
            break;
        case 'WON':
            currentInterface = interface;
            if (signal.motionSignal === 1) {
                let currentLeadCount = getLeadCount()
                getUserName();
                console.log(typeof userName);
                if (currentLeadCount !== leadCount && typeof userName === typeof '' ) {
                    interface = 'THANK YOU'
                }
            }
            break;
        case 'LOST':
            currentInterface = interface;
            if (signal.motionSignal === 1) {
                let currentLeadCount = getLeadCount()
                getUserName();
                console.log(typeof userName);
                if (currentLeadCount !== leadCount && typeof userName === typeof '') {
                    interface = 'THANK YOU'
                }
            }
            break;
        case "THANK YOU":
            currentInterface = interface;
            break;
    }
})