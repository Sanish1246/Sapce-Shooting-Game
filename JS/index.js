let currentUser=localStorage.getItem('currentUser');
let welcomeMessage = document.getElementById('welcomeMessage');
let logInOut=document.getElementById('logInOut');
let Heading = document.getElementById('mainTitle');
let isHidden = false;

if (currentUser != null){
    let newWelcomeMessage = "Welcome " + currentUser + "!";
    welcomeMessage.innerText=newWelcomeMessage;
    logInOut.innerText="Log out"
}

setInterval(() => {
    isHidden = !isHidden; 
    Heading.classList.toggle('hidden', isHidden); // Apply the hidden class based on the variable
}, 750); 
