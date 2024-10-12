
let currentUser=localStorage.getItem('currentUser');
let welcomeMessage = document.getElementById('welcomeMessage');
let logInOut=document.getElementById('logInOut');
let Heading = document.getElementById('mainTitle');
let isHidden = false;
let users=[];

setInterval(() => {
    isHidden = !isHidden; // Toggle the isHidden variable
    Heading.classList.toggle('hidden', isHidden); // Apply the hidden class based on the variable
}, 750);

if (currentUser != null){
    let newWelcomeMessage = "Welcome " + currentUser + "!";
    welcomeMessage.innerText=newWelcomeMessage;
    logInOut.innerText="Log out"
}

if(localStorage.getItem("users") !=null){ //If there are already existing users
    users = JSON.parse(localStorage.getItem("users")); //Getting all the user data and storing it in the array
    var leaderboard = document.getElementById('rankings');
    let asteroidUsers=sortByAsteroid(users);
    for(i=0;i<asteroidUsers.length;i++){
        let entry = document.createElement('li');
        entry.appendChild(document.createTextNode(asteroidUsers[i].userName + " " + asteroidUsers[i].asteroidTopScore + " pts"));
        leaderboard.appendChild(entry);
    }
}

function sortByAsteroid(array){
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