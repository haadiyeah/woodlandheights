const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');

//16:9 ratio for the canvas
canvas.width = 64 * 16
canvas.height = 64 * 9

//---------Consts----------
const GRAVITY = 0.9;
const JUMP_FORCE = -15;
const MOVEMENT_SPEED = 5;
const BACKGROUND_SCALE =0.9; //how much to zoom in background

//---------------------Key Controls---------------------
const KEYS = {
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }
}

//console.log(floorCollissions)

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

const player = new Player();

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
    collissionBlocksArray.forEach(collissionBlick => {
        collissionBlick.update();
    })
    
    platformBlocksArray.forEach(platform => {
        platform.update();
    })
    player.update();

    canvasContext.restore();

    //Player Movement
    if (KEYS.ArrowLeft.pressed && player.lastKey == 'ArrowLeft') {
        player.velocity.x = -MOVEMENT_SPEED;
        //player2.setSprite('run');
    } else if (KEYS.ArrowRight.pressed && player.lastKey == 'ArrowRight') {
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
        case 'ArrowUp':
            if (player.velocity.y == 0)
                player.velocity.y = JUMP_FORCE
            KEYS.ArrowUp.pressed = true
            break
        case 'ArrowRight':
            player.lastKey = 'ArrowRight'
            KEYS.ArrowRight.pressed = true
            break
        case 'ArrowLeft':
            player.lastKey = 'ArrowLeft'
            KEYS.ArrowLeft.pressed = true
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
    case 'ArrowUp':
        KEYS.ArrowUp.pressed = false
        break
    case 'ArrowRight':
        KEYS.ArrowRight.pressed = false
        break
    case 'ArrowLeft':
        KEYS.ArrowLeft.pressed = false
        break
}
})

