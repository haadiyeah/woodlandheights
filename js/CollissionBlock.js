class CollissionBlock {
    constructor({position, height=TILE_DIM}) {
        this.position = position;
        this.width= TILE_DIM; //default,tile size is 16px x 16px
        this.height=height
    }

    draw() {
        // canvasContext.fillStyle= 'rgba(255,0,0,0.5)';
        // canvasContext.fillRect(this.position.x, this.position.y, this.width,this.height);
    }

    update() {
        this.draw();
    }
}
