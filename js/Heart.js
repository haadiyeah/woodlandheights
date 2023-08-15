class Heart extends Sprite {
    constructor({position, imgSrc = '../img/heart/heart_sheet.png', scale=2.5, numFrames = 5}) {
        super( {position: position, imageSrc: imgSrc , scale, numFrames})
        this.filled = 1.0,
        this.borderImg = new Image()
        this.borderImg.src= '../img/heart/border.png'
    }


    hurt() {
        if(this.filled === 0) { //empty
            return
        } else {
            this.currentFrame++
            this.filled -= 0.25
       }
    }

    heal() {
        if(this.filled === 1 ) {
            return;
        } else {
            this.currentFrame --;
            this.filled += 0.25;
        }
    }

    
    draw() {
        if (!this.loaded )
            return;
        else {
            //Drawing heart border
            canvasContext.drawImage(
                this.borderImg,
                0,
                0,
                this.borderImg.width,
                this.borderImg.height,
                this.position.x,
                this.position.y,
                this.width,
                this.height
            )
            //Drawing the heart itself
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
}
