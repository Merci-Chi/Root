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
      monthDiv.style.gridTemplateColumns = `repeat(${getDaysInMonth(month, currentYear)}, 20px)`; // smaller width

      const monthLabel = document.createElement('div');
      monthLabel.classList.add('monthLabel');
      monthLabel.textContent = new Date(currentYear, month).toLocaleString('default', { month: 'long' });
      monthDiv.appendChild(monthLabel);

      const daysInMonth = getDaysInMonth(month, currentYear);
      for (let day = 1; day <= daysInMonth; day++) {
        const dayBox = document.createElement('div');
        dayBox.classList.add('dayBox');
        dayBox.style.width = '20px';   // smaller width
        dayBox.style.height = '20px';  // smaller height
        dayBox.style.fontSize = '0.65rem'; // smaller font
        dayBox.textContent = day;

        const key = `${currentYear}-${month + 1}-${day}`;

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

    // Scroll to top so day 1 is visible
    habitCalendarContainer.scrollTop = 0;
  }

  habitBtns.forEach(btn => {
    btn.addEventListener('click', () => renderHabitCalendar(btn.dataset.habit));
  });

  if (habitBtns.length > 0) renderHabitCalendar(habitBtns[0].dataset.habit);

});

