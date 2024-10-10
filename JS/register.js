function registerUser(){
    
    let newUserName=document.getElementById("username");
    let newPassword=document.getElementById("password");

    let users=[];
    if(localStorage.getItem("users") !=null){ //If there are already existing users
        users = JSON.parse(localStorage.getItem("users")); //Getting all the user data and storing it in the array
    }
    
    if(users.find(o => o.userName === newUserName.value)){ //Checking if the username already exists
        alert("Username already taken!")
    } else {
        const user={
            userName: newUserName.value,
            password: newPassword.value,
            classicTopScore:0,
            asteroidTopScore:0,
            bossTopScore:0
        }
    
        users.push(user);
        localStorage.setItem("users", JSON.stringify(users)); //Using stringify as localStorage accepts only strings to store the array of users
    
        localStorage.setItem('currentUser', newUserName.value); //Storing all the user data in the local storage
        localStorage.setItem('password', newPassword.value);
        localStorage.setItem('classicTopScore', user.classicTopScore);
        localStorage.setItem('asteroidTopScore', user.asteroidTopScore);
        localStorage.setItem('bossTopScore', user.bossTopScore);
        event.preventDefault(); //Prevents the form from reloading the page
        window.open("../HTML/index.html","_self");
    }
}