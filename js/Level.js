class Level extends Sprite {
    constructor({ position, imgSrc, scale = 1, numFrames = 1, animationSpeed = ANIMATION_SPEED }) {
        super({ position: position, imageSrc: imgSrc, scale, numFrames, animationSpeed })

        this.loaded=true,
        this.paused=false,
        this.mapWidth = 70,
        this.mapHeight = 40,
        this.numCoins = 0,
        this.levelNo = 1,
        this.waterLevel = 560,
        this.playerStartingYPos = scaledCanvas.height - (this.mapHeight * TILE_DIM),

        //2D Arrays
        this.floorCollissions2D = [],
        this.platformCollissions2D = [],
        this.coins2D = [],
        this.slimes2D = [],

        //Object arrays
        this.collissionBlocksArray = [], 
        this.platformBlocksArray = [], 
        this.coinsArray = [], 
        this.slimesArray = []
    }

    setupLevel(levelNo) {
        switch (levelNo) {
            case 1:
                this.image.src = './img/map1.png'
                this.levelNo = levelNo;
                this.mapWidth = 70;
                this.mapHeight = 40;
                this.waterLevel = 560;
                this.playerStartingYPos = 370;
                this.yTranslateBg = scaledCanvas.height - (this.mapHeight * TILE_DIM); //player starts at bottom - this is Y Translate value for bg

                this.floorCollissions2D.length=0; //clears the array
                for (let i = 0; i < floorCollissionsMap1.length; i += this.mapWidth) { //populating from map1
                    this.floorCollissions2D.push(floorCollissionsMap1.slice(i, i +this.mapWidth)) //pushing an array of length this.mapWidth (one row)
                }

                this.platformCollissions2D.length=0;
                for (let i = 0; i < platformCollissionsMap1.length; i += this.mapWidth) {
                    this.platformCollissions2D.push(platformCollissionsMap1.slice(i, i + this.mapWidth))
                }

                this.coins2D.length= 0;
                for (let i = 0; i < coinsMap1.length; i += this.mapWidth) {
                    this.coins2D.push(coinsMap1.slice(i, i + this.mapWidth)) 
                }

                this.slimes2D.length =0;
                for (let i = 0; i < slimesMap1.length; i += this.mapWidth) {
                    this.slimes2D.push(slimesMap1.slice(i, i + this.mapWidth))
                }

                this.initArrays();

                break;
                case 2:
                    this.image.src = './img/map2.png'
                    this.levelNo = levelNo;
                    this.mapWidth = 100;
                    this.mapHeight = 25;
                    this.waterLevel = 360;
                    this.playerStartingYPos = 0; //player starts at top of map
                    this.yTranslateBg = 0; //player starts at top of map
    
                    this.floorCollissions2D.length=0; //clears the array
                    for (let i = 0; i < floorCollissionsMap2.length; i += this.mapWidth) { //populating from Map2
                        this.floorCollissions2D.push(floorCollissionsMap2.slice(i, i +this.mapWidth)) //pushing an array of length this.mapWidth (one row)
                    }
    
                    this.platformCollissions2D.length=0;
                    for (let i = 0; i < platformCollissionsMap2.length; i += this.mapWidth) {
                        this.platformCollissions2D.push(platformCollissionsMap2.slice(i, i + this.mapWidth))
                    }
    
                    this.coins2D.length= 0;
                    for (let i = 0; i < coinsMap2.length; i += this.mapWidth) {
                        this.coins2D.push(coinsMap2.slice(i, i + this.mapWidth)) 
                    }
    
                    this.slimes2D.length =0;
                    for (let i = 0; i < slimesMap2.length; i += this.mapWidth) {
                        this.slimes2D.push(slimesMap2.slice(i, i + this.mapWidth))
                    }
    
                    this.initArrays();
    
                    break;
        }

        
    }

    initArrays() {
        //Clearing all the object arrays and repopulating them
        this.collissionBlocksArray.length = 0;
        this.platformBlocksArray.length = 0;
        this.coinsArray.length = 0;
        this.slimesArray.length = 0;

        this.floorCollissions2D.forEach((row, y) => {
            row.forEach((item, x) => { //x==column index
                if (item !== 0) {
                    //console.log("collission block")
                    this.collissionBlocksArray.push(new CollissionBlock({
                        position: {
                            x: x * 16,
                            y: y * 16 //16=size of collission block
                        }
                    }))
                }
            })
        
        })
        
        this.platformCollissions2D.forEach((row, y) => { //looping through rows
            row.forEach((item, x) => { //for each individual specific symbol
                if (item !== 0) {
                    this.platformBlocksArray.push(new CollissionBlock({
                        position: {
                            x: x * 16,
                            y: y * 16
                        },
                        height: 9
                    }))
                }
            })
        })
        
        
        this.coins2D.forEach((row, y) => { //looping through rows
            row.forEach((item, x) => { //for each individual specific symbol
                if (item !== 0) {
                    this.coinsArray.push(new Coin({
                        position: {
                            x: x * 16,
                            y: y * 16
                        }
                    }))
        
                    this.numCoins++;
                }
            })
        })
        
        this.slimes2D.forEach((row, y) => { //looping through rows
            row.forEach((item, x) => { //for each individual specific symbol
                if (item !== 0) {
                    this.slimesArray.push(createSlime(x * 16, y * 16))
                }
            })
        })
        
    }

    pausedDraw() {
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

        this.collissionBlocksArray.forEach(collissionBlick => {
            collissionBlick.draw();
        })
        //Draw out the platforms
        this.platformBlocksArray.forEach(platform => {
            platform.draw();
        })
        this.coinsArray.forEach(coin => {
            if(!coin.isCollected)
                coin.draw();
        })
        this.slimesArray.forEach(slime => {
            slime.draw();
        })

    }


    update() {
        this.draw();
        this.animate();
        this.collissionBlocksArray.forEach(collissionBlick => {
            collissionBlick.update();
        })
        //Draw out the platforms
        this.platformBlocksArray.forEach(platform => {
            platform.update();
        })
        this.coinsArray.forEach(coin => {
            coin.update();
        })
        this.slimesArray.forEach(slime => {
            slime.update();
        })
    }
}
