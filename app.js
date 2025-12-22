// Service Worker registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(regs => {
    for (let reg of regs) reg.unregister();
    navigator.serviceWorker.register('service-worker.js')
      .then(() => console.log('Service Worker Registered'))
      .catch(err => console.log('Service Worker Failed:', err));
  });
}

// Daily Notes Logic
const noteContainer = document.getElementById('noteContainer');
const saveBtn = document.getElementById('saveNote');

const today = new Date().toDateString();

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
if (stored.date !== today) {
  const weekday = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  stored = { date: today, content: scheduledNotes[weekday] || '' };
}
noteContainer.textContent = stored.content || '';

// Save note
saveBtn.addEventListener('click', () => {
  stored.content = noteContainer.textContent;
  localStorage.setItem('dailyNotes', JSON.stringify(stored));
});
 
// Scheduled Tasks Logic
const taskInput = document.getElementById('taskInput');
const taskDate = document.getElementById('taskDate');
const addTask = document.getElementById('addTask');
const taskList = document.getElementById('taskList');

let tasks = JSON.parse(localStorage.getItem('scheduledTasks')) || [];

function renderTasks() {
  taskList.innerHTML = '';
  const todayStr = new Date().toISOString().split('T')[0];
  tasks.forEach((task, index) => {
    if (task.date === todayStr) {
      const li = document.createElement('li');
      li.textContent = task.desc;
      li.dataset.index = index;
      li.addEventListener('click', () => {
        tasks[index].done = !tasks[index].done;
        localStorage.setItem('scheduledTasks', JSON.stringify(tasks));
        renderTasks();
      });
      if(task.done) li.classList.add('done');
      taskList.appendChild(li);
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
