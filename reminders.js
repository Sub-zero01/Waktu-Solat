// Local Storage Key Constant
const STORAGE_KEY = 'solat_reminders';

document.addEventListener('DOMContentLoaded', () => {
    // Set default date picker to today
    const taskDate = document.getElementById('taskDate');
    if (taskDate && !taskDate.value) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        taskDate.value = `${yyyy}-${mm}-${dd}`;
    }

    // Initial READ operation on load
    displayReminders();

    // Event listener for form submission (Create / Update)
    const form = document.getElementById('reminderForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // Cancel edit button listener
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', resetForm);
    }
});

// --- 1. READ (Retrieve from Local Storage & Render DOM) ---
function getRemindersFromStorage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        return JSON.parse(saved);
    }
    return []; // Return empty array if no data exists
}

function saveRemindersToStorage(remindersArray) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(remindersArray));
}

function displayReminders() {
    const tableBody = document.getElementById('reminderTableBody');
    if (!tableBody) return;

    const reminders = getRemindersFromStorage();
    let tableHTML = "";

    if (reminders.length === 0) {
        tableHTML = `<tr><td colspan="4" style="text-align: center;">No reminders saved yet.</td></tr>`;
    } else {
        // Standard for loop for beginner-friendly rendering
        for (let i = 0; i < reminders.length; i++) {
            const item = reminders[i];
            tableHTML += `
                <tr>
                    <td><strong>${item.activity}</strong></td>
                    <td>${item.date}</td>
                    <td>${item.prayer}</td>
                    <td>
                        <button onclick="editReminder(${i})" style="background-color: #ffc107; border: none; padding: 5px 10px; cursor: pointer; border-radius: 3px;">Edit</button>
                        <button onclick="deleteReminder(${i})" style="background-color: #dc3545; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 3px;">Delete</button>
                    </td>
                </tr>
            `;
        }
    }

    tableBody.innerHTML = tableHTML;
}

// --- 2. CREATE & 3. UPDATE ---
function handleFormSubmit(event) {
    event.preventDefault(); // Prevent page refresh

    const activityInput = document.getElementById('taskActivity').value.trim();
    const dateInput = document.getElementById('taskDate').value;
    const prayerInput = document.getElementById('taskPrayer').value;
    const editIndex = parseInt(document.getElementById('editIndex').value, 10);

    // INPUT VALIDATION (Rubric Requirement)
    if (!activityInput) {
        showStatus("Please enter an activity description.", "red");
        return;
    }
    if (!dateInput) {
        showStatus("Please select a date.", "red");
        return;
    }

    let reminders = getRemindersFromStorage();

    if (editIndex === -1) {
        // --- CREATE OPERATION ---
        const newReminder = {
            activity: activityInput,
            date: dateInput,
            prayer: prayerInput
        };
        reminders.push(newReminder);
        showStatus("Reminder successfully created!", "green");
    } else {
        // --- UPDATE OPERATION ---
        reminders[editIndex] = {
            activity: activityInput,
            date: dateInput,
            prayer: prayerInput
        };
        showStatus("Reminder successfully updated!", "green");
    }

    // Persist changes to Local Storage
    saveRemindersToStorage(reminders);

    // Refresh Table and Reset Form
    resetForm();
    displayReminders();
}

// Prepare form for UPDATE operation
function editReminder(index) {
    const reminders = getRemindersFromStorage();
    const item = reminders[index];

    if (item) {
        document.getElementById('taskActivity').value = item.activity;
        document.getElementById('taskDate').value = item.date;
        document.getElementById('taskPrayer').value = item.prayer;
        document.getElementById('editIndex').value = index;

        // Change Form Labels & Buttons
        document.getElementById('formTitle').textContent = "Edit Reminder";
        document.getElementById('saveBtn').textContent = "Update Reminder";
        document.getElementById('cancelBtn').style.display = "inline-block";
    }
}

// --- 4. DELETE OPERATION ---
function deleteReminder(index) {
    if (confirm("Are you sure you want to delete this reminder?")) {
        let reminders = getRemindersFromStorage();
        
        // Remove item at specified index
        reminders.splice(index, 1);
        
        // Save back to local storage and re-render
        saveRemindersToStorage(reminders);
        displayReminders();
        showStatus("Reminder deleted successfully.", "orange");
    }
}

// --- HELPER FUNCTIONS ---
function resetForm() {
    document.getElementById('reminderForm').reset();
    document.getElementById('editIndex').value = "-1";
    document.getElementById('formTitle').textContent = "Add New Reminder";
    document.getElementById('saveBtn').textContent = "Save Reminder";
    document.getElementById('cancelBtn').style.display = "none";
}

function showStatus(message, color) {
    const statusMsg = document.getElementById('statusMessage');
    if (statusMsg) {
        statusMsg.textContent = message;
        statusMsg.style.backgroundColor = color === "green" ? "#d4edda" : color === "orange" ? "#fff3cd" : "#f8d7da";
        statusMsg.style.color = color === "green" ? "#155724" : color === "orange" ? "#856404" : "#721c24";
        statusMsg.style.display = "block";

        // Auto-hide feedback message after 3 seconds
        setTimeout(() => {
            statusMsg.style.display = "none";
        }, 3000);
    }
}


document.getElementById('clearAllBtn').addEventListener('click', () => {
    if (confirm("Are you sure you want to delete ALL saved reminders?")) {
        localStorage.removeItem(STORAGE_KEY);
        displayReminders();
        showStatus("All reminders cleared.", "orange");
    }
});