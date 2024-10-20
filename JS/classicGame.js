import { player, alien, playerShot} from "./gameAssets.js";

export class classicGame{
    constructor() {
        this.tile = 32;
        this.row = 16;
        this.col = 16;

        this.map; //Defining the canvas size
        this.mapWidth = this.tile * this.col;
        this.mapHeight = this.tile * this.row;
        this.context; //Context is used to draw on the canvas

        this.enemyArray = []; //Array to store the asteroid objects
        this.enemyVelX = 1;

        this.enemyRow = 2;
        this.enemyCol = 3;
        this.remaining = 0;

        this.shotArray = []; //Array to store the shot objects
        this.shootVelY = -10;
        this.shotImg = new Image();
        this.shotImg.src = "../images/shot.png";

        this.gameOver = false; //Setting up the game over flag
        this.playerScore = document.getElementById("playerScore"); //Getting the html element to be updated
        this.newScore = 0;
        this.gameHeader = document.getElementById("gameHeader");

        this.playerShotSFX = new Audio("../audio/playerShot.mp3"); //Preparing the audio elements
        this.gameOverTheme = new Audio("../audio/gameOverTheme.mp3");
        this.defeatEnemySFX = new Audio("../audio/defeatEnemy.mp3");
        this.mapTheme = document.getElementById("mapTheme");

        this.classicTopScore = localStorage.getItem('classicTopScore'); //Loading the needed data from local storage
        this.currentUser = localStorage.getItem('currentUser');

        this.player=new player(this.tile,this.row,this.col); //Instantiatng the player object

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

            this.enemyImg = new Image();
            this.enemyImg.src = "../images/alien.png";

            this.createEnemy(); //Creating the enemies
            this.loadTopScores();

            requestAnimationFrame(() => this.update());
            document.addEventListener("keydown", (e) => this.move(e)); //Event listeners for key presses
            document.addEventListener("keyup", (e) => this.shoot(e));
        }
    }


 update(){ //Function to update the player and enemy position
    if(this.gameOver){
        return;
    }
    requestAnimationFrame(() => this.update());
    this.context.clearRect(0,0,this.map.width,this.map.height); //Erases the previous position of the player
    this.context.drawImage(this.playerImg,this.player.x,this.player.y,this.player.width,this.player.height); //Draws the new position

    this.moveEnemy(); //Moving the asteroids
    this.drawShot(); //Drawing a shot
    this.respawn();  //Respawning the enemies
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

 createEnemy() { //creating the enemies and their positions
    for (let i=0;i<this.enemyCol;i++){
        for (let j=0;j<this.enemyRow;j++) {
            let enemy=new alien(this.tile,i,j,this.enemyVelX);
            this.enemyArray.push(enemy);
        }
    }
    this.remaining=this.enemyArray.length;
 }

 moveEnemy() { //Fucntion to move the enemies
    let edgeHit = false; 

    for (let i = 0; i < this.enemyArray.length; i++) {  // First loop: Move enemies horizontally and check if an edge is hit
        let enemy = this.enemyArray[i];
        
        if (enemy.alive) {
            enemy.x += enemy.enemyVelX;  // Move enemy horizontally
            if (enemy.x + enemy.width >= this.map.width || enemy.x <= 0) { // Check if enemy hits the left or right edge of the canvas
                edgeHit = true;  
            }
            this.context.drawImage(enemy.enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);
            if (enemy.y > this.player.playerY || this.collision(this.player, enemy)) { //Checking if the enemy has reached the bottom or for collision between player and enemy
                this.gameOver = true;
                this.mapTheme.pause();
                this.gameOverTheme.play();
                this.gameHeader.innerText = "Game Over";
                this.updateScores();
            }
        }
    }

    if (edgeHit) {
        for (let i = 0; i < this.enemyArray.length; i++) {
            this.enemyArray[i].enemyVelX *= -1;  // Reverse direction for all enemies
            this.enemyArray[i].y += this.enemyArray[i].height;  // Move all enemies down by one tile
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
                this.defeatEnemySFX.currentTime = 0; //Brings back the sound effect back at the beginning
                enemy.alive=false;
                this.remaining--;
                this.newScore+=100;
            }
        }
    }

    while(this.shotArray.length>0 && (this.shotArray[0].used||this.shotArray[0].y<0)){
        this.shotArray.shift();  //Clearing the bullet from the program once used
    }
 }

 respawn(){ //Function to respawn the enemies once all have been killed
    if (this.remaining==0) {
        this.enemyCol=Math.min(this.enemyCol+1,this.col/2-2);  //Ensures a maximum of 6 columns
        this.enemyRow=Math.min(this.enemyRow+1,this.row-4) //Ensures that there are at max 12 rows
        this.enemyVelX+=0.2;
        this.enemyArray=[]; 
        this.shotArray=[]; //To ensure that a bullet already fired does not kill an enemy while they are spwaning
        this.createEnemy();
    }
 }

 collision(obj1,obj2){ //Function to check collision between 2 objects
    return obj1.x<obj2.x +obj2.width &&//bullet's top left corner has not reached the alien's top right corner
           obj1.x+obj1.width>obj2.x && //bullet's top right corner surpasses alien's top left corner
           obj1.y<obj2.y+obj2.height &&//bullet's top left corner has not reached alien's bottom left corner
           obj1.y+obj1.height>obj2.y; //bullet's bottom left corner has not passed alien's top left corner
 }

 loadTopScores(){ //Function to load and display the top 10 scores
    let users=[];
    if(localStorage.getItem("users") !=null){ //If there are already existing users
      users = JSON.parse(localStorage.getItem("users")); //Getting all the user data and storing it in the array
      var leaderboard = document.getElementById('topTen');
      let classicUsers=this.sortByClassic(users);
      for(let i=0;i<classicUsers.length;i++){
        if(i==10){  //Will display only the top 10 scores
            break;
        }
         let entry = document.createElement('li');
         entry.appendChild(document.createTextNode(classicUsers[i].userName + " " + classicUsers[i].classicTopScore + " pts"));
         leaderboard.appendChild(entry); //Creating a list element and appending it to the list
      }
    }
 }

 updateScores(){ //Function to update the top scores of the player
    if(this.newScore>parseInt(this.classicTopScore)){
        this.classicTopScore=this.newScore;
        localStorage.setItem('classicTopScore',this.classicTopScore);
        let users=[];
        if(localStorage.getItem("users") !=null){ //If there are already existing users
            users = JSON.parse(localStorage.getItem("users")); //Getting all the user data and storing it in the array
        }
        let userIndex=users.findIndex(x => x.userName === this.currentUser);
        users[userIndex].classicTopScore=this.newScore;
        localStorage.setItem("users", JSON.stringify(users)); //Using stringify as localStorage accepts only strings to store the array of users

    }
 }

 sortByClassic(array){ //Function to sort the user array by the top scores
    let users=array;
    let Swapped;

    for (let i = 0; i < users.length; i++) {
        Swapped = false;
        for (let j = 0; j < users.length - i - 1; j++) {
            if (users[j].classicTopScore <  users[j + 1].classicTopScore) {
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
