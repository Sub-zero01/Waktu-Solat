// countdown.js - Handles Task 4: Time Calculation Math & Live Countdown Timer

let countdownTimer = null; // Global reference for interval clearing

function calculateNextPrayer(dailyTimings) {
    const countdownSection = document.getElementById('countdownSection');
    const countdownDisplay = document.getElementById('countdownDisplay');
    const nextPrayerLabel = document.getElementById('nextPrayerLabel');

    if (!countdownSection || !countdownDisplay || !nextPrayerLabel) return;

    // 1. Check if the user selected today's date
    const todayObj = new Date();
    const yyyy = todayObj.getFullYear();
    const mm = String(todayObj.getMonth() + 1).padStart(2, '0');
    const dd = String(todayObj.getDate()).padStart(2, '0');
    const todayString = `${yyyy}-${mm}-${dd}`;

    const selectedDate = document.getElementById('dateSelect').value;

    // 2. Hide countdown if viewing a past or future date (prevents negative/invalid time display)
    if (selectedDate !== todayString) {
        countdownSection.style.display = 'none';
        if (countdownTimer) {
            clearInterval(countdownTimer);
        }
        return;
    }

    // 3. Calculation function for today's live remaining time
    function updateCountdown() {
        const nowInSeconds = Math.floor(Date.now() / 1000);

        const prayers = [
            { name: "Subuh", time: dailyTimings.fajr },
            { name: "Zohor", time: dailyTimings.dhuhr },
            { name: "Asar", time: dailyTimings.asr },
            { name: "Maghrib", time: dailyTimings.maghrib },
            { name: "Isyak", time: dailyTimings.isha }
        ];

        let nextPrayer = null;

        for (let i = 0; i < prayers.length; i++) {
            if (prayers[i].time > nowInSeconds) {
                nextPrayer = prayers[i];
                break; 
            }
        }

        let totalSecondsLeft = 0;
        let prayerName = "";

        if (nextPrayer) {
            totalSecondsLeft = nextPrayer.time - nowInSeconds;
            prayerName = nextPrayer.name;
        } else {
            // Count down to Subuh tomorrow (24 hours = 86400 seconds)
            const tomorrowSubuhTime = dailyTimings.fajr + 86400; 
            totalSecondsLeft = tomorrowSubuhTime - nowInSeconds;
            prayerName = "Subuh (Tomorrow)";
        }

        if (totalSecondsLeft < 0) totalSecondsLeft = 0;

        // Math conversions for Hours and Minutes (Task 4 Math)
        let hoursLeft = Math.floor(totalSecondsLeft / 3600);
        let minutesLeft = Math.round((totalSecondsLeft % 3600) / 60);

        if (minutesLeft === 60) {
            hoursLeft += 1;
            minutesLeft = 0;
        }

        // Format leading zeros cleanly
        let formattedHours = hoursLeft < 10 ? "0" + hoursLeft : hoursLeft;
        let formattedMinutes = minutesLeft < 10 ? "0" + minutesLeft : minutesLeft;

        // Display results
        countdownDisplay.textContent = formattedHours + "h " + formattedMinutes + "m";
        nextPrayerLabel.textContent = "Until " + prayerName;

        countdownSection.style.display = 'block';
    }

    // Execute immediately
    updateCountdown();

    // Reset previous timer to prevent overlapping loops
    if (countdownTimer) {
        clearInterval(countdownTimer);
    }

    // Live update every 10 seconds
    countdownTimer = setInterval(updateCountdown, 10000);
}