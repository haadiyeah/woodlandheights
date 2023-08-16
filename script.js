const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');

//16:9 ratio for the canvas
canvas.width = 64 * 16
canvas.height = 64 * 9

//---------Consts----------
const GRAVITY = 0.2;
const JUMP_FORCE = -5;
const MOVEMENT_SPEED = 2;
const BACKGROUND_SCALE = 2.4; //how much to zoom in background
const ANIMATION_SPEED = 8; //smaller value = faster animation
const TILE_DIM = 16; //tile dimesions 16x16
// const MAP_WIDTH = 70 //map width in tiles i.e. 70 tiles wide not 70px
// const MAP_HEIGHT = 40 //Same as above
const ENEMY_VERTICAL_RANGE = 30; //How far off (vertically) enemies can spot you
var PLAYEDSOUND =false;

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

function playGetCoin(  ) {
    var getCoin = new Audio('./audio/oot_rupee_get.mp3')
    getCoin.play();

    getCoin.onended = function(){
        this.currentSrc = null;
        this.src = "";
        this.srcObject = null;
        this.remove();
    };
}

var gameOverSound = new Audio('./audio/zelda_secret_sound.mp3')

function playGameOver() {
    var gameOverSound = new Audio('./audio/zelda_secret_sound.mp3')
    gameOverSound.play();

    gameOverSound.onended = function(){
        this.currentSrc = null;
        this.src = "";
        this.srcObject = null;
        this.remove();
    };
}

function playVictory() {
    var victorySound = new Audio('./audio/rupee-collect.mp3')
    victorySound.play();

    victorySound.onended = function(){
        this.currentSrc = null;
        this.src = "";
        this.srcObject = null;
        this.remove();
    };
}

//map width = 70 tiles
//map height = 40 tiles
//tile: 16x16px

const scaledCanvas = {
    width: canvas.width / BACKGROUND_SCALE,
    height: canvas.height / BACKGROUND_SCALE
}

const GameOverSheet = new Sprite({
   position: {
    x:canvas.width/2 - 180,
    y:canvas.height/2 - 70
   },
   scale: 4,
   numFrames: 12,
   animationSpeed: 4,
   imageSrc: './img/GameOver-Sheet.png'
})

const VictorySheet = new Sprite({
    position: {
     x:canvas.width/2 - 140,
     y:canvas.height/2 - 80
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

currentLevel.setupLevel(1);
// player.position.y = currentLevel.playerStartingYPos;
// translateValues.position.y = currentLevel.yTranslateBg;

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
            numFrames:2
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

//Dynamic storage to tell how much to offset the canvas
const translateValues = {
    position: {
        x: 0,
        y: currentLevel.yTranslateBg //scaling to the bottom
    }
}

function animate() {
    window.requestAnimationFrame(animate)

    //Drawing the background again in every frame to override the previous frame
    canvasContext.fillStyle = 'white'
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);


    //This section is the scaled up version
    //--------------------------------------------------------------------
    canvasContext.save();
    canvasContext.scale(BACKGROUND_SCALE, BACKGROUND_SCALE); ///does not affect original dimensions of the image- zoom in
    canvasContext.translate(translateValues.position.x, translateValues.position.y) //translate the image

    //Drawing out the level: background, platforms, coins and slimes
    currentLevel.update();

    //Draw out the player
    player.update();
    //Restoring (zoom and translate won't be applied to anything else)
    canvasContext.restore();
    //--------------------------------------------------------------------

    // testHeart.position.x = canvas.width - 50
    // testHeart.position.y = 20

    // testHeart.draw()
    player.hearts.forEach(heart => {
        heart.draw();
    })

    if(!currentLevel.loaded ) { //Indicating that next level is being setup
        canvasContext.fillStyle = 'rgba(124,148,161,255)'
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);
        VictorySheet.update();
    }


    if (player.coinsCollected === currentLevel.numCoins) {
    //if (player.coinsCollected === 3) {
        currentLevel.loaded = false; // indicator to load new level; will only be false for a few seconds while next level loads
        player.coinsCollected =0; //Reset for new level

        if(!currentLevel.loaded ) {
            setTimeout(() => {
                canvasContext.clearRect(0, 0, canvas.width, canvas.height);
                currentLevel.setupLevel(2);
                player.position.y = currentLevel.playerStartingYPos;
                player.position.x = 20;
                translateValues.position.y = currentLevel.yTranslateBg;
                translateValues.position.x = 0;
                currentLevel.loaded = true;
            }, 3000)
        }
        gsap.to('#coinBar', {
                    width: (0 + '%')
                })
        playVictory(); //Only once because of smart if statement ;))
    }

   

    if(!player.isAlive) {
        canvasContext.fillStyle = 'rgba(78,60,92,255)'
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);
        GameOverSheet.update();
        gameOverSound.play()
    }

    //Camera panning
    if (player.velocity.y < 0) { //moving up
        player.panCameraDown();
    } else if (player.velocity.y > 0) { //moving down
        player.panCameraUp()
    }

    if (player.velocity.x < 0) { //moving left
        player.panCameraRight();
    } else if (player.velocity.x > 0) { //moving right
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

    } else if (player.velocity.y !== 0 && player.lastKey == 'w') {

       
    }
    else {
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

animate();


window.addEventListener('keydown', (event) => {
    switch (event.key) {
        // --- MOvement
        case 'w':
        case 'W':
        case 'ArrowUp':
            if (player.isGrounded) {
                player.velocity.y = JUMP_FORCE
                player.isGrounded = false;
            }
            KEYS.w.pressed = true
            player.lastKey = 'w'
            break
        case 'd':
        case 'D':
        case 'ArrowRight':
            player.lastKey = 'd'
            KEYS.d.pressed = true
            break
        case 'a':
        case 'A':
        case 'ArrowLeft':
            player.lastKey = 'a'
            KEYS.a.pressed = true
            break
        // ---  Attack
        case ' ':

            break
    }

})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'w':
        case 'W':
        case 'ArrowUp':
            KEYS.w.pressed = false
            break
        case 'd':
        case 'D':
        case 'ArrowRight':
            KEYS.d.pressed = false
            break
        case 'a':
        case 'A':
        case 'ArrowLeft':
            KEYS.a.pressed = false
            break
    }
})

