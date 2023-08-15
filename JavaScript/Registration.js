// const fetch = require('node-fetch'); // Make sure you have the 'node-fetch' package installed
// const config = require('./config'); // Adjust the path to the config.js file
// import { apiUrl } from './config';

document.addEventListener('DOMContentLoaded', function () {
    
    const registrationForm = document.getElementById('registration-form');
  
    registrationForm.addEventListener('submit', function(event) {
      event.preventDefault();
  
      const username = registrationForm.username.value;
      const firstName = registrationForm.firstName.value;
      const lastName = registrationForm.lastName.value;
      const middleName = registrationForm.middleName.value;
      const password = registrationForm.password.value;
      const confirmPassword = registrationForm.confirmPassword.value;
      const userType = registrationForm.userType.value;
      const mobileNumber = registrationForm.mobileNumber.value;
  
      if (password !== confirmPassword) {
        alert("Passwords do not match");
      } else {
       // const SaveUser = require('./app').SaveUser;

        // Simulate saving user data using placeholder API
        const isValid =saveUser(username, firstName, lastName, middleName, password, userType, mobileNumber);
        
      }
    });


    function saveUser(username, firstName, lastName, middleName, password, userType, mobileNumber) {
        fetch('http://localhost:3000/saveuser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            UserName: username,
            FirstName: firstName,
            LastName: lastName,
            MiddleName: middleName,
            Password: password,
            UserTypeId: userType,
            MobileNumber: mobileNumber
          })
        })
        .then(response => response.json())
        .then(data => {
          alert('Registration successful!');
           window.location.href = 'Login.html';
            return true;
        })
        .catch(error => {
          alert('An error occurred while. Please try again!');
            console.error(error);
            return false;
        });
      }     
  });
  