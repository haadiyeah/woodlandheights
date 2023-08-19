const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');

//16:9 ratio for the canvas
canvas.width = 64 * 16
canvas.height = 64 * 9

//----Level tracker
let level = 1;

//---------Consts----------
const GRAVITY = 0.2; //downward acceleration
const JUMP_FORCE = -5;
const MOVEMENT_SPEED = 2; //Movement speed of player and slimes
const BACKGROUND_SCALE = 2.4; //how much to zoom in background
const ANIMATION_SPEED = 8; //Standard animation speed for most sprites; smaller value = faster animation
const TILE_DIM = 16; //tile dimesions 16x16
const ENEMY_VERTICAL_RANGE = 30; //How far off (vertically) enemies can spot you

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

var gameOverSound = new Audio('./audio/zelda_secret_sound.mp3')

//map width = 70 tiles
//map height = 40 tiles
//tile: 16x16px

const scaledCanvas = {
    width: canvas.width / BACKGROUND_SCALE,
    height: canvas.height / BACKGROUND_SCALE
}

const overlay = {
    opacity: 0
}

const GameOverSheet = new Sprite({
    position: {
        x: canvas.width / 2 - 180,
        y: canvas.height / 2 - 70
    },
    scale: 4,
    numFrames: 12,
    animationSpeed: 4,
    imageSrc: './img/GameOver-Sheet.png'
})

const VictorySheet = new Sprite({
    position: {
        x: canvas.width / 2 - 140,
        y: canvas.height / 2 - 80
    },
    scale: 4,
    numFrames: 13,
    animationSpeed: 4,
    imageSrc: './img/Victory.png'
})

//DIMESIONS: 1120 x 641
const currentLevel = new Level({
    position: {
        x: 0,
        y: 0
    },
    imgSrc: './img/map1.png'
})

const player = new Player({
    position: {
        x: 20,
        y: currentLevel.playerStartingYPos
    },
    imgSrc: './img/Player/Idle_Right.png',
    scale: 1.5,
    numFrames: 2,
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
        hurtLeft: {
            spriteSrc: './img/Player/Hurt_Left.png',
            numFrames: 2
        },
        hurtRight: {
            spriteSrc: './img/Player/Hurt_Right.png',
            numFrames: 2
        },
        death: {
            spriteSrc: './img/Player/Death.png',
            numFrames: 9
        }
    }
})

const skelly = new Enemy({
    position: {
        x: 1545,
        y: 300
    },
    imgSrc: './img/Skeleton/Walk_Left.png',
    scale: 1.5,
    numFrames: 13,
    animationSpeed: 4,
    sprites: {
        runLeft: {
            spriteSrc: './img/Skeleton/Walk_Left.png',
            numFrames: 13
        },
        runRight: {
            spriteSrc: './img/Skeleton/Walk_Right.png',
            numFrames: 13
        },
        attackLeft: {
            spriteSrc: './img/Skeleton/Attack_Left.png',
            numFrames: 13
        },
        attackRight: {
            spriteSrc: './img/Skeleton/Attack_Right.png',
            numFrames: 13
        },
        death: {
            spriteSrc: './img/Skeleton/Death.png',
            numFrames: 13
        }
    }

})
//Dynamic storage to tell how much to offset the canvas
const translateValues = {
    position: {
        x: 0,
        y: currentLevel.yTranslateBg //scaling to the bottom
    }
}

function animate() {
    window.requestAnimationFrame(animate) //Will call repeatedly like an infinite loop

    //Drawing the background again in every frame to override the previous frame
    canvasContext.fillStyle = 'white'
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);


    //This section is the scaled up version
    //--------------------------------------------------------------------
    canvasContext.save();
    canvasContext.scale(BACKGROUND_SCALE, BACKGROUND_SCALE); ///does not affect original dimensions of the image- zoom in
    canvasContext.translate(translateValues.position.x, translateValues.position.y) //translate the image to the correct area

    if (!currentLevel.paused) {
        //Drawing out the level: background, platforms, coins and slimes
        currentLevel.update();
        //Draw out the player
        player.update();
    } else {
        currentLevel.pausedDraw(); //paused version of coins,slimes etc will be drawn
        player.draw(); //player will only be drawn, not animated
    }

    //Restoring (zoom and translate won't be applied to anything else)
    canvasContext.restore();
    //--------------------------------------------------------------------

    //Pause screen
    if (currentLevel.paused) {
        applyOverlay(0.8, 'black') //fading to black

        document.getElementById("scoreInfo").style.display = 'flex'; //making text visible
        document.getElementById("scoreInfo").style.innerHTML = 'Game Paused';
        player.hearts.forEach(heart => { //drawing hearts on top of pause screen
            heart.draw();
        })
        return; //dont execute rest of the code for animation and movement
    }


    //Drawing the hearts (outside the translated area so that they appear in an absolute position)
    player.hearts.forEach(heart => {
        heart.draw();
    })


    if (!currentLevel.loaded) { //Indicating that next level is being setup
        canvasContext.fillStyle = 'rgba(124,148,161,255)'
        canvasContext.fillRect(0, 0, canvas.width, canvas.height); //drawing blue background

        VictorySheet.update();
    }


    if (player.coinsCollected === currentLevel.numCoins) { //COMMENT this line and uncomment the next line to test victory sheet code
        //if (player.coinsCollected === 3) {
        currentLevel.loaded = false; // indicator to load new level; will only be false for a few seconds while next level loads
        player.coinsCollected = 0; //Reset for new level
        playVictory(); //Will play victory jingle once

        if (!currentLevel.loaded) {
            //After 3 seconds, this code will be called; this means victory animation will play for 3s
            setTimeout(() => {
                canvasContext.clearRect(0, 0, canvas.width, canvas.height); //clearing canvas
                currentLevel.setupLevel(++level); //Will reload current level if you're on the last level

                //Move player to correct place to start
                player.position.y = currentLevel.playerStartingYPos;
                player.position.x = 20;

                //Move map to correct place to start
                translateValues.position.y = currentLevel.yTranslateBg;
                translateValues.position.x = 0;

                //This will cause victory sheet to not show anymore
                currentLevel.loaded = true;

                //Reset coin bar to empty
                gsap.to('#coinBar', {
                    width: (0 + '%')
                })
            }, 3000)
        }

    }

    //Game over animation incase player dies(reaches last frame of death animation)
    if (!player.isAlive) {
        canvasContext.fillStyle = 'rgba(78,60,92,255)'
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);
        GameOverSheet.update();
        gameOverSound.play()
        return; //rest of the code isnt needed
    }

    //Camera panning
    if (player.velocity.y < 0) { // if moving up
        player.panCameraDown();
    } else if (player.velocity.y > 0) { // if moving down
        player.panCameraUp()
    }

    if (player.velocity.x < 0) { //if moving left
        player.panCameraRight();
    } else if (player.velocity.x > 0) { // if moving right
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

    }
    else {
        //not moving in either direction
        player.velocity.x = 0;
        switch (player.direction) {
            case 'left':
                player.setSprite('idleLeft');
                break;
            case 'right':
                player.setSprite('idleRight');
                break;
        }
    }

}


currentLevel.setupLevel(1);
level = 1;
animate();



