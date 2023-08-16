const apiUrl = "http://localhost:3000/";


// Function to get the property ID from the query string
function getPropertyIdFromQueryString() {
    
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('propertyId');
}

// Function to fetch property details by ID
async function fetchPropertyDetails(propertyId) {
    const response = await fetch(apiUrl+'getfilteredproperties', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            stateId: null,
            cityId: null,
            price: null,
            propertyTypeId: null,
            propertyId: propertyId,
            ownerId : null
        })
    });
    const properties = await response.json();
    properties?.forEach((property) => {
        document.getElementById('propertyName').textContent = property.PropertyName;
        document.getElementById('description').textContent = property.Description;
        document.getElementById('propertyTypeName').textContent = property.PropertyTypeName;
        document.getElementById('fullAddress').textContent = property.FullAddress;
        document.getElementById('price').textContent = property.Price;
        
        const propertyHtml = `${property.ImagePaths.split(';').map((imagePath, index) => `
                             <div class="carousel-item ${index === 0 ? 'active' : ''}">
                                 <img src="JavaScript/uploads/${imagePath}" class="d-block w-100" style="max-height: 300px;" alt="Property Image">
                             </div>
                          `).join('')};` 

       const propertyDetailsContainer = document.getElementById('imageCorosole');
       propertyDetailsContainer.innerHTML = ''; // Clear previous content
       propertyDetailsContainer.innerHTML = propertyHtml;
       });
    
}

// Function to display property details on the page
async function displayPropertyDetails() {
    console.log("started fetchiing query");
    const propertyId = getPropertyIdFromQueryString();
    if (propertyId) {
        // Fetch property details
          await fetchPropertyDetails(propertyId);        
    }
}

async function bookAppointment() {
    const propertyId = getPropertyIdFromQueryString();
    if (propertyId) {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            window.location.href = 'Login.html';
        }
        else {
            let customerId = userId;
            await SaveAppointment(propertyId,customerId);      
        }              
    }
}

async function SaveAppointment(propertyId,customerId) {
     
    try {
      const response = await fetch(apiUrl+'bookAppointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({            
            PropertyId: propertyId,
            CustomerId: customerId
        })
      });
  
      const result = await response.json();
        console.log(result);
        if (result.error) {
            alert(result.error);
        }
        else {
            alert('Your appointment has been booked successfully!');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Your appointment has not been booked. Please try again!')
    }
  }
  

displayPropertyDetails();