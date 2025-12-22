// Register Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js")
    .then(() => console.log("Service Worker Registered"))
    .catch(err => console.log("Service Worker Failed:", err));
}

// Habit Tracker Logic
const habitInput = document.getElementById("habitInput");
const addHabit = document.getElementById("addHabit");
const habitList = document.getElementById("habitList");

// Load saved habits from localStorage
let habits = JSON.parse(localStorage.getItem("habits")) || [];
renderHabits();

// Add new habit
addHabit.addEventListener("click", () => {
  const habit = habitInput.value.trim();
  if (habit === "") return;
  habits.push({ name: habit, done: false });
  habitInput.value = "";
  saveAndRender();
});

// Mark habit as done / remove
habitList.addEventListener("click", e => {
  if (e.target.tagName === "LI") {
    const index = e.target.dataset.index;
    habits[index].done = !habits[index].done;
    saveAndRender();
  }
});

function saveAndRender() {
  localStorage.setItem("habits", JSON.stringify(habits));
  renderHabits();
}

function renderHabits() {
  habitList.innerHTML = "";
  habits.forEach((habit, index) => {
    const li = document.createElement("li");
    li.textContent = habit.name;
    li.dataset.index = index;
    li.style.textDecoration = habit.done ? "line-through" : "none";
    habitList.appendChild(li);
  });
}
