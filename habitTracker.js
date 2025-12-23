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

  // Load tasks from app.js
  function loadScheduledTasks() {
    return JSON.parse(localStorage.getItem('scheduledTasks')) || [];
  }

  // Check if habit should be marked done based on tasks
  function isHabitDoneFromTasks(habit, year, month, day) {
    const tasks = loadScheduledTasks();
    const keyDate = `${year}-${month + 1}-${day}`;
    return tasks.some(task => task.done && task.date === keyDate && task.desc === habit);
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

        // Mark completed if either manually toggled or task is done
        if (data[key] || isHabitDoneFromTasks(habit, currentYear, month, day)) {
          dayBox.classList.add('completed');
        }

        // Manual toggle
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

  // Attach click events to habit buttons
  habitBtns.forEach(btn => {
    btn.addEventListener('click', () => renderHabitCalendar(btn.dataset.habit));
  });

  // Default render
  if (habitBtns.length > 0) renderHabitCalendar(habitBtns[0].dataset.habit);

  // Optional: Re-render habit calendar whenever tasks are updated
  // This will keep it in sync if tasks are checked/unchecked
  window.addEventListener('storage', () => {
    const activeHabit = document.querySelector('.habitBtn.active')?.dataset.habit || habitBtns[0].dataset.habit;
    renderHabitCalendar(activeHabit);
  });

});
