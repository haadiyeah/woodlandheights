class Sprite {
    constructor({position, imageSrc}) {
        this.position = position;
        this.image=new Image();
        this.image.onload = () => {
            this.loaded = true
            this.width= this.image.width
            this.height = this.image.height
        }
        this.image.src = imageSrc
        this.loaded=false
    }

    draw() {
        if(!this.loaded)
            return; 
        canvasContext.drawImage(this.image, this.position.x, this.position.y)
    }

    update() {
        this.draw();
    }
}

//Class for the player
class Player extends Sprite {
    constructor({position, imgSrc}) {
        super( {position: position, imageSrc: imgSrc })
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
        this.lastKey
    }

    // draw() {
    //     canvasContext.fillStyle = 'red'
    //     canvasContext.fillRect(this.position.x, this.position.y, this.width, this.height)
    // }

    update() {
        canvasContext.fillStyle= 'rgba(0,255,0,0.3)'
        canvasContext.fillRect ( this.position.x, this.position.y, this.width, this.height)
        this.draw();
        this.sides.bottom = this.position.y+this.height;

         //Movement
        this.position.x += this.velocity.x
       this.checkForHorizontalCollissions(); //the order is imp
        this.applyGravity();
        this.checkForVerticalCollissions()
    }

    applyGravity () {
        //if(this.position.y>=30) {
            this.position.y += this.velocity.y
            this.velocity.y += GRAVITY
        //} else {
        //    this.velocity.y=0;
        //}
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
    constructor({position}) {
        this.position = position;
        this.width= 16; //tile size is 16px x 16px
        this.height=16;
    }

    draw() {
        canvasContext.fillStyle= 'rgba(255,0,0,0.5)';
        canvasContext.fillRect(this.position.x, this.position.y, this.width,this.height);
    }

    update() {
        this.draw();
    }
}


