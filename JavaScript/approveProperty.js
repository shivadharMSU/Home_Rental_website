const apiUrl = "http://localhost:3000/";

async function getPropertiesByAdmin() {
    try {
        const response = await fetch(apiUrl+'propertiesToApprove', {
            method: 'GET'
        });
        const properties = await response.json();
        return properties;
    } catch (error) {
        console.error('Error fetching properties:', error);
        return [];
    }   
}

async function displayProperties() {
    const appointments = await getPropertiesByAdmin();

    const tableBody = document.querySelector('#appointmentsTable tbody');
    tableBody.innerHTML = '';

    appointments?.forEach(appointment => {
        const row = tableBody.insertRow();
        row.insertCell().textContent = appointment.PropertyName;
        row.insertCell().textContent = `${appointment.FirstName} ${appointment.LastName}`;
        row.insertCell().textContent = appointment.MobileNumber;
        row.insertCell().textContent = appointment.Description;
        row.insertCell().textContent = appointment.PropertyTypeName;
        row.insertCell().textContent = appointment.Price;
        row.insertCell().textContent = new Date(appointment.AvailabilityDate).toLocaleDateString('en-US');
        row.insertCell().textContent = appointment.Amenities;
        row.insertCell().textContent = appointment.CityName;
        row.insertCell().textContent = appointment.FullAddress;

        const editCell = row.insertCell();
        const editButton = document.createElement('button');
        editButton.textContent = 'Approve';
        editButton.classList.add('btn', 'btn-primary');
        editButton.addEventListener('click', () => handleApprove(appointment.PropertyId)); // Assuming you have a function 'handleEdit' that takes PropertyId as a parameter
        editCell.appendChild(editButton);
    });
}


async function handleApprove(propertyId) {
    console.log(propertyId);
    //window.location.href = `Property-Details-Page.html?propertyId=${propertyId}`;
    const requestData = {
        PropertyId: propertyId
      };
      
      fetch(apiUrl+'approveProperty', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      })
        .then(response => response.json())
        .then(data => {
            console.log(data.message); // Display the response message
            alert("Property has been updated successfully!");
            displayProperties();
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Property has not been updated. Please try again!");
        });      
}
displayProperties();