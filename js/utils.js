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
            y: ypos - 17
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