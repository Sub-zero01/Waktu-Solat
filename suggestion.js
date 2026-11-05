// suggestion.js - Clean & Direct Active Prayer Logic

function generateSuggestion(dailyTimings) {
    const suggestionSection = document.getElementById('suggestionSection');
    const suggestionText = document.getElementById('suggestionText');
    const guideDetails = document.getElementById('guideDetails');
    const toggleGuideBtn = document.getElementById('toggleGuideBtn');

    if (!suggestionSection || !suggestionText) return;

    // 1. Get current system time in epoch seconds
    const nowInSeconds = Math.floor(Date.now() / 1000);

    // 2. Define the 5 prayer windows
    const prayerWindows = [
        { 
            name: "Subuh", 
            time: dailyTimings.fajr, 
            nextTime: dailyTimings.dhuhr,
            defaultActivity: "Recite Morning Adhkar & Read 1 Juz of Quran",
            guide: "<strong>Steps for Morning Adhkar:</strong><ol style='margin-left: 20px; margin-top: 5px;'><li>Recite Ayatul Kursi once after Subuh prayer.</li><li>Recite Surah Al-Ikhlas, Al-Falaq, and An-Nas 3 times each.</li><li>Say <em>'Subhanallah wa Bihamdihi'</em> 100 times for daily forgiveness.</li></ol>"
        },
        { 
            name: "Zohor", 
            time: dailyTimings.dhuhr, 
            nextTime: dailyTimings.asr,
            defaultActivity: "Perform Sunnah Rawatib prayer (2 or 4 rakaat before Zohor)",
            guide: "<strong>Steps for Sunnah Rawatib (Zohor):</strong><ol style='margin-left: 20px; margin-top: 5px;'><li>Niyyah (Intention): Perform 2 rakaat Sunnah before Zohor.</li><li>Recite Surah Al-Kafirun in the 1st rakaat after Al-Fatihah.</li><li>Recite Surah Al-Ikhlas in the 2nd rakaat.</li></ol>"
        },
        { 
            name: "Asar", 
            time: dailyTimings.asr, 
            nextTime: dailyTimings.maghrib,
            defaultActivity: "Recite Evening Adhkar & Short Religious Study",
            guide: "<strong>Steps for Evening Adhkar:</strong><ol style='margin-left: 20px; margin-top: 5px;'><li>Recite Ayatul Kursi after Asar prayer.</li><li>Say <em>'Astaghfirullah hal-'Azim'</em> 100 times.</li><li>Recite Evening Supplication: <em>'Amshayna wa amsha al-mulku lillah'</em>.</li></ol>"
        },
        { 
            name: "Maghrib", 
            time: dailyTimings.maghrib, 
            nextTime: dailyTimings.isha,
            defaultActivity: "Recite Surah Al-Waqi'ah & Sunnah Ba'diyyah",
            guide: "<strong>Steps for Maghrib Routine:</strong><ol style='margin-left: 20px; margin-top: 5px;'><li>Perform 2 rakaat Sunnah Ba'diyyah immediately after Maghrib.</li><li>Open Quran or app to read Surah Al-Waqi'ah.</li><li>Make du'a for sustenance and family blessings.</li></ol>"
        },
        { 
            name: "Isyak", 
            time: dailyTimings.isha, 
            nextTime: dailyTimings.fajr + 86400, // Extends until Subuh tomorrow
            defaultActivity: "Read Surah Al-Mulk & Sunnah Ba'diyyah before sleep",
            guide: "<strong>Steps for Isyak & Night Routine:</strong><ol style='margin-left: 20px; margin-top: 5px;'><li>Perform 2 rakaat Sunnah Ba'diyyah after Isyak.</li><li>Recite Surah Al-Mulk (30 verses) for protection in the grave.</li><li>Perform Wudu before going to sleep.</li></ol>"
        }
    ];

    // 3. Find active prayer window using basic loop
    let activePrayer = prayerWindows[0]; // Default to Subuh before Fajr

    for (let i = 0; i < prayerWindows.length; i++) {
        if (nowInSeconds >= prayerWindows[i].time && nowInSeconds < prayerWindows[i].nextTime) {
            activePrayer = prayerWindows[i];
            break;
        }
    }

    // 4. Collect user tasks from Local Storage
    const selectedDate = document.getElementById('dateSelect').value;
    const saved = localStorage.getItem('solat_reminders');
    let matchedUserTasks = [];

    if (saved) {
        const remindersData = JSON.parse(saved);
        for (let i = 0; i < remindersData.length; i++) {
            if (remindersData[i].date === selectedDate) {
                const savedPrayer = remindersData[i].prayer.trim().toLowerCase();
                const targetPrayer = activePrayer.name.trim().toLowerCase();

                if (savedPrayer === targetPrayer) {
                    matchedUserTasks.push(remindersData[i].activity);
                }
            }
        }
    }

    // 5. Construct HTML display
    let outputHTML = `💡 <strong>Suggested Activity (${activePrayer.name}):</strong> ${activePrayer.defaultActivity}`;

    if (matchedUserTasks.length > 0) {
        outputHTML += `<br>📌 <strong>Personal Tasks Scheduled (${matchedUserTasks.length}):</strong>`;
        outputHTML += `<ul style="margin-top: 5px; margin-bottom: 5px; padding-left: 20px;">`;
        for (let j = 0; j < matchedUserTasks.length; j++) {
            outputHTML += `<li>"<em>${matchedUserTasks[j]}</em>"</li>`;
        }
        outputHTML += `</ul>`;
    }

    suggestionText.innerHTML = outputHTML;
    guideDetails.innerHTML = activePrayer.guide;
    suggestionSection.style.display = 'block';

    // 6. Toggle guide event listener
    if (toggleGuideBtn) {
        guideDetails.style.display = 'none';
        toggleGuideBtn.textContent = '📖 How to Perform';

        toggleGuideBtn.onclick = () => {
            if (guideDetails.style.display === 'none') {
                guideDetails.style.display = 'block';
                toggleGuideBtn.textContent = '✖ Hide Guide';
            } else {
                guideDetails.style.display = 'none';
                toggleGuideBtn.textContent = '📖 How to Perform';
            }
        };
    }
}