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

      const monthLabel = document.createElement('div');
      monthLabel.classList.add('monthLabel');
      monthLabel.textContent = new Date(currentYear, month).toLocaleString('default', { month: 'long' });
      monthDiv.appendChild(monthLabel);

      const daysInMonth = getDaysInMonth(month, currentYear);
      for (let day = 1; day <= daysInMonth; day++) {
        const dayBox = document.createElement('div');
        dayBox.classList.add('dayBox');
        dayBox.textContent = day;

        // Smaller boxes for better fit
        dayBox.style.width = '20px';
        dayBox.style.height = '20px';
        dayBox.style.fontSize = '0.65rem';
        dayBox.style.lineHeight = '20px';

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

    // Scroll to the top so day 1 is visible
    habitCalendarContainer.scrollTop = 0;
  }

  // Attach click events to buttons
  habitBtns.forEach(btn => {
    btn.addEventListener('click', () => renderHabitCalendar(btn.dataset.habit));
  });

  // Render default habit on load
  if (habitBtns.length > 0) renderHabitCalendar(habitBtns[0].dataset.habit);

});

#habitCalendarContainer {
  overflow-y: auto;
  max-height: 75vh;
  padding: 10px;
}

.month {
  display: grid;
  grid-template-columns: repeat(31, 1fr);
  gap: 2px;
  margin-bottom: 20px; /* separate months visually */
}

.monthLabel {
  grid-column: span 31;
  text-align: center;
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 0.9rem;
  background-color: black;       /* add background to cover day boxes behind */
  position: sticky;              /* make label stick */
  top: 0;                        /* stick to top of scroll container */
  z-index: 10;                   /* above day boxes */
  padding: 2px 0;                /* small padding */
  border-bottom: 1px solid white; /* optional separator line */
}
