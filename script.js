const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');

//16:9 ratio for the canvas
canvas.width = 64 * 16
canvas.height = 64 * 9

//---------Consts----------
const GRAVITY = 0.2;
const JUMP_FORCE = -5;
const MOVEMENT_SPEED = 2;
const BACKGROUND_SCALE =2.4; //how much to zoom in background
const ANIMATION_SPEED = 8; //smaller value = faster animation
const TILE_DIM = 16; //tile dimesions 16x16
const MAP_WIDTH = 70 //map width in tiles i.e. 70 tiles wide not 70px
const MAP_HEIGHT = 40 //Same as above
const ENEMY_VERTICAL_RANGE = 10; //How far off (vertically) enemies can spot you

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

var getCoin = new Audio('./audio/oot_rupee_get.mp3')
var splat = new Audio('./audio/splat.mp3')
//map width = 70 tiles
//map height = 40 tiles
//tile: 16x16px
//Creating 2-d Arrays to loop through columns and rows
const floorCollissions2D  = []
for(let i=0; i<floorCollissions.length; i+=70){
    floorCollissions2D.push(floorCollissions.slice(i,i+70)) //pushing an array of length 70 (one row)
}

const platformCollissions2D = []
for(let i=0; i<platformCollissions.length; i+=70){
    platformCollissions2D.push(platformCollissions.slice(i,i+70)) //pushing an array of length 70 (one row)
}

const coins2D = [] 
for(let i=0; i<coins.length; i+=70){
    coins2D.push(coins.slice(i,i+70)) //pushing an array of length 70 (one row)
}

const slimes2D = []
for(let i=0; i<slimes.length; i+=70) {
    slimes2D.push(slimes.slice(i,i+70))
}

//These are arrays of the CollisionBlock's for ground and platform
const collissionBlocksArray =[]; //ground
const platformBlocksArray = []; //platform
const coinsArray = []; //coins
const slimesArray = []
let numCoins=0; //counting no. of coins

floorCollissions2D.forEach ( (row, y) => {
    row.forEach((item, x) => { //x==column index
        if(item !== 0 ) {
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
        if(item !== 0) {
            platformBlocksArray.push( new CollissionBlock ({
                position: {
                    x: x*16,
                    y: y*16
                },
                height: 9
            }))
        }
        console.log('loooop');
    })
})


coins2D.forEach( (row, y) => { //looping through rows
    row.forEach((item, x) => { //for each individual specific symbol
        if(item !== 0) {
            coinsArray.push( new Coin ({
                position: {
                    x: x*16,
                    y: y*16
                },
                imgSrc: './img/coin.png',
                numFrames: 14,
                scale: 1.5,
                animationSpeed : 3
            }))

            numCoins++;
        }
    })
})

slimes2D.forEach ( (row, y) => { //looping through rows
    row.forEach((item, x) => { //for each individual specific symbol
        if(item !== 0) {
            slimesArray.push( createSlime(x*16, y*16) )
        }
    })
})


const scaledCanvas = {
    width: canvas.width/BACKGROUND_SCALE,
    height: canvas.height/BACKGROUND_SCALE
}

const victorySheet = new Sprite( {
    position: {
        x: 50,
        y: 50
    },
    imgSrc: './img/Victory.png',
    scale: 5,
    numFrames: 13
})

const player = new Player( {
    position: {
        x: 20, 
        y:370
    },
    imgSrc: './img/Player/Idle_Right.png',
    scale: 1.5,
    numFrames:2,
    sprites: {
        idleLeft: {
            spriteSrc: './img/Player/Idle_Left.png',
            numFrames: 2
        },
        idleRight: {
            spriteSrc: './img/Player/Idle_Right.png',
            numFrames: 2
        }, 
        runLeft: {
            spriteSrc: './img/Player/Run_Left.png',
            numFrames: 4
        },
        runRight: {
            spriteSrc: './img/Player/Run_Right.png',
            numFrames: 4
        },
        jumpLeft: {
            spriteSrc: './img/Player/Jump_Left.png',
            numFrames: 9
        },
        jumpRight: {
            spriteSrc: './img/Player/Jump_Right.png',
            numFrames: 9
        },
        death: {
            spriteSrc: './img/Player/Death.png',
            numFrames: 9
        }
    }
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

//Dynamic storage to tell how much to offset the canvas
const translateValues = {
    position: {
        x:0,
        y: scaledCanvas.height - ( MAP_HEIGHT*TILE_DIM) 
    }
}

function animate() {
    window.requestAnimationFrame(animate)

    //Drawing the background again in every frame to override the previous frame
    canvasContext.fillStyle = 'white'
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);

  
    //Scaling up (zoom in)
    canvasContext.save();
    canvasContext.scale(BACKGROUND_SCALE,BACKGROUND_SCALE); ///does not affect original dimensions of the image
    canvasContext.translate(translateValues.position.x, translateValues.position.y )
    backgroundLev1.update();
    //Draw out the collission blocks
    collissionBlocksArray.forEach(collissionBlick => {
        collissionBlick.update();
    })
    //Draw out the platforms
    platformBlocksArray.forEach(platform => {
        platform.update();
    })
   coinsArray.forEach(coin => {
        coin.update();
    })
    slimesArray.forEach(slime => {
        slime.update();
    })
    //Draw out the player
    player.update();

    canvasContext.restore();
    if(player.coinsCollected === numCoins) {
        // canvasContext.fillStyle = 'rgba(0,0,0,0.6)'
        // canvasContext.fillRect(0, 0, canvas.width, canvas.height);

        // victorySheet.draw()
        // victorySheet.update();
    }

    if(player.velocity.y < 0) { //moving up
        player.panCameraDown();
    } else if(player.velocity.y > 0) { //moving down
        player.panCameraUp()
    }

    if(player.velocity.x < 0) { //moving left
        player.panCameraRight();
    } else if(player.velocity.x > 0) { //moving right
        player.panCameraLeft();
    }


    //Player Movement
    if (KEYS.a.pressed && player.lastKey == 'a') {
        player.velocity.x = -MOVEMENT_SPEED;
        player.setSprite('runLeft');
        player.direction = 'left';
       
    } else if (KEYS.d.pressed && player.lastKey == 'd') {
        player.velocity.x = MOVEMENT_SPEED;
        player.setSprite('runRight');
        player.direction = 'right';

    } else if(player.velocity.y !== 0 && player.lastKey == 'w') {
       
        switch(player.direction) {
            case 'left':
                player.setSprite('jumpLeft');
                break;
            case 'right':
                player.setSprite('jumpRight');
                break;
           }
    } 
    else {
        player.velocity.x=0;
       switch(player.direction) {
        case 'left':
            player.setSprite('idleLeft');
            break;
        case 'right':
            player.setSprite('idleRight');
            break;
       }
    }

}

animate();


window.addEventListener('keydown', (event) => {
    switch (event.key) {
        // --- MOvement
        case 'w':
        case 'W':
            if (player.isGrounded) {
                player.velocity.y = JUMP_FORCE
                player.isGrounded=false;
            }
            KEYS.w.pressed = true
            player.lastKey = 'w'
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

