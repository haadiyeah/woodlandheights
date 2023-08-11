
class Sprite {
    constructor({position, imageSrc, scale=1, numFrames=1}) {
        this.position = position;
        this.image=new Image();
        this.image.src = imageSrc
        this.loaded=false
        this.scale=scale
        this.numFrames = numFrames
        this.currentFrame = 0
        this.elapsedFrames = 0

        this.image.onload = () => {
            this.loaded = true
            this.width= ( this.image.width/this.numFrames ) * this.scale
            this.height = (this.image.height ) * this.scale
        }
       
    }

    draw() {
        if (!this.loaded)
            return;
        else {
            canvasContext.drawImage(
                this.image,
                this.currentFrame * (this.image.width / this.numFrames), //x crop mark
                0, //y crop mark
                this.image.width / this.numFrames, //width of area to crop
                this.image.height, //height of crop area
                this.position.x,
                this.position.y,
                this.width ,
                this.height 
            )
        }
    }

    update() {
        this.draw();
        this.animate();
        
    }

    animate() {
        this.elapsedFrames++
        if(this.elapsedFrames % ANIMATION_SPEED === 0 ) { //move to next frame
            if(this.currentFrame < (this.numFrames-1)) {
                this.currentFrame++; //move forward
            } else {
                this.currentFrame = 0; //loop back to first frame
            }
        }
    }
}

