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
    isHidden = !isHidden; // Toggle the isHidden variable
    Heading.classList.toggle('hidden', isHidden); // Apply the hidden class based on the variable
}, 750); // Change every 2 seconds (2000 milliseconds)
