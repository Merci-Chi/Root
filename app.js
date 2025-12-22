// ---------- DATE HEADER ----------
const currentDateEl = document.getElementById('currentDate');
const today = new Date();

currentDateEl.textContent = today.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

// ---------- NOTES (DAILY RESET) ----------
const noteContainer = document.getElementById('noteContainer');

const todayKey = today.toDateString();
let savedNote = JSON.parse(localStorage.getItem('dailyNote')) || {};

if (savedNote.date !== todayKey) {
  savedNote = { date: todayKey, content: '' };
}

noteContainer.textContent = savedNote.content;

noteContainer.addEventListener('input', () => {
  savedNote.content = noteContainer.textContent;
  localStorage.setItem('dailyNote', JSON.stringify(savedNote));
});

// ---------- TASKS ----------
const taskInput = document.getElementById('taskInput');
const taskDate = document.getElementById('taskDate');
const addTask = document.getElementById('addTask');
const taskList = document.getElementById('taskList');
const todayTasksEl = document.getElementById('todayTasks');

function getLocalISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const todayISO = getLocalISODate(today);

// ---------- RECURRING DAILY TASKS ----------
const recurringTasks = [
  { desc: "Check emails", done: false },
  { desc: "Morning workout", done: false },
  { desc: "Plan day", done: false }
];

// Load saved tasks
let tasks = (JSON.parse(localStorage.getItem('scheduledTasks')) || [])
  .filter(task => task.date >= todayISO);

// Add recurring tasks if they don't exist today
recurringTasks.forEach(rt => {
  const exists = tasks.some(t => t.date === todayISO && t.desc === rt.desc);
  if (!exists) {
    tasks.push({ date: todayISO, desc: rt.desc, done: false });
  }
});

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

// Initial render
renderTasks();
