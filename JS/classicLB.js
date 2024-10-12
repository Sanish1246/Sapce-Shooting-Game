let users=[];
if(localStorage.getItem("users") !=null){ //If there are already existing users
    users = JSON.parse(localStorage.getItem("users")); //Getting all the user data and storing it in the array
    var leaderboard = document.getElementById('leaderboard');
    let classicUsers=sortByClassic(users);
    console.log(classicUsers);
    for(i=0;i<classicUsers.length;i++){
        let entry = document.createElement('li');
        entry.appendChild(document.createTextNode(classicUsers[i].userName + " " + classicUsers[i].classicTopScore + " pts"));
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