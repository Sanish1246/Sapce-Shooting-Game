import { player, playerShot, boss, bossAlien, bossBullet} from "./gameAssets.js";

export class bossGame{
    constructor() {
        this.tile = 32;
        this.row = 16;
        this.col = 16;

        this.map; //Defining the canvas size
        this.mapWidth = this.tile * this.col;
        this.mapHeight = this.tile * this.row;
        this.context; //Context is used to draw on the canvas

        this.enemyArray = []; //Array to store the asteroid objects
        this.enemyVelY=1;
        this.enemyRow=2;
        this.enemyCol=3;
        this.spawnPosition;

        this.shotArray = []; //Array to store the shot objects
        this.shootVelY = -10;
        this.shotImg = new Image();
        this.shotImg.src = "../images/shot.png";

        this.bossBulletVelY=10;
        this.bossVelX=1;
        this.bossShotImg=new Image()
        this.bossShotImg.src="../images/bossShot.png";

        this.gameOver = false; //Setting up the game over flag
        this.playerScore = document.getElementById("playerScore"); //Getting the html element to be updated
        this.newScore = 0;
        this.gameHeader = document.getElementById("gameHeader");
        this.bossHealth=document.getElementById("bossHealth");
        this.currentHealth=50;

        this.playerShotSFX = new Audio("../audio/playerShot.mp3"); //Preparing the audio elements
        this.bossShotSFX = new Audio("../audio/bossShot.mp3");
        this.gameOverTheme = new Audio("../audio/gameOverTheme.mp3");
        this.defeatEnemySFX = new Audio("../audio/defeatEnemy.mp3");
        this.victoryTheme = new Audio("../audio/victory.mp3");
        this.challengeUnlocked = new Audio("../audio/challengeUnlocked.mp3")
        this.bossTheme=document.getElementById("bossTheme");

        this.bossTopScore = localStorage.getItem('bossTopScore'); //Loading the needed data from local storage
        this.currentUser = localStorage.getItem('currentUser');
        this.bossDefeated=localStorage.getItem('bossDefeated');

        this.player=new player(this.tile,this.row,this.col); //Instantiatng the player object
        this.boss=new boss(this.tile,this.col); //Instantiatng the boss object

        this.init();
    }

    init() { //When the object is instantiated
        window.onload = () => {
            this.map = document.getElementById("map"); //Creating the game map
            this.map.width = this.mapWidth;
            this.map.height = this.mapHeight;
            this.context = this.map.getContext("2d");

            this.playerImg = new Image();
            this.playerImg.src = "../images/ship.png";
            this.playerImg.onload = () => {
                this.context.drawImage(this.playerImg, this.player.x, this.player.y, this.player.width, this.player.height);
            }

            setInterval(() => {this.createEnemy()},1250); //Creating the enemies every 1.25 seconds
            this.loadTopScores();

            requestAnimationFrame(() => this.update());
            document.addEventListener("keydown", (e) => this.move(e)); //Event listeners for key presses
            document.addEventListener("keyup", (e) => this.shoot(e));
        }

        setInterval(() => {this.bossShot()},750); //The boss will decide whether to shoot or not every 0.75 seconds
    }


  update(){ //Function to update the player and enemy position
    if(this.gameOver){
        return;
    }
    requestAnimationFrame(() => this.update());
    this.context.clearRect(0,0,this.map.width,this.map.height); //Erases the previous position of the player
    this.context.drawImage(this.playerImg,this.player.x,this.player.y,this.player.width,this.player.height); //Draws the new position

    this.moveEnemy();
    this.moveBoss(); //Moving the boss
    this.drawShot();
    this.playerScore.innerText=this.newScore;  //Updating the score on the screen
        
  }

