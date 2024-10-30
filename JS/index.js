let currentUser=localStorage.getItem('currentUser');
let bossDefeated=localStorage.getItem('bossDefeated')==='true';
let challengeCompleted=localStorage.getItem('challengeCompleted')==='true';

let welcomeMessage = document.getElementById('welcomeMessage');
let logInOut=document.getElementById('logInOut');
let heading = document.getElementById('mainTitle');
let challengeButton=document.getElementById('challengeButton');
let challengeLB=document.getElementById('challengeLB');
let challengeHeader=document.getElementById('challengeHeader');
let challengeText=document.getElementById('challengeText');
let isHidden = false;

if(bossDefeated==true && currentUser!=null){ //Checking if the boss fight has been completed
    challengeLB.innerText="Challenge Mode Rankings";
    challengeButton.style.color = "red";
    challengeButton.innerText="Challenge mode";
}

setInterval(() => { //To make the header fade in and out
    isHidden = !isHidden; 
    heading.classList.toggle('hidden', isHidden); // Apply the hidden class every 0.75 seconds
}, 750); 

if (currentUser != null){
    let newWelcomeMessage = "Welcome " + currentUser + "!";
    welcomeMessage.innerText=newWelcomeMessage;
    logInOut.innerText="Log out";
}

function logOut(){
    if (currentUser!=null){
        localStorage.removeItem('currentUser'); //Removing all the user data in the local storage
        localStorage.removeItem('password');
        localStorage.removeItem('classicTopScore');
        localStorage.removeItem('asteroidTopScore');
        localStorage.removeItem('bossTopScore');
        localStorage.removeItem('challengeTopScore');
        localStorage.removeItem('bossDefeated');
        localStorage.removeItem('challengeCompleted');
        localStorage.removeItem('TopScore');
        alert("User logged out successfully");
        window.open("../index.html","_self");
    } else {
        window.open("../HTML/login.html","_self");
    }
}

if (challengeCompleted==true){ //Checking if challenge mode has been completed
    challengeButton.style.color = "green";
    challengeButton.innerText="Challenge mode 👑";
    document.body.style.backgroundImage = "url('../images/bossBackground1.gif')";
}

function checkRequirement(){ //Function to check whether the user can play challenge mode
    if(bossDefeated==true && currentUser!=null){
        window.open("../HTML/challenge.html","_self");
    } else {
        window.alert("You must login and complete the boss fight to unlock this mode!");
    }
}



