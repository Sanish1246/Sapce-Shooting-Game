let currentUser=localStorage.getItem('currentUser');
let bossDefeated=localStorage.getItem('bossDefeated');
let challengeCompleted=localStorage.getItem('challengeCompleted');

let welcomeMessage = document.getElementById('welcomeMessage');
let logInOut=document.getElementById('logInOut');
let Heading = document.getElementById('mainTitle');
let challengeButton=document.getElementById('challengeButton');

console.log(bossDefeated)

let isHidden = false;

setInterval(() => {
    isHidden = !isHidden; 
    Heading.classList.toggle('hidden', isHidden); // Apply the hidden class based on the variable
}, 750); 

if (currentUser != null){
    let newWelcomeMessage = "Welcome " + currentUser + "!";
    welcomeMessage.innerText=newWelcomeMessage;
    logInOut.innerText="Log out"
}

if (bossDefeated=="true"){
    challengeButton.innerText="Challenge mode";
}

function checkRequirement(){
    if(bossDefeated=="true" && currentUser!=null){
        window.open("../HTML/challenge.html","_self");
    } else {
        window.alert("You must login and complete the boss fight to unlock this mode!");
    }
}