 move(e) { //Function to move the player when pressing a key
    if (this.gameOver) return;
    if (e.code === "ArrowRight" && this.player.x + this.tile + this.player.width <= this.map.width) { //Checks for key press and out of bounds move
        this.player.x += this.player.playerVelX;
    } else if (e.code === "ArrowLeft" && this.player.x - this.tile >= 0) {
        this.player.x -= this.player.playerVelX;
    } else if (e.code === "ArrowUp" && this.player.y - this.tile >= 0) {
        this.player.y -= this.tile;
    } else if (e.code === "ArrowDown" && this.player.y + this.tile + this.player.height <= this.map.height) {
        this.player.y += this.tile;
    }
}

shoot(e){ //Function to shoot a bullet
    if(this.gameOver){  //The player will not be able to shoot at game over
        return;
    }
    if (e.code=="Space"){
        let bullet = new playerShot(this.tile,this.player.x,this.player.y,this.player.width);
        this.shotArray.push(bullet);
        this.playerShotSFX.play();
        this.playerShotSFX.currentTime = 0; //Brings back the sound effect back at the beginning
    }
 }

moveBoss(){  //Function to move the boss
    if(this.boss.alive){
        this.context.drawImage(this.boss.bossImg,this.boss.x,this.boss.y,this.boss.width,this.boss.height);
        this.boss.x+=this.bossVelX;

        if (this.boss.x+this.boss.width >=this.map.width||this.boss.x<=0){
            this.bossVelX*=-1; //Inverting the movement direction on collision with the edge of the map
            this.context.drawImage(this.boss.bossImg,this.boss.x,this.boss.y,this.boss.width,this.boss.height);
        } 
        
        if(this.bossShoots){ //If a boss bullet has been created
            this.bossBullet=this.bossShoots;
            this.bossBullet.y+=this.bossBulletVelY;
            this.bossShotSFX.play();
            this.context.drawImage(this.bossShotImg,this.bossBullet.x,this.bossBullet.y,this.bossBullet.width,this.bossBullet.height);

            if (this.collision(this.bossBullet,this.player)){ //Checking if a shot from the boss has hit the player
                this.gameOver=true;
                this.bossTheme.pause();
                this.gameOverTheme.play();
                this.gameHeader.innerText="Game Over";
                this.updateScores(this.newScore);
            }

            if (this.bossShoots.y > this.mapHeight) {
                this.bossShoots = null;  // Removing the bullet once it exits the screen
            }
        } 
        
        if (this.collision(this.boss,this.player)){  //Checking collision between the boss and the player
            this.gameOver=true;
            this.bossTheme.pause();
            this.gameOverTheme.play();
            this.gameHeader.innerText="Game Over";
            this.updateScores(this.newScore);
        }
    }
}

createEnemy() { //creating the enemies and their positions
    let spawnPositions=[-1,-2,-3];
    for (let i=0;i<3;i++){ //Will create 3 enemies
        do{ //Generating spwan positions, ensuring that 2 enemies do not spawn in the same position
            this.spawnPosition = Math.floor(Math.random() * (this.mapWidth) );
        } while (spawnPositions.indexOf(this.spawnPosition)!=-1 ||this.spawnPosition+this.tile*2>this.mapWidth ||this.spawnPosition-this.tile<0); //Checking for out of bounds and for spawns in the same point

        spawnPositions[i]=this.spawnPosition;
        
        let enemy= new bossAlien(this.tile,spawnPositions[i]);
        this.enemyArray.push(enemy);
    }
}
 
 moveEnemy() {  //Function to move the enemies
    for(let i=0;i<this.enemyArray.length;i++){
        let enemy=this.enemyArray[i];
        if (enemy.alive) {
            enemy.y+=this.enemyVelY;  //The enemy moves vertically
            this.context.drawImage(enemy.enemyImg, enemy.x,enemy.y,enemy.width,enemy.height);

            if(this.collision(this.player,enemy)){  //Checking collision between the player and the enemy
                this.gameOver=true;
                this.bossTheme.pause();
                this.gameOverTheme.play();
                this.gameHeader.innerText="Game Over";
                this.updateScores(this.newScore);
            }
        }
    }
}


 drawShot(){ //Fucntion to draw a shot
    for(let j=0;j<this.shotArray.length;j++){
        let shot=this.shotArray[j];
        shot.y+=this.shootVelY;
        this.context.drawImage(this.shotImg,shot.x,shot.y,shot.width,shot.height);

        for(let k=0;k<this.enemyArray.length;k++){ //Detecting collision
            let enemy=this.enemyArray[k];
            if (!shot.used && enemy.alive && this.collision(shot,enemy)){  //Checking if a shot killed an enemy
                shot.used=true;
                this.defeatEnemySFX.play();
                this.defeatEnemySFX.currentTime = 0;
                enemy.alive=false;
                this.newScore+=100;
            }
        }

        if(!shot.used && this.boss.alive && this.collision(shot,this.boss)){ //Checking if a shot has hit the boss
            this.boss.hits++;
            shot.used=true;
            this.newScore+=100;
            this.context.clearRect(this.boss.x, this.boss.y, this.boss.width, this.boss.height); //Will make the boss image flicker upon getting hit
            this.currentHealth--;
            this.bossHealth.innerText=Math.floor((this.currentHealth)/50*100) + "%";
            if(this.boss.hits>=50){ //The boss will be defeated after being hit 50 times
                this.playerWin();
            }
        }
    }


    while(this.shotArray.length>0 && (this.shotArray[0].used||this.shotArray[0].y<0)){
        this.shotArray.shift();  //Clearing the bullet from the program once used
    }
 }

