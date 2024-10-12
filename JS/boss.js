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

let spawnPosition;
let bossVelX=1;
let bossShootDecision;
let bossShoots;
let spawnPositions=[-999,-998,-997];
let bossBullet;
let bossBulletVelY=10;

let playerShotSFX=new Audio("../audio/playerShot.mp3");
let bossShotSFX = new Audio("../audio/bossShot.mp3");
let gameOverTheme = new Audio("../audio/gameOverTheme.mp3");
let victoryTheme = new Audio("../audio/victory.mp3");
let bossTheme=document.getElementById("bossTheme");
let bossTopScore=localStorage.getItem('bossTopScore');
let currentUser=localStorage.getItem('currentUser');

let bossShotImg=new Image()
bossShotImg.src="../images/bossShot.png";

let bossHealth=document.getElementById("bossHealth");;
let currentHealth=50;

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
    height:bossHeight,
    hits:0,
    alive:true
}



window.onload = ()=>{
    map=document.getElementById("map");  //Creating the game map
    map.width=mapWidth;
    map.height=mapHeight;
    context=map.getContext("2d");

    playerImg=new Image();
    playerImg.src="../images/ship.png";

    playerImg.onload = ()=>{
        context.drawImage(playerImg,player.x,player.y,player.width,player.height);
    }

    bossImg = new Image();
    bossImg.src="../images/boss.png";
    
    enemyImg=new Image();
    enemyImg.src="../images/alien.png";
    
    setInterval(createEnemy,3000);
    loadTopScores();

    requestAnimationFrame(update);
    document.addEventListener("keydown",move);
    document.addEventListener("keyup",shoot); //releases a shot once the spacebar is released
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

            if(collision(player,enemy)){
                gameOver=true;
                bossTheme.pause();
                gameOverTheme.play();
                gameHeader.innerText="Game Over";
                updateScores(newScore);
            }
        }
    }

    if(boss.alive){
        context.drawImage(bossImg,boss.x,boss.y,boss.width,boss.height);
        boss.x+=bossVelX;

        if (boss.x+boss.width >=map.width||boss.x<=0){
            bossVelX*=-1; //Inverting the movement direction on collision with the edge of the map
            context.drawImage(bossImg,boss.x,boss.y,boss.width,boss.height);
        } 

        setInterval(bossShot,750);
        
        if(bossShot=1){
            let bossBullet=bossShoots;
            bossBullet.y+=bossBulletVelY;
            bossShotSFX.play();
            context.drawImage(bossShotImg,bossBullet.x,bossBullet.y,bossBullet.width,bossBullet.height);

            if (collision(bossBullet,player)){
                gameOver=true;
                bossTheme.pause();
                gameOverTheme.play();
                gameHeader.innerText="Game Over";
                updateScores(newScore);
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
                enemy.alive=false;
                remaining--;
                newScore+=100;
            }
        }

        if(!shot.used && boss.alive && collision(shot,boss)){
            boss.hits++;
            shot.used=true;
            newScore+=100;
            currentHealth--;
            bossHealth.innerText=Math.floor((currentHealth)/50*100) + "%";
            if(boss.hits>=50){
                console.log(boss.hits);
                newScore+=1000;
                boss.alive=false;
                gameOver=true;
                bossTheme.pause();
                victoryTheme.play();
                gameHeader.innerText="You win";
                updateScores(newScore);
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
                y: tile*2, 
                width:enemyWidth,
                height:enemyHeight,
                alive: true
            }
            enemyArray.push(enemy);
        
    }
    remaining=enemyArray.length;
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
        playerShotSFX.play();
    }
}

function collision(obj1,obj2){
    return obj1.x<obj2.x +obj2.width &&//bullet's top left corner has not reached the alien's top right corner
           obj1.x+obj1.width>obj2.x && //bullet's top right corner surpasses alien's top left corner
           obj1.y<obj2.y+obj2.height &&//bullet's top left corner has not reached alien's bottom left corner
           obj1.y+obj1.height>obj2.y; //bullet's bottom left corner has not passed alien's top left corner
}


function bossShot(){
    if(gameOver){  //The player will not be able to shoot at game over
        return;
    }
    bossShootDecision=Math.floor(Math.random()*2);
    console.log(bossShootDecision);
    if (bossShootDecision=1){
        bossShoots = {
            x: boss.x + bossWidth*15/32,
            y: boss.y,
            width:tile/8,
            height:tile,
        }
        return bossShootDecision;
    } else {
        return 0;
    }
    
}

function loadTopScores(){
    let users=[];
    if(localStorage.getItem("users") !=null){ //If there are already existing users
      users = JSON.parse(localStorage.getItem("users")); //Getting all the user data and storing it in the array
      var leaderboard = document.getElementById('topTen');
      let bossUsers=sortByBoss(users);
      for(i=0;i<bossUsers.length;i++){
         let entry = document.createElement('li');
         entry.appendChild(document.createTextNode(bossUsers[i].userName + " " + bossUsers[i].bossTopScore + " pts"));
         leaderboard.appendChild(entry);
      }
    }
}

function updateScores(newScore){
    if(newScore>parseInt(bossTopScore)){
        bossTopScore=newScore;
        localStorage.setItem('bossTopScore',bossTopScore);
        let users=[];
        if(localStorage.getItem("users") !=null){ //If there are already existing users
            users = JSON.parse(localStorage.getItem("users")); //Getting all the user data and storing it in the array
        }
        let userIndex=users.findIndex(x => x.userName === currentUser);
        users[userIndex].bossTopScore=newScore;
        localStorage.setItem("users", JSON.stringify(users)); //Using stringify as localStorage accepts only strings to store the array of users
    }
}

function sortByBoss(array){
    let users=array;
    let Swapped;

    for (let i = 0; i < users.length; i++) {
        Swapped = false;

        for (let j = 0; j < users.length - i - 1; j++) {
            if (users[j].bossTopScore <  users[j + 1].bossTopScore) {
                [users[j], users[j + 1]] = [users[j + 1], users[j]];
                Swapped = true;
            }
        }
        if (!Swapped) 
            break;
    }

    return users;
}