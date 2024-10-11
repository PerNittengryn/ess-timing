let payouts = [];
const payoutInterval = 165; // 165 minutes

// Fetch data from the static JSON file
async function loadPayouts() {
    try {
        const response = await fetch('data.json?v=20241011T1316');
        payouts = await response.json();
        displayPayouts();  // Display the payouts after loading the data
    } catch (error) {
        console.error('Error loading payouts:', error);
    }
}

// Display the list of payouts with countdowns, sorted alphabetically
function displayPayouts(filteredPayouts = payouts) {
    const list = document.getElementById('payout-list');
    list.innerHTML = '';  // Clear any previous content

    // Sort the payouts alphabetically by name
    const sortedPayouts = filteredPayouts.sort((a, b) => a.name.localeCompare(b.name));

    // Check if there are any payouts to display
    if (sortedPayouts.length === 0) {
        list.innerHTML = `<div class="error-message"><b>Unknown system</b></br>We currently only have data on ${payouts.length} systems. If you go there, please take a screenshot showing system name, ESS timer and Eve-time, and send it to Per Nittengryn on the Brave slack. It will then be added in a future update.</div>`; // Display error message
        return;
    }

    // Loop through and display each payout
    sortedPayouts.forEach(payout => {
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

    // Parse the last payout time assuming the timestamp is in ISO 8601 format and includes the timezone information
    const lastPayout = new Date(payout.last_payout); 
    
    // Calculate the minutes since the last payout
    const minutesSinceLastPayout = Math.floor((now - lastPayout) / (1000 * 60));
    
    // Calculate time remaining until the next payout
    const timeRemaining = payoutInterval - (minutesSinceLastPayout % payoutInterval);
    
    // Update the countdown display
    const countdownElement = document.getElementById(`time-${payout.name}`);
    countdownElement.textContent = `${timeRemaining} minutes`;

    // Apply color changes based on time remaining
    if (timeRemaining < 7) {
        countdownElement.style.color = 'red';
    } else if (timeRemaining < 20) {
        countdownElement.style.color = 'yellow';
    } else {
        countdownElement.style.color = 'white'; // Default white text
    }
}

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