//Class for the player
class Player extends Sprite {
    constructor({position, imgSrc, scale=1, numFrames = 1, sprites}) {
        super( {position: position, imageSrc: imgSrc , scale, numFrames})
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
        this.sprites=sprites,
        this.direction = 'right', //keep track of direction facing
        this.isAlive = true,
        this.cameraBox = {
            position: {
                x:this.position.x,
                y:this.position.y
            },
            width: 200,
            height: 80
        }

        //Creaitng new images and setting up the sprites
        for (const key in this.sprites) {
            this.sprites[key].image = new Image()
            this.sprites[key].image.src = this.sprites[key].spriteSrc
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

        if(cameraRight>= MAP_WIDTH * TILE_DIM ) {
            return
        }

        if(cameraRight >= ( scaledCanvas.width + Math.abs(translateValues.position.x ))) {
            translateValues.position.x -= this.velocity.x 
        }
    }

    //When moving towards the left
    panCameraRight() {
        //Stop from going out of bounds towards the left
        if(this.cameraBox.position.x <= 0) {
            return;
        }

        if(this.cameraBox.position.x <= Math.abs(translateValues.position.x)) {
        translateValues.position.x -= this.velocity.x ; //velocity will be negative so it will be aadded
        }
    }

    //When moving up
    panCameraDown() {
        //if reached top of the map
        if(this.cameraBox.position.y + this.velocity.y <= 0) {
            return;
        }

        if(this.cameraBox.position.y <= Math.abs(translateValues.position.y)) {
            translateValues.position.y -= this.velocity.y
        }
    }

    //when moving down
    panCameraUp() {
        if(this.cameraBox.position.y + this.cameraBox.height + this.velocity.y >= MAP_HEIGHT*TILE_DIM) {
            return;
        }

        if(this.cameraBox.position.y + this.cameraBox.height >= Math.abs(translateValues.position.y) + scaledCanvas.height) {
            translateValues.position.y -= this.velocity.y
        }
    }

    updateCameraBox() {
        this.cameraBox.position.x = this.position.x - 80
        this.cameraBox.position.y = this.position.y
    }

    update() {
        //Drawing a rectangle to visualize the sprite img dimensions!
        canvasContext.fillStyle= 'rgba(0,255,0,0.3)'
        canvasContext.fillRect ( this.position.x, this.position.y, this.width, this.height)
        
        //Drawing a rectangle to visualize the camera box
        this.updateCameraBox()
        canvasContext.fillStyle = 'rgba(255,0,0,0.2)'
        canvasContext.fillRect( this.cameraBox.position.x, this.cameraBox.position.y, this.cameraBox.width, this.cameraBox.height);

        this.sides.bottom = this.position.y+this.height;
        this.draw();
        if(this.isAlive)
            this.animate();
      

        //Halt movement on x axis if colliding with map corners
        //checking one frame in advance (adding velocity)
        if(this.position.x + this.width + this.velocity.x >= MAP_WIDTH*TILE_DIM ||
            this.position.x + this.velocity.x <=0 ) {
            this.velocity.x = 0;
        }
        //halt movement on y axis if colliding with map top
        if(this.position.y + this.height + this.velocity.y >= MAP_HEIGHT*TILE_DIM) {
            this.velocity.y = 0;
        }

        //Movement
        this.position.x += this.velocity.x
        this.checkForHorizontalCollissions(); //the order is imp
        this.applyGravity();
        this.checkForVerticalCollissions()
        console.log( 'x '+this.position.x + ' y ' + this.position.y)
    }

    applyGravity () {
        //if(this.position.y>=30) {
            this.position.y += this.velocity.y
            this.velocity.y += GRAVITY
        //} else {
        //    this.velocity.y=0;
        //}
    }

    setSprite(sprite) {
        // in case of ded
        if (this.image === this.sprites.death.image) {
            if (this.image === this.sprites.death.image && this.framesCurrent == this.sprites.death.framesMax - 1) {
                this.isAlive = false;
            }
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
            case 'death':
                if(this.image!== this.sprites.death.image) {
                    this.image=this.sprites.death.image
                    this.numFrames = this.sprites.death.numFrames
                    this.currentFrame=0
                }
                break;
        }
    }

    checkForVerticalCollissions() {
        for(let i=0; i< collissionBlocksArray.length; i++) {

            const currentBlock = collissionBlocksArray[i]
            if ( detectCollission({ obj1: this, obj2: currentBlock}) ) {
                if(this.velocity.y > 0) { //moving downward
                    this.velocity.y = 0; //stahp
                    this.position.y = currentBlock.position.y - this.height -0.02 //(small buffer to make sure no further collission blocks are accidentally passed)
                    break
                }
                if(this.velocity.y<0) { //moving upward
                    this.velocity.y=0;
                    this.position.y = currentBlock.position.y  + currentBlock.height + 0.02
                    break
                }
            }

        }

        //console.log(platformBlocksArray)

        for(let i=0; i< platformBlocksArray.length; i++) {

            const currentPlatform = platformBlocksArray[i]
            if ( platformCollission({ obj1: this, obj2: currentPlatform}) ) {
                if(this.velocity.y > 0) { //moving downward
                    this.velocity.y = 0; //stahp
                    this.position.y = currentPlatform.position.y - this.height -0.02 //(small buffer to make sure no further collission blocks are accidentally passed)
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

    checkForHorizontalCollissions() {
        for(let i=0; i< collissionBlocksArray.length; i++) {
            const currentBlock = collissionBlocksArray[i]

            if ( detectCollission({ obj1: this, obj2: currentBlock}) ) {
                if(this.velocity.x > 0) { //moving to the right
                    this.velocity.x = 0; //stahp
                    this.position.x = currentBlock.position.x - this.width -0.02 //(buffer to make sure player cannot move past any collission blocks to the right)
                    break
                }
                if(this.velocity.x<0) { //moving upward
                    this.velocity.x=0;
                    this.position.x = currentBlock.position.x + currentBlock.width + 0.02
                    break
                }
            }

        }

      
    }
}

class CollissionBlock {
    constructor({position, height=16}) {
        this.position = position;
        this.width= 16; //tile size is 16px x 16px
        this.height=height
    }

    draw() {
        canvasContext.fillStyle= 'rgba(255,0,0,0.5)';
        canvasContext.fillRect(this.position.x, this.position.y, this.width,this.height);
    }

    update() {
        this.draw();
    }
}


