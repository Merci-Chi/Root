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
const taskCounterEl = document.getElementById('taskCounter');

// Local date helper
function getLocalISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const todayISO = getLocalISODate(today);

// Load and remove past tasks
let tasks = (JSON.parse(localStorage.getItem('scheduledTasks')) || [])
  .filter(task => task.date >= todayISO);

localStorage.setItem('scheduledTasks', JSON.stringify(tasks));

function renderTasks() {
  taskList.innerHTML = '';
  todayTasksEl.innerHTML = '';

  let totalToday = 0;
  let completedToday = 0;

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

    // Today's tasks (with checkbox)
    if (task.date === todayISO) {
      totalToday++;

      if (task.done) completedToday++;

      const liToday = document.createElement('li');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.done;

      checkbox.addEventListener('change', () => {
        tasks[index].done = checkbox.checked;
        localStorage.setItem('scheduledTasks', JSON.stringify(tasks));
        renderTasks();
      });

      const span = document.createElement('span');
      span.textContent = task.desc;
      if (task.done) span.classList.add('done');

      liToday.appendChild(checkbox);
      liToday.appendChild(span);
      todayTasksEl.appendChild(liToday);
    }
  });

  taskCounterEl.textContent = `${completedToday}/${totalToday}`;
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
