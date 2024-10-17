import { player, Asteroid, playerShot} from "./gameAssets.js";

export class asteroidGame{
    constructor() {
        this.tile = 32;
        this.row = 16;
        this.col = 16;

        this.map;
        this.mapWidth = this.tile * this.col;
        this.mapHeight = this.tile * this.row;
        this.context;

        this.asteroidArray = [];
        this.asteroidVelY=0.75;
        this.spawnPosition;

        this.shotArray = [];
        this.shootVelY = -10;
        this.shotImg = new Image();
        this.shotImg.src = "../images/shot.png";

        this.gameOver = false;
        this.playerScore = document.getElementById("playerScore"); //Getting the html element to be updated
        this.newScore = 0;
        this.gameHeader = document.getElementById("gameHeader");

        this.playerShotSFX = new Audio("../audio/playerShot.mp3");
        this.gameOverTheme = new Audio("../audio/gameOverTheme.mp3");
        this.destroyedSFX= new Audio("../audio/destroyAsteroid.mp3");

        this.mapTheme = document.getElementById("mapTheme");
        this.asteroidTopScore = localStorage.getItem('asteroidTopScore');
        this.currentUser = localStorage.getItem('currentUser');

        this.player=new player(this.tile,this.row,this.col);

        this.init();
    }

    init() {
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

            setInterval(() => {this.createAsteroid()},1250);
            this.loadTopScores();

            requestAnimationFrame(() => this.update());
            document.addEventListener("keydown", (e) => this.move(e));
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

    this.moveAsteroid();
    this.drawShot();
    this.playerScore.innerText=this.newScore;  //Updating the score on the screen
        
  }

 move(e) {
    if (this.gameOver) return;
    if (e.code === "ArrowRight" && this.player.x + this.tile + this.player.width <= this.map.width) {
        this.player.x += this.player.playerVelX;
    } else if (e.code === "ArrowLeft" && this.player.x - this.tile >= 0) {
        this.player.x -= this.player.playerVelX;
    } else if (e.code === "ArrowUp" && this.player.y - this.tile >= 0) {
        this.player.y -= this.tile;
    } else if (e.code === "ArrowDown" && this.player.y + this.tile + this.player.height <= this.map.height) {
        this.player.y += this.tile;
    }
}

createAsteroid() { //creating the enemies and their positions
    let spawnPositions=[-1,-2,-3,-4];
    for (let i=0;i<4;i++){
        do{
            this.spawnPosition = Math.floor(Math.random() * (this.mapWidth) );
        } while (spawnPositions.indexOf(this.spawnPosition)!=-1 ||this.spawnPosition+this.tile*2>this.mapWidth ||this.spawnPosition-this.tile<0); //Checking for out of bounds and for spawns in the same point

        spawnPositions[i]=this.spawnPosition;
        
        let asteroid= new Asteroid(this.tile,spawnPositions[i]);
        this.asteroidArray.push(asteroid);
    }

    if (this.asteroidVelY<5){
        this.asteroidVelY+=0.2;
    }
}

 moveAsteroid() {
    for(let i=0;i<this.asteroidArray.length;i++){
        let asteroid=this.asteroidArray[i];
        if (asteroid.alive) {
            asteroid.y+=this.asteroidVelY;  //The asteroid  moves vertically
 
            this.context.drawImage(asteroid.img, asteroid.x,asteroid.y,asteroid.width,asteroid.height);

            if(this.collision(this.player,asteroid)){
                this.gameOver=true;
                this.mapTheme.pause();
                this.gameOverTheme.play();
                this.gameHeader.innerText="Game Over";
                this.updateScores(this.newScore);
            }
        }
    }
}

 shoot(e){
    if(this.gameOver){  //The player will not be able to shoot at game over
        return;
    }
    if (e.code=="Space"){
        let bullet = new playerShot(this.tile,this.player.x,this.player.y,this.player.width);
        this.shotArray.push(bullet);
        this.playerShotSFX.play();
        this.playerShotSFX.currentTime = 0;
    }
 }

 drawShot(){
    for(let j=0;j<this.shotArray.length;j++){
        let shot=this.shotArray[j];
        shot.y+=this.shootVelY;
        this.context.drawImage(this.shotImg,shot.x,shot.y,shot.width,shot.height);

        for(let k=0;k<this.asteroidArray.length;k++){ //Detecting collision
            let asteroid=this.asteroidArray[k];
            if (!shot.used && asteroid.alive && this.collision(shot,asteroid)){  //Checking if a shot killed an enemy
                shot.used=true;
                this.destroyedSFX.play();
                this.destroyedSFX.currentTime = 0;
                asteroid.alive=false;
                this.newScore+=100;
            }
        }
    }

    while(this.shotArray.length>0 && (this.shotArray[0].used||this.shotArray[0].y<0)){
        this.shotArray.shift();  //Clearing the bullet from the program once used
    }
 }



 collision(obj1,obj2){
    return obj1.x<obj2.x +obj2.width &&//bullet's top left corner has not reached the alien's top right corner
           obj1.x+obj1.width>obj2.x && //bullet's top right corner surpasses alien's top left corner
           obj1.y<obj2.y+obj2.height &&//bullet's top left corner has not reached alien's bottom left corner
           obj1.y+obj1.height>obj2.y; //bullet's bottom left corner has not passed alien's top left corner
 }

 loadTopScores(){
    let users=[];
    if(localStorage.getItem("users") !=null){ //If there are already existing users
      users = JSON.parse(localStorage.getItem("users")); //Getting all the user data and storing it in the array
      var leaderboard = document.getElementById('topTen');
      let asteroidUsers=this.sortByAsteroid(users);
      for(let i=0;i<asteroidUsers.length;i++){
        if(i==10){
            break;
        }
         let entry = document.createElement('li');
         entry.appendChild(document.createTextNode(asteroidUsers[i].userName + " " + asteroidUsers[i].asteroidTopScore + " pts"));
         leaderboard.appendChild(entry);
      }
    }
 }

 updateScores(){
    if(this.newScore>parseInt(this.asteroidTopScore)){
        this.asteroidTopScore=this.newScore;
        localStorage.setItem('classicTopScore',this.asteroidTopScore);
        let users=[];
        if(localStorage.getItem("users") !=null){ //If there are already existing users
            users = JSON.parse(localStorage.getItem("users")); //Getting all the user data and storing it in the array
        }
        let userIndex=users.findIndex(x => x.userName === this.currentUser);
        users[userIndex].asteroidTopScore=this.newScore;
        localStorage.setItem("users", JSON.stringify(users)); //Using stringify as localStorage accepts only strings to store the array of users

    }
 }

 sortByAsteroid(array){
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
}


