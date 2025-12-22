// Service Worker registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(regs => {
    for (let reg of regs) reg.unregister();
    navigator.serviceWorker.register('service-worker.js')
      .then(() => console.log('Service Worker Registered'))
      .catch(err => console.log('Service Worker Failed:', err));
  });
}

// ---------- Current Date ----------
const currentDateEl = document.getElementById('currentDate');
const todayDate = new Date();
const options = { year: 'numeric', month: 'long', day: 'numeric' };
currentDateEl.textContent = todayDate.toLocaleDateString('en-US', options);

// ---------- Daily Notes ----------
const noteContainer = document.getElementById('noteContainer');
const saveBtn = document.getElementById('saveNote');

const todayStr = todayDate.toDateString();
const weekday = todayDate.toLocaleDateString('en-US', { weekday: 'long' });

const scheduledNotes = {
  "Sunday": "Rest day - plan for the week",
  "Monday": "Check emails and meetings",
  "Tuesday": "Workout and project work",
  "Wednesday": "Midweek review",
  "Thursday": "Team check-in",
  "Friday": "Finish tasks and plan weekend",
  "Saturday": "Relax and self-care"
};

// Load note from localStorage
let stored = JSON.parse(localStorage.getItem('dailyNotes')) || {};
if (stored.date !== todayStr) {
  stored = { date: todayStr, content: scheduledNotes[weekday] || '' };
}
noteContainer.textContent = stored.content || '';

// Save note
saveBtn.addEventListener('click', () => {
  stored.content = noteContainer.textContent;
  localStorage.setItem('dailyNotes', JSON.stringify(stored));
});

// ---------- Scheduled Tasks ----------
const taskInput = document.getElementById('taskInput');
const taskDate = document.getElementById('taskDate');
const addTask = document.getElementById('addTask');
const taskList = document.getElementById('taskList');
const todayTasksEl = document.getElementById('todayTasks');

let tasks = JSON.parse(localStorage.getItem('scheduledTasks')) || [];

function renderTasks() {
  // Clear lists
  taskList.innerHTML = '';
  todayTasksEl.innerHTML = '';

  const todayISO = todayDate.toISOString().split('T')[0];

  tasks.forEach((task, index) => {
    // Scheduled tasks section (all tasks)
    const liAll = document.createElement('li');
    liAll.textContent = `${task.date}: ${task.desc}`;
    liAll.dataset.index = index;
    liAll.addEventListener('click', () => {
      tasks[index].done = !tasks[index].done;
      localStorage.setItem('scheduledTasks', JSON.stringify(tasks));
      renderTasks();
    });
    if(task.done) liAll.classList.add('done');
    taskList.appendChild(liAll);

    // Today’s tasks (plain list, Architects Daughter font)
    if(task.date === todayISO) {
      const liToday = document.createElement('li');
      liToday.textContent = task.desc;
      if(task.done) liToday.classList.add('done');
      todayTasksEl.appendChild(liToday);
    }
  });
}

addTask.addEventListener('click', () => {
  const desc = taskInput.value.trim();
  const date = taskDate.value;
  if(!desc || !date) return;
  tasks.push({ desc, date, done: false });
  localStorage.setItem('scheduledTasks', JSON.stringify(tasks));
  taskInput.value = '';
  taskDate.value = '';
  renderTasks();
});

// Initial render
renderTasks();
