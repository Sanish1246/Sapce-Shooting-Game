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

let asteroidArray=[];
let asteroidWidth=tile*2;
let asteroidHeight=tile;
let asteroidX=tile;
let asteroidY=tile;
let asteroidImg;
let asteroidVelY=0.75;

let spawnPosition;
let spawnPositions=[-1,-2,-3,-4];

let shotArray=[];
let shootVelY=-10;
let shotImg=new Image();
shotImg.src="../images/shot.png";

let gameOver=false;
let playerScore=document.getElementById("playerScore");  //Getting the html element to be updated
let newScore=0;
let gameHeader=document.getElementById("gameHeader");

let playerShotSFX=new Audio("../audio/playerShot.mp3");
let gameOverTheme = new Audio("../audio/gameOverTheme.mp3");
let mapTheme=document.getElementById("mapTheme");
let asteroidTopScore=localStorage.getItem('asteroidTopScore');
let currentUser=localStorage.getItem('currentUser');

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
        context.drawImage(playerImg,player.x,player.y,player.width,player.height);  //Drawing the player on the canvas
    }

    asteroidImg=new Image();
    asteroidImg.src="../images/asteroid.png";
   
    setInterval(createAsteroid,1000);
    loadTopScores();

    requestAnimationFrame(update);
    document.addEventListener("keydown",move);
    document.addEventListener("keyup",shoot); //releases a bullet once the spacebar is released
    
}

function update(){ //Function to update the player and asteroids position
    if(gameOver){
        return;
    }
    requestAnimationFrame(update);
    context.clearRect(0,0,map.width,map.height); //Erases the previous position of the player
    context.drawImage(playerImg,player.x,player.y,player.width,player.height); //Draws the new position

    for(let i=0;i<asteroidArray.length;i++){
        let asteroid=asteroidArray[i];
        if (asteroid.alive) {
            asteroid.y+=asteroidVelY;  //The asteroid  moves vertically
 
            context.drawImage(asteroidImg, asteroid.x,asteroid.y,asteroid.width,asteroid.height);

            if(collision(player,asteroid)){
                gameOver=true;
                mapTheme.pause();
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

        for(k=0;k<asteroidArray.length;k++){ //Detecting collision
            let asteroid=asteroidArray[k];
            if (!shot.used && asteroid.alive && collision(shot,asteroid)){  //Checking if a shot destroyed an asteroid
                shot.used=true;
                newScore+=100;
                asteroid.alive=false;
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

function createAsteroid() { //creating the enemies and their positions
    for (let i=0;i<4;i++){
        do{
            spawnPosition = Math.floor(Math.random() * (mapWidth) );
        } while (spawnPositions.indexOf(spawnPosition)!=-1 ||spawnPosition+asteroidWidth>mapWidth ||spawnPosition-tile<0); //Checking for out of bounds and for spawns in the same point

        spawnPositions[i]=spawnPosition;
        
            let asteroid={    //creating each asteroid as objects one by one
                img: asteroidImg,
                x: spawnPositions[i],  
                y: 0, 
                width:asteroidWidth,
                height:asteroidHeight,
                alive: true
            }
            asteroidArray.push(asteroid);
    }

    if (asteroidVelY<5){
        asteroidVelY+=0.2;
    }
    spawnPositions=[-1,-2,-3,-4];
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
        playerShotSFX.currentTime = 0;
    }
}

function collision(obj1,obj2){
    return obj1.x<obj2.x +obj2.width &&//bullet's top left corner has not reached the alien's top right corner
           obj1.x+obj1.width>obj2.x && //bullet's top right corner surpasses alien's top left corner
           obj1.y<obj2.y+obj2.height &&//bullet's top left corner has not reached alien's bottom left corner
           obj1.y+obj1.height>obj2.y; //bullet's bottom left corner has not passed alien's top left corner
}

function loadTopScores(){
    let users=[];
    if(localStorage.getItem("users") !=null){ //If there are already existing users
      users = JSON.parse(localStorage.getItem("users")); //Getting all the user data and storing it in the array
      var leaderboard = document.getElementById('topTen');
      let asteroidUsers=sortByAsteroid(users);
      for(i=0;i<asteroidUsers.length;i++){
        if(i==10){
            break;
        }
        let entry = document.createElement('li');
        entry.appendChild(document.createTextNode(asteroidUsers[i].userName + " " + asteroidUsers[i].asteroidTopScore + " pts"));
        leaderboard.appendChild(entry);
      }
    }
}

function updateScores(newScore){
    if(newScore>parseInt(asteroidTopScore)){
        console.log(asteroidTopScore);
        asteroidTopScore=newScore;
        console.log(asteroidTopScore);
        localStorage.setItem('asteroidTopScore',asteroidTopScore);
        let users=[];
        if(localStorage.getItem("users") !=null){ //If there are already existing users
            users = JSON.parse(localStorage.getItem("users")); //Getting all the user data and storing it in the array
        let userIndex=users.findIndex(x => x.userName === currentUser);
        users[userIndex].asteroidTopScore=newScore;
        console.log(newScore)
        localStorage.setItem("users", JSON.stringify(users)); //Using stringify as localStorage accepts only strings to store the array of users
        }
    }
}

function sortByAsteroid(array){
    let users=array;
    let Swapped;

    for (let i = 0; i < users.length; i++) {
        Swapped = false;

        for (let j = 0; j < users.length - i - 1; j++) {
            if (users[j].asteroidTopScore <  users[j + 1].asteroidTopScore) {
                [users[j], users[j + 1]] = [users[j + 1], users[j]];
                Swapped = true;
            }
        }
        if (!Swapped) 
            break;
    }

    return users;
}