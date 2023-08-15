const apiUrl = "http://localhost:3000/";


async function authenticateUser(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (!(username || password)) {
        alert('Please fill all the required fields(*)');
        return;
   }
    const credentials = {
        username: username,
        password:password
      };
      
      fetch(apiUrl+'authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      })
        .then(response => response.json())
        .then(data => {
          if (data.userId) {
            console.log('Authentication successful');
            console.log('User ID:', data.userId);
            console.log('Name:', data.name);
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('userType', data.userType);

              // Hide the login link in the navigation bar
            hideLoginLink();
            window.location.href = 'Main-Page.html';
          } else {
              console.log('Authentication failed:', data.error);
              alert(data.error);
          }
        })
        .catch(error => {
          console.error('An error occurred:', error);
        });
          
} 
