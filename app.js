// ---------- DATE HEADER ----------
const currentDateEl = document.getElementById('currentDate');
const today = new Date();

currentDateEl.textContent = today.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

// ---------- NOTES (PERSISTENT NOTES) ----------
const noteContainer = document.getElementById('noteContainer');
const saveNoteBtn = document.getElementById('saveNoteBtn');

// Get today's date key (e.g., "Thu Dec 22 2025")
const todayKey = today.toDateString();

// Retrieve saved note from localStorage, if any
let savedNote = JSON.parse(localStorage.getItem('dailyNote')) || {};

// Do not reset the note every day, keep the same note over multiple days
// The note only gets updated or cleared manually, not automatically
if (!savedNote.content) {
  savedNote = { date: todayKey, content: '' };
}

// Load the saved note content into the note container
noteContainer.textContent = savedNote.content;

// Listen for changes in the note container (user input)
noteContainer.addEventListener('input', () => {
  // Update the saved note with the latest content
  savedNote.content = noteContainer.textContent;

  // Store the updated note in localStorage
  localStorage.setItem('dailyNote', JSON.stringify(savedNote));
});

// ---------- SAVE BUTTON ----------
saveNoteBtn.addEventListener('click', () => {
  // Save the content when the user clicks the Save button
  savedNote.content = noteContainer.textContent;
  savedNote.date = todayKey; // Keep the current date for reference
  localStorage.setItem('dailyNote', JSON.stringify(savedNote));

  alert("Notes saved!");
});

// ---------- TASKS ----------
const taskInput = document.getElementById('taskInput');
const taskDate = document.getElementById('taskDate');
const addTask = document.getElementById('addTask');
const taskList = document.getElementById('taskList');
const todayTasksEl = document.getElementById('todayTasks');

// Function to format the date in YYYY-MM-DD format (ISO format)
function getLocalISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const todayISO = getLocalISODate(today);

// ---------- RECURRING + DAILY DATE-SPECIFIC TASK ----------
const recurringTasks = [
  { desc: "T-25", done: false },
  { desc: "Bullet Journal", done: false }
];

// Generate daily mileage task in format MM.DD Miles
const month = today.getMonth() + 1;
const day = today.getDate();
const dailyMileageTask = { desc: `${month}.${day} Miles`, done: false };

// Load saved tasks and remove past tasks
let tasks = (JSON.parse(localStorage.getItem('scheduledTasks')) || [])
  .filter(task => task.date >= todayISO);

// Add recurring tasks if missing
recurringTasks.forEach(rt => {
  const exists = tasks.some(t => t.date === todayISO && t.desc === rt.desc);
  if (!exists) tasks.push({ date: todayISO, desc: rt.desc, done: false });
});

// Add today’s mileage task if missing
const mileageExists = tasks.some(t => t.date === todayISO && t.desc === dailyMileageTask.desc);
if (!mileageExists) tasks.push({ date: todayISO, desc: dailyMileageTask.desc, done: false });

// Save updated tasks
localStorage.setItem('scheduledTasks', JSON.stringify(tasks));

// ---------- RENDER FUNCTION ----------
function renderTasks() {
  taskList.innerHTML = '';
  todayTasksEl.innerHTML = '';

  let totalToday = 0;
  let doneToday = 0;

  tasks.forEach((task, index) => {
    // Scheduled tasks (bottom section)
    const li = document.createElement('li');
    li.textContent = `${task.date} — ${task.desc}`;
    if (task.done) li.classList.add('done');

    li.addEventListener('click', () => {
      tasks[index].done = !tasks[index].done;
      localStorage.setItem('scheduledTasks', JSON.stringify(tasks));
      renderTasks();
    });

    taskList.appendChild(li);

    // Today's tasks (top section)
    if (task.date === todayISO) {
      const liToday = document.createElement('li');
      liToday.textContent = task.desc;
      liToday.style.cursor = 'pointer';

      if (task.done) {
        liToday.classList.add('done');
        doneToday++;
      }
      totalToday++;

      liToday.addEventListener('click', () => {
        tasks[index].done = !tasks[index].done;
        localStorage.setItem('scheduledTasks', JSON.stringify(tasks));
        renderTasks();
      });

      todayTasksEl.appendChild(liToday);
    }
  });

  // Update counter bubble
  const counter = document.getElementById('taskCounter');
  counter.textContent = `${doneToday}/${totalToday}`;
}

// ---------- ADD TASK ----------
addTask.addEventListener('click', () => {
  const desc = taskInput.value.trim();
  const date = taskDate.value;
  if (!desc || !date) return;

  tasks.push({ desc, date, done: false });
  localStorage.setItem('scheduledTasks', JSON.stringify(tasks));

  taskInput.value = '';
  taskDate.value = '';
  renderTasks();
});

// Set today's date in the taskDate input
taskDate.value = todayISO;  // This sets the date picker to today's date

// Initial render
renderTasks();

// ---------- WEB NOTIFICATIONS ----------
if ('Notification' in window) {
  if (Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

function sendNotification(title, body) {
  if (Notification.permission === 'granted') {
    new Notification(title, { body });
  }
}

// Notify user about today's incomplete tasks on page load
const todayTaskDesc = tasks
  .filter(task => task.date === todayISO && !task.done)
  .map(task => task.desc)
  .join(', ');

if (todayTaskDesc) {
  sendNotification("Today's Tasks", todayTaskDesc);
}

// Optional: Schedule daily 9:00 AM reminder
function scheduleDailyReminder(hour, minute) {
  const now = new Date();
  const next = new Date();
  next.setHours(hour, minute, 0, 0);
  if (next < now) next.setDate(next.getDate() + 1);

  const timeout = next.getTime() - now.getTime();
  setTimeout(() => {
    sendNotification("Daily Reminder", "Check your tasks and notes!");
    scheduleDailyReminder(hour, minute); // reschedule for tomorrow
  }, timeout);
}

// Uncomment below line to enable daily 9 AM reminder
scheduleDailyReminder(9, 0);

