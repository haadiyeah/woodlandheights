class Coin extends Sprite {
    constructor({position, imgSrc, scale=1, numFrames = 1, value=1, animationSpeed = ANIMATION_SPEED}) {
        super( {position: position, imageSrc: imgSrc , scale, numFrames, animationSpeed})
        this.isCollected = false
        this.value = value 
    }

    update() {
        if(! this.isCollected) {
            this.draw();
            this.animate();
        }
    }
    
}
