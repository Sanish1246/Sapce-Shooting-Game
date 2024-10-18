let currentUser=localStorage.getItem('currentUser');
let bossDefeated=localStorage.getItem('bossDefeated')==='true';
let challengeCompleted=localStorage.getItem('challengeCompleted')==='true';

let welcomeMessage = document.getElementById('welcomeMessage');
let logInOut=document.getElementById('logInOut');
let heading = document.getElementById('mainTitle');
let challengeButton=document.getElementById('challengeButton');
let challengeLB=document.getElementById('challengeLB');
let isHidden = false;

if(bossDefeated==true){
    challengeLB.innerText="Challenge Mode Rankings"
}

setInterval(() => {
    isHidden = !isHidden; 
    heading.classList.toggle('hidden', isHidden); // Apply the hidden class based on the variable
}, 750); 

if (currentUser != null){
    let newWelcomeMessage = "Welcome " + currentUser + "!";
    welcomeMessage.innerText=newWelcomeMessage;
    logInOut.innerText="Log out"
}

if (bossDefeated==true && challengeButton!=null){
    challengeButton.style.color = "red";
    challengeButton.innerText="Challenge mode";
}

if (challengeCompleted==true){
    challengeButton.style.color = "green";
    challengeButton.innerText="Challenge mode 👑";
}

function checkRequirement(){
    if(bossDefeated==true && currentUser!=null){
        window.open("../HTML/challenge.html","_self");
    } else {
        window.alert("You must login and complete the boss fight to unlock this mode!");
    }
}



