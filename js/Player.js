//Class for the player
class Player extends Sprite {
    constructor({ position, imgSrc, scale = 1, numFrames = 1, sprites }) {
        super({ position: position, imageSrc: imgSrc, scale, numFrames })
        // this.position = { //default position
        //     x: 330,
        //     y:100
        // },
        // this.width = 50,
        // this.height= 50,
        this.velocity = {
            x: 0,
            y: 1
        },
        this.sides = {
            bottom: this.position.y + this.height,
            right: this.position.x + this.width,
            left: this.position.x,
            top: this.position.x
        },
        this.lastKey,
        this.sprites = sprites,
        this.direction = 'right', //keep track of direction facing
        this.isAlive = true,
        this.cameraBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            width: 200,
            height: 100
        },
        this.hitBox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            width: 14,
            height: 24.5
        },
        this.isGrounded = false,
        this.coinsCollected = 0,
        this.hearts = [],
        this.life = 3.00,
        this.hurtSound = new Audio ('../audio/zelda_hit.mp3'),
        this.hurting = false //Acts as a buffer so enemy can't hit on multiple subsequent frames


        //Creaitng new images and setting up the sprites
        for (const key in this.sprites) {
            this.sprites[key].image = new Image()
            this.sprites[key].image.src = this.sprites[key].spriteSrc
        }

        //Setting up the hearts
        for (let i = 0; i < 3; i++) {
            this.hearts[i] = new Heart({
                position: {
                    x: canvas.width - 50 - i * 45,
                    y: 20
                }
            })
        }

    }

    // draw() {
    //     canvasContext.fillStyle = 'red'
    //     canvasContext.fillRect(this.position.x, this.position.y, this.width, this.height 
    // }

    //When moving towards the right
    panCameraLeft() {
        //Updating camera box side
        let cameraRight = this.cameraBox.position.x + this.cameraBox.width

        if (cameraRight >= currentLevel.mapWidth * TILE_DIM) {
            return
        }

        while (cameraRight >= (scaledCanvas.width + Math.abs(translateValues.position.x))) {
            translateValues.position.x -= this.velocity.x
        }
    }

    //When moving towards the left
    panCameraRight() {
        //Stop from going out of bounds towards the left
        if (this.cameraBox.position.x <= 0) {
            return;
        }

        while (this.cameraBox.position.x <= Math.abs(translateValues.position.x)) {
            translateValues.position.x -= this.velocity.x; //velocity will be negative so it will be aadded
        }
    }

    //When moving up
    panCameraDown() {
        //if reached top of the map
        if ((this.cameraBox.position.y + this.velocity.y) <= 0) {
            return;
        }

        while (this.cameraBox.position.y <= Math.abs(translateValues.position.y)) {
            translateValues.position.y -= this.velocity.y
        }
    }

    //when moving down
    panCameraUp() {
        if ((this.cameraBox.position.y + this.cameraBox.height + this.velocity.y) >= currentLevel.mapHeight * TILE_DIM) {
            return;
        }

        while ((this.cameraBox.position.y + this.cameraBox.height) >= (Math.abs(translateValues.position.y) + scaledCanvas.height)) {
            translateValues.position.y -= this.velocity.y
        }
    }

    updateBoxes() {
        this.cameraBox.position.x = this.position.x - 80
        this.cameraBox.position.y = this.position.y - 20

        this.hitBox.position.x = this.position.x + 7
        this.hitBox.position.y = this.position.y + 10
    }

    //overriding the Sprite Update method 
    update() {
        //Image visualization
        // canvasContext.fillStyle= 'rgba(0,255,0,0.3)'
        // canvasContext.fillRect ( this.position.x, this.position.y, this.width, this.height)

        //Updating camerabox and hitbox with every frame
        this.updateBoxes()
        // //Camera box visualization
        // canvasContext.fillStyle = 'rgba(255,0,0,0.2)'
        // canvasContext.fillRect( this.cameraBox.position.x, this.cameraBox.position.y, this.cameraBox.width, this.cameraBox.height);

        this.sides.bottom = this.position.y + this.height;
        //Drawing the player
        this.draw();

        // //Hitbox visualization
        // canvasContext.fillStyle = 'rgba(255,0,255,0.5d)'
        // canvasContext.fillRect( this.hitBox.position.x, this.hitBox.position.y, this.hitBox.width, this.hitBox.height);

        //Animation
        if (this.isAlive)
            this.animate();
        else {
            this.velocity.x = 0
            this.velocity.y = 0
        }


        //Halt movement on x axis if colliding with map corners
        //checking one frame in advance (adding velocity)
        if (this.position.x + this.width + this.velocity.x >= currentLevel.mapWidth * TILE_DIM ||
            this.position.x + this.velocity.x <= 0) {
            this.velocity.x = 0;
        }
        //halt movement on y axis if colliding with map top
        if (this.position.y + this.height + this.velocity.y >= currentLevel.mapHeight * TILE_DIM) {
            this.velocity.y = 0;
        }

        //Movement
        this.position.x += this.velocity.x

        if (this.velocity.y > 0) {
            this.isGrounded = false;
        }

        //Checking for how much life is left
        this.life = 0;
        this.hearts.forEach(heart => {
            this.life += heart.filled;
        })
        if (this.life === 0 || (this.position.y + this.height) > currentLevel.waterLevel) {
            this.setSprite('death');
        }

        //the order of these function calls is imp - do not change
        this.updateBoxes()
        checkForHorizontalCollissions(this);
        this.applyGravity();
        this.updateBoxes()
        this.checkForVerticalCollissions() //has its own function for this 
        this.checkForSlimesCollissions()
        this.checkForCoinCollection()

        console.log('x ' + this.position.x + ' y ' + this.position.y)
    }

    applyGravity() {
        this.position.y += this.velocity.y
        this.velocity.y += GRAVITY

    }

    resurrect() {
        this.coinsCollected = 0;
        this.isAlive = true;
        
        //force setting sprite else it won't change if dead
        this.image = this.sprites.idleLeft.image
        this.numFrames = this.sprites.idleLeft.numFrames
        this.currentFrame = 0

        this.hearts.forEach(heart => {
            while (heart.filled !== 1) {
                heart.heal();
            }
        })
    }

    setSprite(sprite) {

        //If hurting
        if((this.image == this.sprites.hurtLeft.image  || this.image == this.sprites.hurtRight.image ) && this.hurting) {
            return;
        }
        // in case of ded; set isalive=false on the last frame of death image
        if (this.image == this.sprites.death.image) {
            if (this.image == this.sprites.death.image && this.currentFrame === (this.sprites.death.numFrames - 1)) {
                this.isAlive = false;
            }
            return
        }

        //If in the middle of death , jump, or hurt animation
        if ( (this.image == this.sprites.death.image && this.currentFrame < this.sprites.death.numFrames - 1)
         ) {
            console.log("returned")
            return
        }


        switch (sprite) {
            case 'idleLeft':
                if (this.image !== this.sprites.idleLeft.image) {
                    this.image = this.sprites.idleLeft.image
                    this.numFrames = this.sprites.idleLeft.numFrames
                    this.currentFrame = 0
                }
                break;
            case 'idleRight':
                if (this.image !== this.sprites.idleRight.image) {
                    this.image = this.sprites.idleRight.image
                    this.numFrames = this.sprites.idleRight.numFrames
                    this.currentFrame = 0
                }
                break;
            case 'runLeft':
                if (this.image !== this.sprites.runLeft.image) {
                    this.image = this.sprites.runLeft.image
                    this.numFrames = this.sprites.runLeft.numFrames
                    this.currentFrame = 0
                }
                break;
            case 'runRight':
                if (this.image !== this.sprites.runRight.image) {
                    this.image = this.sprites.runRight.image
                    this.numFrames = this.sprites.runRight.numFrames
                    this.currentFrame = 0
                }
                break;
            case 'hurtRight':
                if (this.image !== this.sprites.hurtRight.image) {
                    this.image = this.sprites.hurtRight.image
                    this.numFrames = this.sprites.hurtRight.numFrames
                    this.currentFrame = 1
                }
                break;
            case 'hurtLeft':
                if (this.image !== this.sprites.hurtLeft.image) {
                    this.image = this.sprites.hurtLeft.image
                    this.numFrames = this.sprites.hurtLeft.numFrames
                    this.currentFrame = 1
                }
                break;
            case 'death':
                if (this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image
                    this.numFrames = this.sprites.death.numFrames
                    this.currentFrame = 0
                }
                break;
        }
    }

    checkForVerticalCollissions() {
        for (let i = 0; i < currentLevel.collissionBlocksArray.length; i++) {

            const currentBlock = currentLevel.collissionBlocksArray[i]
            if (detectCollission({ obj1: this, obj2: currentBlock })) {
                //Stop movement on y axis and set position
                if (this.velocity.y > 0) { //moving downward
                    this.velocity.y = 0; //stahp
                    this.isGrounded = true;
                    this.position.y = currentBlock.position.y - this.height - 0.02 //(small buffer to make sure no further collission blocks are accidentally passed)
                    break
                }
                if (this.velocity.y < 0) { //moving upward
                    this.velocity.y = 0; //stahp
                    this.position.y = currentBlock.position.y + currentBlock.height + 0.02
                    break
                }

            }

        }

        //console.log(currentLevel.platformBlocksArray)

        for (let i = 0; i < currentLevel.platformBlocksArray.length; i++) {

            const currentPlatform = currentLevel.platformBlocksArray[i]
            if (platformCollission({ obj1: this.hitBox, obj2: currentPlatform })) {

                //stop movement on y axis and set position
                if (this.velocity.y > 0) { //moving downward
                    this.velocity.y = 0; //stahp
                    this.isGrounded = true;

                    const offset = this.hitBox.position.y - this.position.y + this.hitBox.height

                    this.position.y = currentPlatform.position.y - offset - 0.02 //(small buffer to make sure no further collission blocks are accidentally passed)
                    break
                }
                //No case for moving upward so the object can move directly through the platforms
            }

        }
    }

    checkForCoinCollection() {
        for (let i = 0; i < currentLevel.coinsArray.length; i++) {
            const currentCoin = currentLevel.coinsArray[i]

            if (detectCollission({ obj1: this.hitBox, obj2: currentCoin }) && currentCoin.isCollected == false) {
                currentLevel.coinsArray[i].isCollected = true;
                //getCoin.currentTime = 0
                playGetCoin()
                this.coinsCollected++;

                gsap.to('#coinBar', {
                    width: ((this.coinsCollected / currentLevel.numCoins) * 100) + '%'
                })

            }

        }
    }

    checkForSlimesCollissions() {
        for (let i = 0; i < currentLevel.slimesArray.length; i++) {
            const currentSlime = currentLevel.slimesArray[i]

            //this and slime are touching
            if (detectCollission({ obj1: this.hitBox, obj2: currentSlime })) {

                //Player is hitting slime from the top - slime dies
                if (this.velocity.y > 0 && !this.isGrounded && currentSlime.isAlive && (this.position.y + this.height < currentSlime.position.y + currentSlime.height - 10)) { //moving downward
                   currentLevel.slimesArray[i].setSprite("death") //isAlive=false will automatically be set at last frame
                   currentLevel.slimesArray[i].velocity.x = 0;
                   currentLevel.slimesArray[i].hurtSound.play();
                }
                else { //Player is hitting slime from the right/left

                    switch (currentSlime.direction) {
                        case 'left':
                            currentLevel.slimesArray[i].setSprite("attackLeft");
                            break;
                        case 'right':
                            currentLevel.slimesArray[i].setSprite("attackRight");
                            break;
                    }

                    if (!this.hurting &&  currentLevel.slimesArray[i].image !=  currentLevel.slimesArray[i].sprites.death.image) {
                        for (let i = 2; i >= 0; i--) {
                            if (this.hearts[i].filled !== 0) {
                                //Reducing the health
                                this.hearts[i].hurt();
                                this.hurting = true;
                                this.hurtSound.play();
                                setTimeout(() => {
                                    this.hurting = false;
                                }, 500)
                                
                                //Setting hurt animation
                                switch (this.direction) {
                                    case 'left':
                                        this.setSprite("hurtLeft");
                                        console.log("set hurt");
                                        break;
                                    case 'right':
                                        this.setSprite("hurtRight");
                                        console.log("set hurt");
                                        break;
                                }

                                break;
                            }
                        }
                    }
                }
            } else if (inSlimeRange({ player: this, slime: currentSlime }) && currentSlime.image != currentSlime.sprites.death.image) {
                if (onLeftOfSlime({ player: this, slime: currentSlime })) {
                    currentLevel.slimesArray[i].velocity.x = -MOVEMENT_SPEED;
                    currentLevel.slimesArray[i].direction = 'left';
                    currentLevel.slimesArray[i].setSprite("attackLeft");
                } else if (onRightOfSlime({ player: this, slime: currentSlime }) && currentSlime.image != currentSlime.sprites.death.image) {
                    currentLevel.slimesArray[i].velocity.x = MOVEMENT_SPEED;
                    currentLevel.slimesArray[i].direction = 'right';
                    currentLevel.slimesArray[i].setSprite("attackRight");
                }
            } else {
                switch (currentSlime.direction) {
                    case 'left':
                        currentLevel.slimesArray[i].setSprite("idleLeft");
                        break;
                    case 'right':
                        currentLevel.slimesArray[i].setSprite("idleRight");
                        break;
                }
                currentLevel.slimesArray[i].velocity.x = 0;

            }


        }

        //console.log(currentLevel.platformBlocksArray)

        for (let i = 0; i < currentLevel.platformBlocksArray.length; i++) {

            const currentPlatform = currentLevel.platformBlocksArray[i]
            if (platformCollission({ obj1: this.hitBox, obj2: currentPlatform })) {
                if (this.velocity.y > 0) { //moving downward
                    this.velocity.y = 0; //stahp
                    this.isGrounded = true;

                    const offset = this.hitBox.position.y - this.position.y + this.hitBox.height

                    this.position.y = currentPlatform.position.y - offset - 0.02 //(small buffer to make sure no further collission blocks are accidentally passed)
                    break
                }
                // if(this.velocity.y<0) { //moving upward
                //     this.velocity.y=0;
                //     this.position.y = currentPlatform.position.y  + currentPlatform.height + 0.02
                //     break
                // }
            }

        }
    }
}
