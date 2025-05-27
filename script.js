
let currentFilter = "all";

const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  themeToggle.innerHTML = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
});

// Apply saved theme and button text on load
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  themeToggle.innerHTML = "☀️ Light Mode";
} else {
  themeToggle.innerHTML = "🌙 Dark Mode";
}

function addTask() {
  const input = document.getElementById("taskInput");
  const taskText = input.value.trim();
  if (!taskText) return;

  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  tasks.push({ text: taskText, completed: false });
  localStorage.setItem("tasks", JSON.stringify(tasks));

  input.value = "";
  renderTasks(currentFilter);
}

function renderTasks(filter = "all") {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

  tasks.forEach((task, index) => {
    if ((filter === "completed" && !task.completed) || (filter === "pending" && task.completed)) return;
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";
    li.innerHTML = `
      <span onclick="toggleComplete(${index})">${task.completed ? "✅" : "⭕"} ${task.text}</span>
      <button onclick="deleteTask(${index})">🗑️</button>`;
    taskList.appendChild(li);
  });
}

function toggleComplete(index) {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks[index].completed = !tasks[index].completed;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks(currentFilter);
}

function deleteTask(index) {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks(currentFilter);
}

function filterTasks(filter) {
  currentFilter = filter;
  renderTasks(filter);
}

window.onload = () => renderTasks();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("sw.js")
      .then((reg) => console.log("Service Worker registered:", reg))
      .catch((err) => console.error("Service Worker registration failed:", err));
  });
}
