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
    constructor(i,j,newEnemyVelX){
        this.tile = 32;
        this.enemyImg = new Image();
        this.enemyImg.src = "../images/alien.png";
        this.x= this.tile + i*this.tile * 2;  
        this.y= this.tile + j*this.tile;
        this.width=this.tile * 2;
        this.height=this.tile;
        this.alive=true;
        this.enemyVelX = newEnemyVelX;
    }
}

export class playerShot{
    constructor(newPlayerX,newPlayerY,newPlayerWidth){
        this.tile = 32;
        this.x= newPlayerX + newPlayerWidth*15/32,
        this.y=newPlayerY,
        this.width=this.tile/8,
        this.height=this.tile,
        this.used=false
    }
}
