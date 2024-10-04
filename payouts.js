let payouts = [];
const payoutInterval = 165; // 165 minutes

// Fetch data from the static JSON file
async function loadPayouts() {
    try {
        const response = await fetch('data.json');
        payouts = await response.json();
        displayPayouts();  // Display the payouts after loading the data
    } catch (error) {
        console.error('Error loading payouts:', error);
    }
}

// Display the list of payouts with countdowns
function displayPayouts(filteredPayouts = payouts) {
    const list = document.getElementById('payout-list');
    list.innerHTML = '';  // Clear any previous content

    filteredPayouts.forEach(payout => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('payout-item');
        itemDiv.innerHTML = `
            <strong>${payout.name}</strong>: <span id="time-${payout.name}"></span>
        `;
        list.appendChild(itemDiv);

        updatePayoutTime(payout);  // Set initial time
    });
}

// Update the time remaining for each payout
function updatePayoutTime(payout) {
    const now = new Date();
    const lastPayout = new Date(payout.last_payout); 
    const minutesSinceLastPayout = Math.floor((now - lastPayout) / (1000 * 60));
    const timeRemaining = payoutInterval - (minutesSinceLastPayout % payoutInterval);
    
    const countdownElement = document.getElementById(`time-${payout.name}`);
    countdownElement.textContent = `${timeRemaining} minutes`;

    // Remove previous classes
    countdownElement.classList.remove('red', 'yellow', 'black');

    // Apply the appropriate class
    if (timeRemaining < 7) {
        countdownElement.classList.add('red');
    } else if (timeRemaining < 20) {
        countdownElement.classList.add('yellow');
    } else {
        countdownElement.classList.add('black');
    }
}

//function updatePayoutTimeOLD(payout) {
//    const now = new Date();
//
//    // Parse the last payout time assuming the timestamp is in ISO 8601 format and includes the timezone information
//    const lastPayout = new Date(payout.last_payout); 
//    
//    // Calculate the minutes since the last payout
//    const minutesSinceLastPayout = Math.floor((now - lastPayout) / (1000 * 60));
//    
//    // Calculate time remaining until the next payout
//    const timeRemaining = payoutInterval - (minutesSinceLastPayout % payoutInterval);
//    
//    // Update the countdown display
//    const countdownElement = document.getElementById(`time-${payout.name}`);
//    countdownElement.textContent = `${timeRemaining} minutes`;
//
//    // Apply color changes based on time remaining
//    if (timeRemaining < 7) {
//        countdownElement.style.color = 'red';
//    } else if (timeRemaining < 20) {
//        countdownElement.style.color = 'yellow';
//    } else {
//        countdownElement.style.color = 'black'; // Default color
//    }
//}

// Filter the payouts by name based on user input
function filterPayouts() {
    const query = document.getElementById('filter').value.toLowerCase();
    const filteredPayouts = payouts.filter(payout => payout.name.toLowerCase().startsWith(query));
    displayPayouts(filteredPayouts);  // Display the filtered results
}

// Recalculate the time remaining every minute
setInterval(() => {
    payouts.forEach(payout => updatePayoutTime(payout));
}, 60000);  // Update every 60 seconds

// Load payouts on page load
loadPayouts();
