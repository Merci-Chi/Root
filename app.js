const habitInput = document.getElementById("habitInput");
const addHabit = document.getElementById("addHabit");
const habitList = document.getElementById("habitList");

let habits = JSON.parse(localStorage.getItem("habits")) || [];

function render() {
  habitList.innerHTML = "";
  habits.forEach((habit, i) => {
    const li = document.createElement("li");
    li.textContent = habit;
    li.dataset.index = i;
    habitList.appendChild(li);
  });
}

addHabit.addEventListener("click", () => {
  const val = habitInput.value.trim();
  if (!val) return;
  habits.push(val);
  habitInput.value = "";
  localStorage.setItem("habits", JSON.stringify(habits));
  render();
});

habitList.addEventListener("click", e => {
  const i = e.target.dataset.index;
  habits.splice(i, 1);
  localStorage.setItem("habits", JSON.stringify(habits));
  render();
});

render();
