// Register Service Worker (cache-proof)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(regs => {
    for (let reg of regs) reg.unregister();
    navigator.serviceWorker.register('service-worker.js')
      .then(() => console.log('Service Worker Registered'))
      .catch(err => console.log('Service Worker Failed:', err));
  });
}

const noteContainer = document.getElementById('noteContainer');
const noteInput = document.getElementById('noteInput');
const saveBtn = document.getElementById('saveNote');

const today = new Date().toDateString(); // e.g., "Mon Dec 23 2025"

// Weekly schedule for notes (example)
const scheduledNotes = {
  "Sunday": "Rest day - plan for the week",
  "Monday": "Check emails and meetings",
  "Tuesday": "Workout and project work",
  "Wednesday": "Midweek review",
  "Thursday": "Team check-in",
  "Friday": "Finish tasks and plan weekend",
  "Saturday": "Relax and self-care"
};

// Load notes from localStorage
let stored = JSON.parse(localStorage.getItem('dailyNotes')) || {};
if (stored.date !== today) {
  // New day → reset notes
  stored = { date: today, content: scheduledNotes[new Date().toLocaleDateString('en-US', { weekday: 'long' })] || '' };
}
noteContainer.textContent = stored.content || '';
noteInput.value = stored.content || '';

// Save note
saveBtn.addEventListener('click', () => {
  stored.content = noteInput.value;
  localStorage.setItem('dailyNotes', JSON.stringify(stored));
  noteContainer.textContent = stored.content;
});
