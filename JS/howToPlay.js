let currentUser=localStorage.getItem('currentUser');
let bossDefeated=localStorage.getItem('bossDefeated')==='true'; 

let welcomeMessage = document.getElementById('welcomeMessage');
let logInOut=document.getElementById('logInOut');
let heading = document.getElementById('mainTitle');
let challengeHeader=document.getElementById('challengeHeader');
let challengeText=document.getElementById('challengeText'); 
let challengeLB=document.getElementById('challengeLB');
let isHidden = false;

if(bossDefeated==true){ //Checking if the boss fight has been completed
    challengeHeader.innerText="Challenge Mode";
    challengeText.innerText="A combination of all the previous modes! Defeat the boss in order to win"
    challengeLB.innerText="Challenge Mode Rankings";
}

setInterval(() => { //To make the header fade in and out
    isHidden = !isHidden; 
    heading.classList.toggle('hidden', isHidden); // Apply the hidden class 
}, 750); 

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
        alert("User logged out successfully");
    } else {
        window.open("../HTML/login.html","_self");
    }
}

if (currentUser != null){
    let newWelcomeMessage = "Welcome " + currentUser + "!";
    welcomeMessage.innerText=newWelcomeMessage;
    logInOut.innerText="Log out";
}

