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

// LOCAL date helper (NO UTC bugs)
function getLocalISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const todayISO = getLocalISODate(today);

// Load + REMOVE past tasks
let tasks = (JSON.parse(localStorage.getItem('scheduledTasks')) || [])
  .filter(task => task.date >= todayISO);

localStorage.setItem('scheduledTasks', JSON.stringify(tasks));

function renderTasks() {
  taskList.innerHTML = '';
  todayTasksEl.innerHTML = '';

  tasks.forEach((task, index) => {
    // Scheduled list
    const li = document.createElement('li');
    li.textContent = `${task.date} — ${task.desc}`;
    if (task.done) li.classList.add('done');

    li.addEventListener('click', () => {
      tasks[index].done = !tasks[index].done;
      localStorage.setItem('scheduledTasks', JSON.stringify(tasks));
      renderTasks();
    });

    taskList.appendChild(li);

    // Today's tasks
    if (task.date === todayISO && !task.done) {
      const liToday = document.createElement('li');
      liToday.textContent = task.desc;
      todayTasksEl.appendChild(liToday);
    }
  });
}

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
