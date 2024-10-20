let currentUser=localStorage.getItem('currentUser');
let welcomeMessage = document.getElementById('welcomeMessage');
let logInOut=document.getElementById('logInOut');
let heading = document.getElementById('mainTitle');
let bossDefeated=localStorage.getItem('bossDefeated')==='true';
let challengeLB=document.getElementById('challengeLB');

let isHidden = false;
let users=[];

if(bossDefeated==true){
    challengeLB.innerText="Challenge Mode Rankings";
}

setInterval(() => {
    isHidden = !isHidden; // Toggle the isHidden variable
    heading.classList.toggle('hidden', isHidden); // Apply the hidden class based on the variable
}, 750); // Change every 2 seconds (2000 milliseconds)

if (currentUser != null){
    let newWelcomeMessage = "Welcome " + currentUser + "!";
    welcomeMessage.innerText=newWelcomeMessage;
    logInOut.innerText="Log out";
}


if(localStorage.getItem("users") !=null){ //If there are already existing users
    users = JSON.parse(localStorage.getItem("users")); //Getting all the user data and storing it in the array
    var leaderboard = document.getElementById('rankings');
    let classicUsers=sortByClassic(users);
    let extra="👑";
    for(i=0;i<classicUsers.length;i++){
        let entry = document.createElement('li');
        if (i!=0){
            extra="";
        }
            entry.appendChild(document.createTextNode(classicUsers[i].userName + " " + classicUsers[i].classicTopScore + " pts" + extra));
            leaderboard.appendChild(entry);
    }
}

function sortByClassic(array){
    let users=array;
    let Swapped;

    for (let i = 0; i < users.length; i++) {
        Swapped = false;

        for (let j = 0; j < users.length - i - 1; j++) {
            if (users[j].classicTopScore <  users[j + 1].classicTopScore) {
                [users[j], users[j + 1]] = [users[j + 1], users[j]];
                Swapped = true;
            }
        }
        if (!Swapped) 
            break;
    }

    return users;
}