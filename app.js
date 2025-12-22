// ---------- Scheduled Tasks ----------

const taskInput = document.getElementById('taskInput');
const taskDate = document.getElementById('taskDate');
const addTask = document.getElementById('addTask');
const taskList = document.getElementById('taskList');
const todayTasksEl = document.getElementById('todayTasks');

let tasks = JSON.parse(localStorage.getItem('scheduledTasks')) || [];

// LOCAL date (no UTC bugs)
function getLocalISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function renderTasks() {
  taskList.innerHTML = '';
  todayTasksEl.innerHTML = '';

  const today = new Date();
  const todayISO = getLocalISODate(today);

  tasks.forEach((task, index) => {
    // Scheduled Tasks list (all)
    const liAll = document.createElement('li');
    liAll.textContent = `${task.date} — ${task.desc}`;
    if (task.done) liAll.classList.add('done');

    liAll.addEventListener('click', () => {
      tasks[index].done = !tasks[index].done;
      localStorage.setItem('scheduledTasks', JSON.stringify(tasks));
      renderTasks();
    });

    taskList.appendChild(liAll);

    // Today’s Tasks (top section)
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

// Initial load
renderTasks();