 bossShot(){ //function to decide whether the boss will shoot or not
    if(this.gameOver){  //The player will not be able to shoot at game over
        return;
    }
    this.willShoot=Math.floor(Math.random()*2);  //Generating a random number that is either 0 or 1
    if (this.willShoot==1){
        this.bossShoots=new bossBullet(this.tile,this.boss.x,this.boss.y)
    }
}



 collision(obj1,obj2){ //Function to check collision between 2 objects
    return obj1.x<obj2.x +obj2.width &&//bullet's top left corner has not reached the alien's top right corner
           obj1.x+obj1.width>obj2.x && //bullet's top right corner surpasses alien's top left corner
           obj1.y<obj2.y+obj2.height &&//bullet's top left corner has not reached alien's bottom left corner
           obj1.y+obj1.height>obj2.y; //bullet's bottom left corner has not passed alien's top left corner 
 }

 playerWin(){  //Function called when the player wins
    this.newScore+=1000;
    this.boss.alive=false;
    this.gameOver=true;
    this.bossTheme.pause();
    this.victoryTheme.play();
    this.gameHeader.innerText="You win";
    if(this.bossDefeated=="false"){  //If the boss is defeated for the first time
        setTimeout(()=>{this.gameHeader.innerText="Challenge mode unlocked";
            this.challengeUnlocked.play();
        },7000);
    }
    this.context.clearRect(this.boss.x, this.boss.y, this.boss.width, this.boss.height);
    this.bossDefeated=true;
    this.updateScores(this.newScore);
 }

 loadTopScores(){ //Function to load and display the top 10 scores
    let users=[];
    if(localStorage.getItem("users") !=null){ //If there are already existing users
      users = JSON.parse(localStorage.getItem("users")); //Getting all the user data and storing it in the array
      var leaderboard = document.getElementById('topTen');
      let bossUsers=this.sortByBoss(users);
      for(let i=0;i<bossUsers.length;i++){
        if(i==10){ //Will display only the top 10 scores
            break;
        }
         let entry = document.createElement('li');
         entry.appendChild(document.createTextNode(bossUsers[i].userName + " " + bossUsers[i].bossTopScore + " pts"));
         leaderboard.appendChild(entry); //Creating a list element and appending it to the list
      }
    }
 }

 updateScores(){ //Function to update the top scores of the player
    let users=[];
    if(localStorage.getItem("users") !=null){ //If there are already existing users
        users = JSON.parse(localStorage.getItem("users")); //Getting all the user data and storing it in the array
    }
    let userIndex=users.findIndex(x => x.userName === this.currentUser);
    if(this.currentUser!==null){ //If the user has not logged in
        users[userIndex].bossDefeated=this.bossDefeated;
        localStorage.setItem("bossDefeated",this.bossDefeated);
    }
    if(this.newScore>parseInt(this.bossTopScore)){
        this.bossTopScore=this.newScore;
        localStorage.setItem('bossTopScore',this.bossTopScore);
        users[userIndex].bossTopScore=this.newScore;
    }
    localStorage.setItem("users", JSON.stringify(users)); //Using stringify as localStorage accepts only strings to store the array of users
 }

 sortByBoss(array){ //Function to sort the user array by the top scores
    let users=array;
    let Swapped;

    for (let i = 0; i < users.length; i++) {
        Swapped = false;

        for (let j = 0; j < users.length - i - 1; j++) {
            if (users[j].bossTopScore <  users[j + 1].bossTopScore) {
                [users[j], users[j + 1]] = [users[j + 1], users[j]]; //Swapping
                Swapped = true;
            }
        }
        if (!Swapped) 
            break;
    }

    return users;
 }
}
