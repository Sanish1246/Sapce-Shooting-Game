import { player, mapAsteroid, playerShot} from "./gameAssets.js";

export class asteroidGame{
    constructor() {
        this.tile = 32; 
        this.row = 16;
        this.col = 16;

        this.map; //Defining the canvas size
        this.mapWidth = this.tile * this.col;
        this.mapHeight = this.tile * this.row;
        this.context; //Context is used to draw on the canvas

        this.asteroidArray = [];  //Array to store the asteroid objects
        this.asteroidVelY=0.75; 
        this.spawnPosition;

        this.shotArray = []; //Array to store the shot objects
        this.shootVelY = -10;
        this.shotImg = new Image(); 
        this.shotImg.src = "../images/shot.png";

        this.gameOver = false;  //Setting up the game over flag
        this.playerScore = document.getElementById("playerScore"); //Getting the html element to be updated
        this.newScore = 0;
        this.gameHeader = document.getElementById("gameHeader");

        this.playerShotSFX = new Audio("../audio/playerShot.mp3"); //Preparing the audio elements
        this.gameOverTheme = new Audio("../audio/gameOverTheme.mp3");
        this.destroyedSFX= new Audio("../audio/destroyAsteroid.mp3");
        this.mapTheme = document.getElementById("mapTheme");

        this.asteroidTopScore = localStorage.getItem('asteroidTopScore'); //Loading the needed data from local storage
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
            this.map.style.background ="url('../images/asteroid.gif')"; //Changing the background of the canvas

            this.playerImg = new Image();
            this.playerImg.src = "../images/ship.png";
            this.playerImg.onload = () => {
                this.context.drawImage(this.playerImg, this.player.x, this.player.y, this.player.width, this.player.height);
            }

            setInterval(() => {this.createAsteroid()},1250);  //Creating asteroids evey 1.25 seconds
            this.loadTopScores();

            requestAnimationFrame(() => this.update());
            document.addEventListener("keydown", (e) => this.move(e)); //Event listeners for key presses
            document.addEventListener("keyup", (e) => this.shoot(e));
        }
    }


  update(){ //Function to update the player, shot and asteroid position
    if(this.gameOver){
        return;
    }
    requestAnimationFrame(() => this.update());
    this.context.clearRect(0,0,this.map.width,this.map.height); //Erases the previous state of the map
    this.context.drawImage(this.playerImg,this.player.x,this.player.y,this.player.width,this.player.height); //Draws the new position

    this.moveAsteroid(); //Moving the asteroids
    this.drawShot(); //Drawing a shot
    this.playerScore.innerText=this.newScore;  //Updating the score on the screen
        
  }

 move(e) { //Function to move the player when pressing a key
    if (this.gameOver) return;
    if (e.code === "ArrowRight" && this.player.x + this.tile + this.player.width <= this.map.width) {  //Checks for key press and out of bounds move
        this.player.x += this.player.playerVelX;
    } else if (e.code === "ArrowLeft" && this.player.x - this.tile >= 0) {
        this.player.x -= this.player.playerVelX;
    } else if (e.code === "ArrowUp" && this.player.y - this.tile >= 0) {
        this.player.y -= this.tile;
    } else if (e.code === "ArrowDown" && this.player.y + this.tile + this.player.height <= this.map.height) {
        this.player.y += this.tile;
    }
}

