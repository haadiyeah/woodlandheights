class Enemy extends Sprite {
    constructor({position, imgSrc, scale=1, numFrames = 1, sprites, animationSpeed = ANIMATION_SPEED}) {
        super( {position: position, imageSrc: imgSrc , scale, numFrames, animationSpeed})
        this.velocity = {
            x: 0,
            y: 0
        },
        this.sprites=sprites,
        this.direction = randomizeDirection(), //keep track of direction facing
        this.isAlive = true,
        this.hurtSound=  new Audio('./audio/splat.mp3')

        //Creaitng new images and setting up the sprites
        for (const key in this.sprites) {
            this.sprites[key].image = new Image()
            this.sprites[key].image.src = this.sprites[key].spriteSrc
        }
    }

    applyGravity () {
        this.position.y += this.velocity.y
        this.velocity.y += GRAVITY
    }

    //x1=left bound, x2=right bound
    moveBetween(x1 = 995, x2=1545) {
         if(this.position.x <= x1) {
            this.velocity.x = MOVEMENT_SPEED;
            this.setSprite('runRight');
        } else if(this.position.x >= x2) {
            this.velocity.x = MOVEMENT_SPEED;
            this.setSprite('runRight');
        }
    }

    //Overriding parent func
    update() {
        //visualizing image dimensions
        // canvasContext.fillStyle= 'rgba(0,255,0,0.3)'
        // canvasContext.fillRect ( this.position.x, this.position.y, this.width, this.height)
        this.draw();
        if(this.isAlive) {
            this.animate();
            this.position.x += this.velocity.x;
            checkForHorizontalCollissions(this);
            this.applyGravity();
            checkForVerticalCollissions(this);
            
        }

    //this.setSprite("attack");   
    }

    setSprite(sprite) {
        // in case of ded
        if (this.image == this.sprites.death.image) {
            if (this.image == this.sprites.death.image && this.currentFrame === (this.sprites.death.numFrames-1) ) {
                this.isAlive = false;
            }
            return
        }

        if (this.image === this.sprites.death.image && this.currentFrame < this.sprites.death.numFrames - 1) {
            return
        }

        //if attacking, do not change 
        if (sprite != 'death' && (this.image === this.sprites.attackLeft.image || this.image === this.sprites.attackRight.image) && this.currentFrame < this.sprites.attackLeft.numFrames - 1) {
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

            case 'attackLeft': 
            if(this.image!== this.sprites.attackLeft.image) {
                this.image=this.sprites.attackLeft.image
                this.numFrames = this.sprites.attackLeft.numFrames
                this.currentFrame=0
            }
            break;
            case 'attackRight': 
            if(this.image!== this.sprites.attackRight.image) {
                this.image=this.sprites.attackRight.image
                this.numFrames = this.sprites.attackRight.numFrames
                this.currentFrame=0
            }
            break;
        }
    }

}