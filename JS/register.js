function registerUser(event){
    
    let newUserName=document.getElementById("username");
    let newPassword=document.getElementById("password");

    let users=[];
    if(localStorage.getItem("users") !=null){ //If there are already existing users
        users = JSON.parse(localStorage.getItem("users")); //Getting all the user data and storing it in the array
    }
    
    if(users.find(o => o.userName === newUserName.value)){ //Checking if the username already exists
        alert("Username already taken!");
    }else if(newPassword.value.length<8){
        alert("Password too short!");
    }else if(checkUpper()==false) {
        alert("Password must contain at least 1 upper case character!");
    } else if(checkLower()==false) {
        alert("Password must contain at least 1 lower case character!");
    } else if(checkNumber()==false) {
        alert("Password must contain at least 1 number!");
    }else {
        const user={
            userName: newUserName.value,
            password: newPassword.value,
            classicTopScore:0,
            asteroidTopScore:0,
            bossTopScore:0,
            bossDefeated:false,
            challengeCompleted:false
        }
    
        users.push(user);
        localStorage.setItem("users", JSON.stringify(users)); //Using stringify as localStorage accepts only strings to store the array of users
    
        localStorage.setItem('currentUser', newUserName.value); //Storing all the user data in the local storage
        localStorage.setItem('password', newPassword.value);
        localStorage.setItem('classicTopScore', user.classicTopScore);
        localStorage.setItem('asteroidTopScore', user.asteroidTopScore);
        localStorage.setItem('bossTopScore', user.bossTopScore);
        localStorage.setItem('bossDefeated', user.bossDefeated);
        localStorage.setItem('challengeCompleted', user.challengeCompleted);
        event.preventDefault(); //Prevents the form from reloading the page
        window.open("../HTML/index.html","_self");
    }
}

function checkUpper(){
    console.log(password.value)
    return password.value !== password.value.toLowerCase();
}

function checkLower(){
    return password.value !== password.value.toUpperCase();
}

function checkNumber() {
    return /\d/.test(password.value);
  }