createAsteroid() { //creating the asteroids and their positions
    let spawnPositions=[-1,-2,-3,-4];
    for (let i=0;i<4;i++){  //Will create 4 asteroids
        do{  //Generating spwan positions, ensuring that 2 asteroids do not spawn in the same position
            this.spawnPosition = Math.floor(Math.random() * (this.mapWidth) ); 
        } while (spawnPositions.indexOf(this.spawnPosition)!=-1 ||this.spawnPosition+this.tile*2>this.mapWidth ||this.spawnPosition-this.tile<0); //Checking for out of bounds and for spawns in the same point
        
        spawnPositions[i]=this.spawnPosition;
        
        let asteroid= new mapAsteroid(this.tile,spawnPositions[i]);
        this.asteroidArray.push(asteroid);
    }

    if (this.asteroidVelY<5){  //Increases the speed of the asteroids with each spawn until the speed is 5
        this.asteroidVelY+=0.2;
    }
}

 moveAsteroid() {  //Fucntion to move the asteroids
    for(let i=0;i<this.asteroidArray.length;i++){
        let asteroid=this.asteroidArray[i];
        if (asteroid.alive) {
            asteroid.y+=this.asteroidVelY;  //The asteroid  moves vertically
 
            this.context.drawImage(asteroid.img, asteroid.x,asteroid.y,asteroid.width,asteroid.height);

            if(this.collision(this.player,asteroid)){ //Checking for collision between asteroid and player
                this.gameOver=true;
                this.mapTheme.pause();
                this.gameOverTheme.play();
                this.gameHeader.innerText="Game Over";
                this.updateScores(this.newScore);
            }
        }
    }
}

 shoot(e){  //Function to shoot a bullet
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

 drawShot(){ //Fucntion to draw a shot
    for(let j=0;j<this.shotArray.length;j++){
        let shot=this.shotArray[j];
        shot.y+=this.shootVelY;
        this.context.drawImage(this.shotImg,shot.x,shot.y,shot.width,shot.height);

        for(let k=0;k<this.asteroidArray.length;k++){ //Detecting collision
            let asteroid=this.asteroidArray[k];
            if (!shot.used && asteroid.alive && this.collision(shot,asteroid)){  //Checking if a shot killed an enemy
                shot.used=true;
                this.destroyedSFX.play();
                this.destroyedSFX.currentTime = 0; //Brings back the sound effect back at the beginning
                asteroid.alive=false;
                this.newScore+=100;
            }
        }
    }

    while(this.shotArray.length>0 && (this.shotArray[0].used||this.shotArray[0].y<0)){
        this.shotArray.shift();  //Clearing the bullet from the program once used
    }
 }



 collision(obj1,obj2){ //Function to check collision between 2 objects
    return obj1.x<obj2.x +obj2.width &&//bullet's top left corner has not reached the alien's top right corner
           obj1.x+obj1.width>obj2.x && //bullet's top right corner surpasses alien's top left corner
           obj1.y<obj2.y+obj2.height &&//bullet's top left corner has not reached alien's bottom left corner
           obj1.y+obj1.height>obj2.y; //bullet's bottom left corner has not passed alien's top left corner
 }

 loadTopScores(){  //Function to load and display the top 10 scores
    let users=[];
    if(localStorage.getItem("users") !=null){ //If there are already existing users
      users = JSON.parse(localStorage.getItem("users")); //Getting all the user data and storing it in the array
      var leaderboard = document.getElementById('topTen');
      let asteroidUsers=this.sortByAsteroid(users);
      for(let i=0;i<asteroidUsers.length;i++){
        if(i==10){  //Will display only the top 10 scored
            break;
        }
         let entry = document.createElement('li');
         entry.appendChild(document.createTextNode(asteroidUsers[i].userName + " " + asteroidUsers[i].asteroidTopScore + " pts"));
         leaderboard.appendChild(entry); //Creating a list element and appending it to the list
      }
    }
 }

 updateScores(){  //Function to update the top scores of the player
    if(this.newScore>parseInt(this.asteroidTopScore)){
        this.asteroidTopScore=this.newScore;
        localStorage.setItem('TopScore',this.asteroidTopScore);
        let users=[];
        if(localStorage.getItem("users") !=null){ //If there are already existing users
            users = JSON.parse(localStorage.getItem("users")); //Getting all the user data and storing it in the array
        }
        let userIndex=users.findIndex(x => x.userName === this.currentUser);
        users[userIndex].asteroidTopScore=this.newScore;
        localStorage.setItem("users", JSON.stringify(users)); //Using stringify as localStorage accepts only strings to store the array of users

    }
 }

 sortByAsteroid(array){ //Function to sort the user array by the top scores
    let users=array;
    let Swapped;

    for (let i = 0; i < users.length; i++) {
        Swapped = false;
        for (let j = 0; j < users.length - i - 1; j++) {
            if (users[j].asteroidTopScore <  users[j + 1].asteroidTopScore) {
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


