
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('dateSelect');
    if (dateInput && !dateInput.value) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateInput.value = `${yyyy}-${mm}-${dd}`;
    }

    let fetchBtn = document.getElementById('fetchTimesBtn');
    if (fetchBtn) {
        fetchBtn.addEventListener('click', fetchPrayerTimes);
    }
});

// Helper function to format timestamp into readable 12-hour time
function formatTime(timestamp) {
    if (!timestamp) return "--:--";
    let date = new Date(timestamp * 1000);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; 
    minutes = minutes < 10 ? '0' + minutes : minutes;
    
    return hours + ':' + minutes + ' ' + ampm;
}

async function fetchPrayerTimes() {
    const errorMessage = document.getElementById('errorMessage');
    const prayerTableBody = document.getElementById('prayerTableBody');
    const prayerListSection = document.getElementById('prayerListSection');
    
    errorMessage.style.display = 'none';
    prayerTableBody.innerHTML = '';

    try {
        const zone = document.getElementById('zoneSelect').value || 'PHG02'; 
        const selectedDate = document.getElementById('dateSelect').value; 
        
        if (!selectedDate) {
            throw new Error("Please select a date from the calendar first.");
        }

        const dateParts = selectedDate.split('-');
        const year = dateParts[0];
        const month = dateParts[1]; 
        const dayToFind = parseInt(dateParts[2], 10); 

        const response = await fetch(`https://api.waktusolat.app/v2/solat/${zone}?year=${year}&month=${month}`);
        
        if (!response.ok) {
            throw new Error("Failed to connect to the Waktu Solat API.");
        }

        const data = await response.json();
        const prayersList = data.prayers || data;
        
        if (!prayersList || !Array.isArray(prayersList) || prayersList.length === 0) {
            throw new Error("No prayer time results found for this month.");
        }

        let dailyTimings = null;
        for (let i = 0; i < prayersList.length; i++) {
            if (prayersList[i].day === dayToFind) {
                dailyTimings = prayersList[i];
                break; 
            }
        }

        if (!dailyTimings) {
            throw new Error("Could not find prayer times for that specific day.");
        }

        // Convert timestamps to human-readable times using formatTime()
        prayerTableBody.innerHTML = `
            <tr>
                <td><strong>Subuh</strong></td>
                <td>${formatTime(dailyTimings.fajr)}</td>
            </tr>
            <tr>
                <td><strong>Zohor</strong></td>
                <td>${formatTime(dailyTimings.dhuhr)}</td>
            </tr>
            <tr>
                <td><strong>Asar</strong></td>
                <td>${formatTime(dailyTimings.asr)}</td>
            </tr>
            <tr>
                <td><strong>Maghrib</strong></td>
                <td>${formatTime(dailyTimings.maghrib)}</td>
            </tr>
            <tr>
                <td><strong>Isyak</strong></td>
                <td>${formatTime(dailyTimings.isha)}</td>
            </tr>
        `;

        prayerListSection.style.display = 'block';

        calculateNextPrayer(dailyTimings);
        generateSuggestion(dailyTimings);

    } catch (error) {
        errorMessage.style.display = 'block';
        errorMessage.textContent = `Error: ${error.message}`;
    }
}