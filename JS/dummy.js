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
let enemyVelX=1;

let enemyRow=2;
let enemyCol=3;
let remaining=0;

let bossWidth=tile*4;
let bossHeight=tile*2;
let bossX=tile*col/2-3*tile;
let bossY=0;
let bossImg;

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

let boss={
    x:bossX,
    y:bossY,
    width:bossWidth,
    height:bossHeight
}

window.onload = ()=>{
    map=document.getElementById("map");  //Creating the game map
    map.width=mapWidth;
    map.height=mapHeight;
    context=map.getContext("2d");

    /*playerImg=new Image();
    playerImg.src="../images/ship.png";
    playerImg.onload= ()=>{
        context.drawImage(playerImg,player.x,player.y,player.width,player.height);
    }*/

    bossImg = new Image();
    bossImg.src="../images/boss.png";
    bossImg.onload = ()=>{
        context.drawImage(bossImg,boss.x,boss.y,boss.width,boss.height);
    }
}