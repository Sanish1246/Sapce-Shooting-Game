function loginUser(event){ //Function to login
    
    let newUserName=document.getElementById("username");
    let newPassword=document.getElementById("password");

    let users=[];
    if(localStorage.getItem("users") !=null){ //If there are already existing users
        users = JSON.parse(localStorage.getItem("users")); //Getting all the user data and storing it in the array
    }
    
    if(users.find(o => o.userName === newUserName.value)){ //Checking if the username is found
        let userIndex=users.findIndex(x => x.userName === newUserName.value);
        if(users[userIndex].password==newPassword.value){ //if the passwords match
        
            localStorage.setItem('currentUser', newUserName.value); //Storing all the user data in the local storage
            localStorage.setItem('password', newPassword.value);
            localStorage.setItem('classicTopScore', users[userIndex].classicTopScore);
            localStorage.setItem('asteroidTopScore', users[userIndex].asteroidTopScore);
            localStorage.setItem('bossTopScore', users[userIndex].bossTopScore);
            localStorage.setItem('challengeTopScore', users[userIndex].challengeTopScore);
            localStorage.setItem('bossDefeated',users[userIndex].bossDefeated);
            localStorage.setItem('challengeCompleted',users[userIndex].challengeCompleted);


            event.preventDefault(); //Prevents the form from reloading the page
            window.open("../index.html","_self");
        } else {
         alert("Incorrect password!");
        }
    } else {
        alert("Username not found!");
    }
}