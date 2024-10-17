// Player.js
export class player {
    constructor(tile,row,col) {
        this.playerWidth = tile * 2;
        this.playerHeight = tile * 2;
        this.playerX = tile * col / 2 - tile;
        this.playerY = tile * row - tile * 2;
        this.playerVelX = tile;
        this.width = tile * 2;
        this.height = tile * 2;
        this.x = tile * col / 2 - tile;
        this.y = tile * row - tile * 2;
    }
}

export class alien {
    constructor(tile,i,j,newEnemyVelX){
        this.enemyImg = new Image();
        this.enemyImg.src = "../images/alien.png";
        this.x= tile + i*tile * 2;  
        this.y= tile + j*tile;
        this.width=tile * 2;
        this.height=tile;
        this.alive=true;
        this.enemyVelX = newEnemyVelX;
    }
}

export class playerShot{
    constructor(tile,newPlayerX,newPlayerY,newPlayerWidth){
        this.x= newPlayerX + newPlayerWidth*15/32,
        this.y=newPlayerY,
        this.width=tile/8,
        this.height=tile,
        this.used=false;
    }
}

export class Asteroid{
    constructor(tile,spawnPosition){
        this.img=new Image();
        this.img.src = "../images/asteroid.png";
        this.x=spawnPosition; 
        this.y=0;
        this.width=tile*2;
        this.height=tile;
        this.alive=true;
    }
}
