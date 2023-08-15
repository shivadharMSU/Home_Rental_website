// common.js
hideLoginLink();

function hideLoginLink() {
    const userId = localStorage.getItem('userId');
    const userType = localStorage.getItem('userType');
    
    const loginLink = document.getElementById('loginLink');
    const property = document.getElementById('property');
    const appSent = document.getElementById('appSent');
    const appReceived = document.getElementById('appReceived');
    const propertyAppv = document.getElementById('propertyAppv');
    const registerLink = document.getElementById('registerLink');
    const logout = document.getElementById('logout');
    
    if (userId) {       
        logout.style.display = 'block';   

        loginLink.style.display = 'none';   
        registerLink.style.display = 'none';   
        if (userType == 'ADMIN') {
            loginLink.style.display = 'none';   
            property.style.display = 'none';
            appSent.style.display = 'none';
            appReceived.style.display = 'none';

            propertyAppv.style.display = 'block';  
            registerLink.style.display = 'block';

        }
        else if (userType == 'Home Owner') {
            loginLink.style.display = 'none';   
            registerLink.style.display = 'none';   
            appSent.style.display = 'none';
            propertyAppv.style.display = 'none';

            property.style.display = 'block';
            appReceived.style.display = 'block';
        }
        else {
            loginLink.style.display = 'none';   
            registerLink.style.display = 'none';   
            propertyAppv.style.display = 'none';
            appReceived.style.display = 'none';
            property.style.display = 'none';

            appSent.style.display = 'block';

        }
    }
    else {
        loginLink.style.display = 'block';   
        registerLink.style.display = 'block';
        
        property.style.display = 'none';
        appSent.style.display = 'none';
        appReceived.style.display = 'none';
        propertyAppv.style.display = 'none';

        logout.style.display = 'none';   
    }
  }
  
  // Add other common functions here if needed
  

function logOut() {
    localStorage.removeItem('userId'); // Replace 'key' with the actual key you want to remove
    localStorage.removeItem('userType'); // Replace 'key' with the actual key you want to remove
    hideLoginLink();
  }