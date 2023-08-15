const apiUrl = "http://localhost:3000/";

async function getPropertiesByCustomer(customerId) {
    try {
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
                propertyId: null,
                ownerId : customerId            
            })
        });
        const properties = await response.json();
        return properties;
    } catch (error) {
        console.error('Error fetching properties:', error);
        return [];
    }   
}

async function displayProperties() {
    const userId = localStorage.getItem('userId');
  if (!userId) {
    window.location.href = 'Login.html';
  }
    const customerId = userId; // Replace with the actual ownerId
    const appointments = await getPropertiesByCustomer(customerId);

    const tableBody = document.querySelector('#appointmentsTable tbody');
    tableBody.innerHTML = '';

    appointments?.forEach(appointment => {
        const row = tableBody.insertRow();
        row.insertCell().textContent = appointment.PropertyName;
        row.insertCell().textContent = appointment.Description;
        row.insertCell().textContent = appointment.PropertyTypeName;
        row.insertCell().textContent = appointment.Price;
        row.insertCell().textContent = appointment.Price;
        row.insertCell().textContent = new Date(appointment.AvailabilityDate).toLocaleDateString('en-US');
        row.insertCell().textContent = appointment.FullAddress;

        const editCell = row.insertCell();
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('btn', 'btn-primary');
        editButton.addEventListener('click', () => handleEdit(appointment.PropertyId)); // Assuming you have a function 'handleEdit' that takes PropertyId as a parameter
        editCell.appendChild(editButton);
    });
}


async function handleEdit(propertyId) {
    console.log(propertyId);
    window.location.href = `Property-Details-Page.html?propertyId=${propertyId}`;

}
displayProperties();