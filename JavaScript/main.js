const apiUrl = "http://localhost:3000/";

// Function to populate the state dropdown
async function populateStateDropdown() {
    console.log("inside state chnage");
    const stateDropdown = document.getElementById('stateDropdown');
    stateDropdown.innerHTML = '';
       
    // Add the default "Select" option
    const defaultOption = document.createElement('option');
    defaultOption.value = ''; // Empty value
    defaultOption.textContent = 'Select State';
    stateDropdown.appendChild(defaultOption);

    // Fetch states from an API or a database endpoint
    const response = await fetch(apiUrl+'getstatedetails'); // Replace with actual endpoint
    const states = await response.json();

    states.forEach(state => {
        const option = document.createElement('option');
        option.value = state.stateId;
        option.textContent = state.stateName;
        stateDropdown.appendChild(option);
    });

    // Add event listener to the state dropdown
    stateDropdown.addEventListener('change', onStateChange);
}

// Function to populate the city dropdown based on selected state
async function populateCityDropdown(stateId) {
    const cityDropdown = document.getElementById('cityDropdown');
    cityDropdown.innerHTML = '';

      // Add the default "Select" option
      const defaultOption = document.createElement('option');
      defaultOption.value = ''; // Empty value
      defaultOption.textContent = 'Select City';
      cityDropdown.appendChild(defaultOption);
    
    if (stateId > 0)
    {
        // Fetch cities based on stateId from an API or a database endpoint
        const response = await fetch(apiUrl+`getcitiesbystateid/${stateId}`); // Replace with actual endpoint
        const cities = await response.json();

        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city.CityId;
            option.textContent = city.CityName;
            cityDropdown.appendChild(option);
        });
    }  

}

// Event handler for state change
function onStateChange() {
    const selectedStateId = document.getElementById('stateDropdown').value;
    populateCityDropdown(selectedStateId);
}

// Function to populate the propertyType dropdown
async function populatePropertyTypeDropdown() {
    const propertyType = document.getElementById('propertyTypeId');
    propertyType.innerHTML = '';

    // Add the default "Select" option
    const defaultOption = document.createElement('option');
    defaultOption.value = ''; // Empty value
    defaultOption.textContent = 'Select Property Type';
    propertyType.appendChild(defaultOption);

    // Fetch states from an API or a database endpoint
    const response = await fetch(apiUrl+'getpropertytype'); // Replace with actual endpoint
    const propertyTypeData = await response.json();

    propertyTypeData.forEach(state => {
        const option = document.createElement('option');
        option.value = state.PropertyTypeId;
        option.textContent = state.PropertyTypeName;
        propertyType.appendChild(option);
    });
}

async function handleSearch() {
    const stateValue = document.getElementById('stateDropdown').value;
    const cityValue = document.getElementById('cityDropdown').value;
    const priceValue = document.getElementById('price').value !== '' ? parseFloat(document.getElementById('price').value) : null;
    const propertyTypeIdValue = document.getElementById('propertyTypeId').value !== '' ? document.getElementById('propertyTypeId').value : null;

    console.log('State:', stateValue);
    console.log('City:', cityValue);
    console.log('Price:', priceValue);
    console.log('Property Type:', propertyTypeIdValue);

    const response = await fetch(apiUrl+'getfilteredproperties', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            stateId: stateValue,
            cityId: cityValue,
            price: priceValue,
            propertyTypeId: propertyTypeIdValue,
            propertyId: null,
            ownerId : null            
        })
    });
    const properties = await response.json();

    // Do something with the retrieved properties
    console.log('Filtered Properties:', properties);

    const propertyDetailsContainer = document.getElementById('propertyDetailsContainer');
    propertyDetailsContainer.innerHTML = ''; // Clear previous results

    // Loop through the properties and create cards for each property
    properties?.forEach((property) => {   
        const card = document.createElement('div');
        card.classList.add('card', 'mb-3');

        const row = document.createElement('div');
        row.classList.add('row', 'no-gutters');

        const colImage = document.createElement('div');
        colImage.classList.add('col-md-4');

        const propertyImage = document.createElement('img');
        propertyImage.src = `JavaScript/uploads/${property.ImagePaths?.split(';')[0]}`;
        propertyImage.classList.add('card-img');
        // propertyImage.style.width = '250px'; // Set your desired width
        propertyImage.style.height = '200px'; // Set your desired height

        colImage.appendChild(propertyImage);
        row.appendChild(colImage);

        const colDetails = document.createElement('div');
        colDetails.classList.add('col-md-8');

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const propertyName = document.createElement('h5');
        propertyName.classList.add('card-title');
        propertyName.textContent = property.PropertyName;

        const propertyPrice = document.createElement('p');
        propertyPrice.classList.add('card-text');
        propertyPrice.innerHTML = `<strong>Price($):</strong> ${property.Price}`;

        const propertyAmenities = document.createElement('p');
        propertyAmenities.classList.add('card-text');
        propertyAmenities.innerHTML = `<strong>Amenities:</strong> ${property.Amenities}`;

        const propertyAvailability = document.createElement('p');
        propertyAvailability.classList.add('card-text');
        propertyAvailability.innerHTML = `<strong>Availability Date:</strong> ${new Date(property.AvailabilityDate).toLocaleDateString('en-US')}`;

         // Create the "Book Appointment" button
    const bookAppointmentButton = document.createElement('button');
    bookAppointmentButton.textContent = 'Book Appointment';
    bookAppointmentButton.classList.add('btn', 'btn-primary', 'mt-2');
    console.log("call book")
    bookAppointmentButton.addEventListener('click', () => {
        // Call the bookAppointment function and pass the property ID
        bookAppointment(property.PropertyId);
    });
        cardBody.appendChild(propertyName);
        cardBody.appendChild(propertyPrice);
        cardBody.appendChild(propertyAmenities);
        cardBody.appendChild(propertyAvailability);
        cardBody.appendChild(bookAppointmentButton);

        colDetails.appendChild(cardBody);
        row.appendChild(colDetails);

        card.appendChild(row);
        propertyDetailsContainer.appendChild(card);
    });
}

function bookAppointment(propertyId) {
    console.log('yes property id' + propertyId);
    window.location.href = `View-Property-Details.html?propertyId=${propertyId}`;

}
// Initialize the page
populateStateDropdown();
populatePropertyTypeDropdown();
populateCityDropdown(0);