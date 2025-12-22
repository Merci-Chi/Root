// Habit Tracker Logic
const habitInput = document.getElementById("habitInput");
const addHabit = document.getElementById("addHabit");
const habitList = document.getElementById("habitList");

// Load saved habits from localStorage
let habits = JSON.parse(localStorage.getItem("habits")) || [];

function renderHabits() {
  habitList.innerHTML = "";
  habits.forEach((habit, index) => {
    const li = document.createElement("li");
    li.textContent = habit.name;
    li.dataset.index = index;
    if(habit.done) li.classList.add("done");
    li.addEventListener("click", () => {
      habits[index].done = !habits[index].done;
      saveAndRender();
    });
    habitList.appendChild(li);
  });
}

function saveAndRender() {
  localStorage.setItem("habits", JSON.stringify(habits));
  renderHabits();
}

addHabit.addEventListener("click", () => {
  const val = habitInput.value.trim();
  if(!val) return;
  habits.push({ name: val, done: false });
  habitInput.value = "";
  saveAndRender();
});

// Initial render
renderHabits();
