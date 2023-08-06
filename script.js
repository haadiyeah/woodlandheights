const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');

//16:9 ratio for the canvas
canvas.width = 64 * 16
canvas.height = 64 * 9

//---------Consts----------
const GRAVITY = 0.9;
const JUMP_FORCE = -15;
const MOVEMENT_SPEED = 5;
const BACKGROUND_SCALE =2.4; //how much to zoom in background

//---------------------Key Controls---------------------
const KEYS = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    }
}

//map width = 70 tiles
//map height = 40 tiles
//Creating 2-d Arrays to loop through columns and rows
const floorCollissions2D  = []
for(let i=0; i<floorCollissions.length; i+=70){
    floorCollissions2D.push(floorCollissions.slice(i,i+70)) //pushing an array of length 70 (one row)
}

const platformCollissions2D = []
for(let i=0; i<platformCollissions.length; i+=70){
    platformCollissions2D.push(platformCollissions.slice(i,i+70)) //pushing an array of length 70 (one row)
}

console.log(platformCollissions2D);

///console.log(floorCollissions2D)

//These are arrays of the CollisionBlock's for ground and platform
const collissionBlocksArray =[]; //ground
const platformBlocksArray = []; //platform

floorCollissions2D.forEach ( (row, y) => {
    row.forEach((item, x) => { //x==column index
        if(item === 9706 ) {
            //console.log("collission block")
            collissionBlocksArray.push(new CollissionBlock({
                position: {
                    x: x*16,
                    y: y*16 //16=size of collission block
                }
            }))
        }
    })

})

platformCollissions2D.forEach( (row, y) => { //looping through rows
    row.forEach((item, x) => { //for each individual specific symbol
        if(item === 9706) {
            platformBlocksArray.push( new CollissionBlock ({
                position: {
                    x: x*16,
                    y: y*16
                }
            }))
        }
    })
})

const scaledCanvas = {
    width: canvas.width/BACKGROUND_SCALE,
    height: canvas.height/BACKGROUND_SCALE
}

const player = new Player( {
    position: {
        x: 330, 
        y:100
    },
    imgSrc: './img/Player/Idle.png'
})

//DIMESIONS: 1120 x 641
const backgroundLev1 = new Sprite({
    position: {
        x: 0,
        y:0
    }, 
    imageSrc: './img/map.png'
})

console.log(platformBlocksArray);


function animate() {
    window.requestAnimationFrame(animate)

    //Drawing the background again in every frame to override the previous frame
    canvasContext.fillStyle = 'white'
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);

    //Scaling up (zoom in)
    canvasContext.save();
    canvasContext.scale(BACKGROUND_SCALE,BACKGROUND_SCALE); ///does not affect original dimensions of the image
    canvasContext.translate(0, -backgroundLev1.image.height + scaledCanvas.height )
    backgroundLev1.update();
    //Draw out the collission blocks
    collissionBlocksArray.forEach(collissionBlick => {
        collissionBlick.update();
    })
    //Draw out the platforms
    platformBlocksArray.forEach(platform => {
        platform.update();
    })
    //Draw out the player
    player.update();

    canvasContext.restore();

    //Player Movement
    if (KEYS.a.pressed && player.lastKey == 'a') {
        player.velocity.x = -MOVEMENT_SPEED;
        //player2.setSprite('run');
    } else if (KEYS.d.pressed && player.lastKey == 'd') {
        player.velocity.x = MOVEMENT_SPEED;
        //player2.setSprite('run');
    } else {
        player.velocity.x=0;
        //Default to set for every frame
        //player2.setSprite('idle');
    }

}

animate();


window.addEventListener('keydown', (event) => {
    switch (event.key) {
        // --- MOvement
        case 'w':
            if (player.velocity.y > -0.5 && player.velocity.y < 0.5)
                player.velocity.y = JUMP_FORCE
            KEYS.w.pressed = true
            break
        case 'd':
        case 'D':
            player.lastKey = 'd'
            KEYS.d.pressed = true
            break
        case 'a':
        case 'A':
            player.lastKey = 'a'
            KEYS.a.pressed = true
            break
        // ---  Attack
        case ' ':
            // // KEYS.Shift.pressed = true
            // if (!player2.firing) {
            //     player2.attack();
            //     fireArrow.play();
            //     player2.firing = true;
            //     setTimeout(() => {
            //         player2.firing = false;
            //         FIRED = false;
            //     }, ARROW_SHOOT_TIME)
            // }
            // break
            break
    }

})

// window.addEventListener('keydown', (event) => {
//     console.log("You pressed: " + event.key)
// })

window.addEventListener('keyup', (event) => {
switch (event.key) {
    case 'w':
        KEYS.w.pressed = false
        break
    case 'd':
        KEYS.d.pressed = false
        break
    case 'a':
        KEYS.a.pressed = false
        break
}
})

