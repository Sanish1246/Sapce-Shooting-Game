let currentUser=localStorage.getItem('currentUser');
let welcomeMessage = document.getElementById('welcomeMessage');
let logInOut=document.getElementById('logInOut');
let heading = document.getElementById('mainTitle');
let bossDefeated=localStorage.getItem('bossDefeated')==='true';
let isHidden = false;
let users=[];

if (bossDefeated==true){ //Checking if the boss fight has been completed
    heading.innerText="Challenge Mode Rankings";
    challengeLB.innerText="Challenge Mode Rankings";
}
setInterval(() => { //To make the header fade in and out
    isHidden = !isHidden; // Toggle the isHidden variable
    heading.classList.toggle('hidden', isHidden); // Apply the hidden class based on the variable
}, 750);
 
if (currentUser != null){
    let newWelcomeMessage = "Welcome " + currentUser + "!";
    welcomeMessage.innerText=newWelcomeMessage;
    logInOut.innerText="Log out"
}

if(localStorage.getItem("users") !=null){ //If there are already existing users
    users = JSON.parse(localStorage.getItem("users")); //Getting all the user data and storing it in the array
    var leaderboard = document.getElementById('rankings');
    let challengeUsers=sortByChallenge(users);
    let extra="👑";
    for(i=0;i<challengeUsers.length;i++){
        let entry = document.createElement('li');
        if (i!=0){ //Only the first user will have a crown
            extra="";
        }
        entry.appendChild(document.createTextNode(challengeUsers[i].userName + " " + challengeUsers[i].challengeTopScore + " pts" + extra));
        leaderboard.appendChild(entry); //Creating a list element and appending it to the list
    }
}

function sortByChallenge(array){ //Function to sort the user array by the top scores
    let users=array;
    let Swapped;

    for (let i = 0; i < users.length; i++) {
        Swapped = false;

        for (let j = 0; j < users.length - i - 1; j++) {
            if (users[j].challengeTopScore <  users[j + 1].challengeTopScore) {
                [users[j], users[j + 1]] = [users[j + 1], users[j]]; //Swapping
                Swapped = true;
            }
        }
        if (!Swapped) 
            break;
    }

    return users;
}