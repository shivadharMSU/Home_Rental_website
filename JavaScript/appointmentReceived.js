const apiUrl = "http://localhost:3000/";

async function getAppointmentsByOwner(ownerId) {
    try {
        const response = await fetch(apiUrl+`appointmentsByOwner/${ownerId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching appointments:', error);
        return [];
    }
}

async function displayAppointments() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        window.location.href = 'Login.html';
    }
    const ownerId = userId; // Replace with the actual ownerId
    const appointments = await getAppointmentsByOwner(ownerId);

    const tableBody = document.querySelector('#appointmentsTable tbody');
    tableBody.innerHTML = '';

    appointments?.forEach(appointment => {
        const row = tableBody.insertRow();
        row.insertCell().textContent = appointment.PropertyName;
        row.insertCell().textContent = appointment.FirstName;
        row.insertCell().textContent = appointment.LastName;
        row.insertCell().textContent = appointment.MiddleName;
        row.insertCell().textContent = appointment.MobileNumber;
    });
}

displayAppointments();