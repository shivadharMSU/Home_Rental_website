const apiUrl = "http://localhost:3000/";

async function getAppointmentsByCustomer(customerId) {
    try {
        const response = await fetch(apiUrl+`appointmentsByCustomer/${customerId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching appointments:', error);
        return [];
    }
}

async function displayAppointmentsSent() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        window.location.href = 'Login.html';
    }
    const customerId = userId; // Replace with the actual ownerId
    const appointments = await getAppointmentsByCustomer(customerId);

    const tableBody = document.querySelector('#appointmentsTable tbody');
    tableBody.innerHTML = '';

    appointments?.forEach(appointment => {
        const row = tableBody.insertRow();
        row.insertCell().textContent = appointment.PropertyName;
        row.insertCell().textContent = appointment.price;
        row.insertCell().textContent = appointment.Amenities;
        row.insertCell().textContent = appointment.FullAddress;
    });
}

displayAppointmentsSent();