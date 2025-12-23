document.addEventListener('DOMContentLoaded', () => {

  const habitCalendarContainer = document.getElementById('habitCalendarContainer');
  const habitBtns = document.querySelectorAll('.habitBtn');
  const today = new Date();
  const currentYear = today.getFullYear();

  function getDaysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
  }

  function loadHabitData(habit) {
    return JSON.parse(localStorage.getItem(`habit-${habit}`)) || {};
  }

  function saveHabitData(habit, data) {
    localStorage.setItem(`habit-${habit}`, JSON.stringify(data));
  }

  function loadScheduledTasks() {
    return JSON.parse(localStorage.getItem('scheduledTasks')) || [];
  }

  // Check if a task is done from app.js for syncing
  function isHabitDoneFromTasks(habit, year, month, day) {
    const tasks = loadScheduledTasks();
    const keyDate = `${year}-${month + 1}-${day}`;
    return tasks.some(task => task.date === keyDate && task.desc === habit && task.done);
  }

  function renderHabitCalendar(habit) {
    habitCalendarContainer.innerHTML = '';
    const data = loadHabitData(habit);

    for (let month = 0; month < 12; month++) {
      const monthDiv = document.createElement('div');
      monthDiv.classList.add('month');

      const monthLabel = document.createElement('div');
      monthLabel.classList.add('monthLabel');
      monthLabel.textContent = new Date(currentYear, month).toLocaleString('default', { month: 'long' });
      monthDiv.appendChild(monthLabel);

      const daysInMonth = getDaysInMonth(month, currentYear);
      for (let day = 1; day <= daysInMonth; day++) {
        const dayBox = document.createElement('div');
        dayBox.classList.add('dayBox');
        dayBox.textContent = day;

        const key = `${currentYear}-${month + 1}-${day}`;

        // Mark completed if either manually toggled or task is done in app.js
        if (data[key] || isHabitDoneFromTasks(habit, currentYear, month, day)) {
          dayBox.classList.add('completed');
        }

        dayBox.addEventListener('click', () => {
          data[key] = !data[key];
          saveHabitData(habit, data);
          dayBox.classList.toggle('completed');
        });

        monthDiv.appendChild(dayBox);
      }

      habitCalendarContainer.appendChild(monthDiv);
    }
  }

  habitBtns.forEach(btn => {
    btn.addEventListener('click', () => renderHabitCalendar(btn.dataset.habit));
  });

  // Render default habit on load
  if (habitBtns.length > 0) renderHabitCalendar(habitBtns[0].dataset.habit);

});

