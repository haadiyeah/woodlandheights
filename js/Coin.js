class Coin extends Sprite {
    constructor({position, imgSrc = '../img/coin.png', scale=1.5, numFrames = 14, value=1, animationSpeed = 10}) {
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
