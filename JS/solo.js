let tile=32;
let row=16;
let col=16;

let map;
let mapWidth= tile * col;
let mapHeight= tile * row;
let context;

let playerWidth=tile*2;
let playerHeight=tile*2;
let playerX=tile*col/2-tile;
let playerY=tile*row-tile*2;
let playerImg;
let playerVelX=tile;

let enemyArray=[];
let enemyWidth=tile*2;
let enemyHeight=tile;
let enemyX=tile;
let enemyY=tile;
let enemyImg;
let enemyVelY=1;

let spawnPosition;
let spawnPositions=[-999,-998,-997];
let remaining=0;

let shotArray=[];
let shootVelY=-10;
let shotImg=new Image();
shotImg.src="../images/shot.png";

let gameOver=false;
let playerScore=document.getElementById("playerScore");  //Getting the html element to be updated
let newScore=0;
let gameHeader=document.getElementById("gameHeader");

let player= {
    y:playerY,
    x:playerX,
    width:playerWidth,
    height:playerHeight
}

window.onload = ()=>{
    map=document.getElementById("map");  //Creating the game map
    map.width=mapWidth;
    map.height=mapHeight;
    context=map.getContext("2d");

    playerImg=new Image();
    playerImg.src="../images/ship.png";
    playerImg.onload= ()=>{
        context.drawImage(playerImg,player.x,player.y,player.width,player.height);
    }

    enemyImg=new Image();
    enemyImg.src="../images/alien.png";

    createEnemy();

    requestAnimationFrame(update);
    document.addEventListener("keydown",move);
    document.addEventListener("keyup",shoot); //releases a bullet once the spacebar is released
}

function update(){ //Function to update the player and enemy position
    if(gameOver){
        return;
    }
    requestAnimationFrame(update);
    context.clearRect(0,0,map.width,map.height); //Erases the previous position of the player
    context.drawImage(playerImg,player.x,player.y,player.width,player.height); //Draws the new position

    for(let i=0;i<enemyArray.length;i++){
        let enemy=enemyArray[i];
        if (enemy.alive) {
            enemy.y+=enemyVelY;  //The enemy moves horizontally
 
            context.drawImage(enemyImg, enemy.x,enemy.y,enemy.width,enemy.height);

            if(enemy.y>playerY||collision(player,enemy)){
                gameOver=true;
                gameHeader.innerText="Game Over";
            }
        }
    }

    for(let j=0;j<shotArray.length;j++){
        let shot=shotArray[j];
        shot.y+=shootVelY;
        context.drawImage(shotImg,shot.x,shot.y,shot.width,shot.height);

        for(k=0;k<enemyArray.length;k++){ //Detecting collision
            let enemy=enemyArray[k];
            if (!shot.used && enemy.alive && collision(shot,enemy)){  //Checking if a shot killed an enemy
                shot.used=true;
                newScore+=100;
                enemy.alive=false;
                remaining--;
            }
        }
    }

    while(shotArray.length>0 && (shotArray[0].used||shotArray[0].y<0)){
        shotArray.shift();  //Clearing the bullet from the program once used
    }

    playerScore.innerText=newScore;  //Updating the score on the screen
        
}

function move(e){
    if(gameOver) { //The player will stop moving at game over
        return;
    }
    if (e.code=="ArrowRight" && player.x + tile + player.width<=map.width){  //Checking for key presses and collisions with the ap
        player.x += playerVelX;
    } else if(e.code=="ArrowLeft" && player.x - tile>=0) {
        player.x -= playerVelX;
    } else if (e.code=="ArrowUp" && player.y - tile>=0){
        player.y -= tile;   
    } else if (e.code=="ArrowDown" && player.y + tile + player.height<=map.height){
        player.y += tile; 
    }
}

function createEnemy() { //creating the enemies and their positions
    for (let i=0;i<3;i++){
        do{
            spawnPosition = Math.floor(Math.random() * (mapWidth) );
        } while (spawnPositions.indexOf(spawnPosition)!=-1 ||spawnPosition+enemyWidth>mapWidth ||spawnPosition-tile<0); //Checking for out of bounds and for spawns in the same point

        spawnPositions[i]=spawnPosition;
        
            let enemy={    //creating each enemy as objects one by one
                img: enemyImg,
                x: spawnPositions[i],  
                y: enemyY + enemyHeight, 
                width:enemyWidth,
                height:enemyHeight,
                alive: true
            }
            enemyArray.push(enemy);
    }
    spawnPositions=[-1,-2,-3]
}

function shoot(e){
    if(gameOver){  //The player will not be able to shoot at game over
        return;
    }
    if (e.code=="Space"){
        let bullet = {
            x: player.x + playerWidth*15/32,
            y:player.y,
            width:tile/8,
            height:tile,
            used:false
        }
        shotArray.push(bullet);
    }
}

function collision(obj1,obj2){
    return obj1.x<obj2.x +obj2.width &&//bullet's top left corner has not reached the alien's top right corner
           obj1.x+obj1.width>obj2.x && //bullet's top right corner surpasses alien's top left corner
           obj1.y<obj2.y+obj2.height &&//bullet's top left corner has not reached alien's bottom left corner
           obj1.y+obj1.height>obj2.y; //bullet's bottom left corner has not passed alien's top left corner
}