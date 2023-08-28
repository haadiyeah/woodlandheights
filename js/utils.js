function detectCollission({ obj1, obj2 }) { //obj1 represents the player
    if (obj1.position.y + obj1.height >= obj2.position.y
        &&
        obj1.position.y <= obj2.position.y + obj2.height
        && 
        obj1.position.x <= obj2.position.x + obj2.width 
        &&
        obj1.position.x + obj1.width >= obj2.position.x
    ) { return true } else { return false }
}

function platformCollission({ obj1, obj2 }) { //obj1 represents the player
    if (obj1.position.y + obj1.height >= obj2.position.y
        &&
        obj1.position.y + obj1.height <= obj2.position.y + obj2.height
        && 
        obj1.position.x <= obj2.position.x + obj2.width 
        &&
        obj1.position.x + obj1.width >= obj2.position.x
    ) { return true } else { return false }
}


function inSlimeRange({ player, slime }) { //obj1 represents the player
    if (player.position.y + ENEMY_VERTICAL_RANGE >= slime.position.y && player.position.y - ENEMY_VERTICAL_RANGE <= slime.position.y) { //on the same range horizontally
        if(onRightOfSlime({player, slime})) {
            if(player.position.x < slime.position.x + slime.width*3) {
                return true;
            } else {
                return false;
            }
        } else if(onLeftOfSlime({player,slime})) {
            if(player.position.x > slime.position.x - slime.width*2) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function onLeftOfSlime({ player, slime }) {
    if (player.position.x < slime.position.x)
        return true;
    else
        return false;
}

function onRightOfSlime({ player, slime }) {
    if (player.position.x > slime.position.x + slime.width)
        return true;
    else
        return false;
}


function createSlime(xpos, ypos) {
    const slime = new Enemy( {
        position: {
            x: xpos,
            y: ypos - 11
        },
        imgSrc: '../img/Slime/Idle_Left.png',
        scale: 1.3,
        numFrames: 4,
        sprites: {
            death: {
                spriteSrc: '../img/Slime/Death.png',
                numFrames: 4
            },
            attackLeft: {
                spriteSrc: '../img/Slime/Attack_Left.png',
                numFrames: 5
            },
            attackRight: {
                spriteSrc: '../img/Slime/Attack_Right.png',
                numFrames: 5
            },
            idleLeft: {
                spriteSrc: '../img/Slime/Idle_Left.png',
                numFrames: 4
            },
            idleRight: {
                spriteSrc: '../img/Slime/Idle_Right.png',
                numFrames: 4
            },
        },
    })

    return slime;
}


function randomizeDirection() {
    // generate random number 
    let rand = Math.round( Math.random() );

    if(rand%2 === 0 ) {
        return 'right';
    } else {
        return 'left';
    }
}


function checkForVerticalCollissions(object) {
    for(let i=0; i< currentLevel.collissionBlocksArray.length; i++) {

        const currentBlock = currentLevel.collissionBlocksArray[i]
        if ( detectCollission({ obj1: object, obj2: currentBlock}) ) {
            if(object.velocity.y > 0) { //moving downward
                object.velocity.y = 0; //stahp
                object.isGrounded=true;
             object.position.y = currentBlock.position.y -object.height-0.02 //(small buffer to make sure no further collission blocks are accidentally passed)
                break
            }
            if(object.velocity.y<0) { //moving upward
                object.velocity.y=0;
                object.position.y = currentBlock.position.y  + currentBlock.height + 0.02
                break
            }
        }

    }

    //console.log(currentLevel.platformBlocksArray)

    for(let i=0; i< currentLevel.platformBlocksArray.length; i++) {

        const currentPlatform = currentLevel.platformBlocksArray[i]
        if ( platformCollission({ obj1: object, obj2: currentPlatform}) ) {
            if(object.velocity.y > 0) { //moving downward
                object.velocity.y = 0; //stahp
                object.isGrounded=true;

                const offset = object.position.y - object.position.y + object.height

                object.position.y = currentPlatform.position.y -offset -0.02 //(small buffer to make sure no further collission blocks are accidentally passed)
                break
            }
          //No case for moving upward so the object can move directly through the platforms
        }

    }
}

function checkForHorizontalCollissions(object) {
    for(let i=0; i< currentLevel.collissionBlocksArray.length; i++) {
        const currentBlock = currentLevel.collissionBlocksArray[i]

        if ( detectCollission({ obj1: object, obj2: currentBlock}) ) {
            if(object.velocity.x > 0) { //moving to the right
                object.velocity.x = 0; //stahp
                object.position.x = currentBlock.position.x - object.width -0.02 //(buffer to make sure player cannot move past any collission blocks to the right)
                break
            }
            if(object.velocity.x<0) { //moving left
                object.velocity.x=0;
                object.position.x = currentBlock.position.x + currentBlock.width + 0.02
                break
            }
        }

    }
}

//--------Sound playing functions
function playGetCoin() {
    var getCoin = new Audio('../audio/oot_rupee_get.mp3')
    getCoin.play();

    getCoin.onended = function(){
        this.currentSrc = null;
        this.src = "";
        this.srcObject = null;
        this.remove();
    };
}
function playGameOver() {
    var gameOverSound = new Audio('../audio/zelda_secret_sound.mp3')
    gameOverSound.play();

    gameOverSound.onended = function(){
        this.currentSrc = null;
        this.src = "";
        this.srcObject = null;
        this.remove();
    };
}

function playVictory() {
    var victorySound = new Audio('../audio/rupee-collect.mp3')
    victorySound.play();

    victorySound.onended = function(){
        this.currentSrc = null;
        this.src = "";
        this.srcObject = null;
        this.remove();
    };
}

