class Sprite {
    constructor({position, imageSrc, scale=1, numFrames=1, animationSpeed = ANIMATION_SPEED}) {
        this.position = position;
        this.image=new Image();
        this.image.src = imageSrc
        this.loaded=false
        this.scale=scale
        this.numFrames = numFrames
        this.currentFrame = 0
        this.elapsedFrames = 0
        this.animationSpeed = animationSpeed

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
        if(this.elapsedFrames % this.animationSpeed === 0 ) { //move to next frame
            if(this.currentFrame < (this.numFrames-1)) {
                this.currentFrame++; //move forward
            } else {
                this.currentFrame = 0; //loop back to first frame
            }
        }
    }
}