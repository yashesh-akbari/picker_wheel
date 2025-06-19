let arr = JSON.parse(localStorage.getItem("value")) || [];

document.getElementById("form_submit").addEventListener("submit", (event) => {
  event.preventDefault();

  let input_text = document.getElementById("input_text").value;
  let input_date = document.getElementById("input_date").value;
  let input_category = document.getElementById("input_category").value;
  let input_level = document.getElementById("input_level").value;

  let obj = {
    input_text,
    input_level,
    input_category,
    input_date,
    status: "not completed", // default
    created_at: new Date().toISOString()
  };

  arr.push(obj);
  localStorage.setItem("value", JSON.stringify(arr));

  total_todo_count();
  renderTable();
  document.getElementById("input_text").value = "";
document.getElementById("input_date").value = "";
document.getElementById("input_category").selectedIndex = 0;
document.getElementById("input_level").selectedIndex = 0;
});

window.onload = () => {
  total_todo_count();
  renderTable();
};

let total_todo_count = () => {
  document.getElementById("total_todo_count").innerHTML = "Total Todos: " + arr.length;
};

function getRemainingDays(targetDate) {
  let today = new Date();
  let end = new Date(targetDate);
  let diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
  if (diff < 0) return "expired";
  return `${diff} day${diff === 1 ? '' : 's'} remain`;
}

let renderTable = () => {
  let tbody = document.getElementById("todo_body");
  tbody.innerHTML = "";

  arr.map((todo, index) => {
    let tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${todo.input_text}</td>
      <td>${todo.input_category}</td>
      <td>${todo.input_level}</td>
      <td>${todo.input_date}</td>
      <td>${getRemainingDays(todo.input_date)}</td>
      <td>${todo.status}</td>
      <td>
        <button onclick="deleteTodo(${index})">Delete</button>
        <button onclick="editTodo(${index})">Edit</button>
        <button onclick="toggleStatus(${index})">Mark as ${todo.status === 'completed' ? 'not completed' : 'completed'}</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
};

function deleteTodo(index) {
  arr.splice(index, 1);
  localStorage.setItem("value", JSON.stringify(arr));
  renderTable();
  total_todo_count();
}

function toggleStatus(index) {
  arr[index].status = arr[index].status === "completed" ? "not completed" : "completed";
  localStorage.setItem("value", JSON.stringify(arr));
  renderTable();
}

function editTodo(index) {
  const todo = arr[index];
  document.getElementById("input_text").value = todo.input_text;
  document.getElementById("input_date").value = todo.input_date;
  document.getElementById("input_category").value = todo.input_category;
  document.getElementById("input_level").value = todo.input_level;

  arr.splice(index, 1); // remove old
  localStorage.setItem("value", JSON.stringify(arr));
  renderTable();
  total_todo_count();
}

//light mode and dark mode 
document.getElementById("themeToggle").addEventListener("click", () => {
  const body = document.body;
  body.classList.toggle("dark-mode");
  body.classList.toggle("light-mode");

  // Optional: Save theme preference to localStorage
  const currentTheme = body.classList.contains("dark-mode") ? "dark-mode" : "light-mode";
  localStorage.setItem("theme", currentTheme);
});

// Load saved theme on reload
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.body.classList.remove("light-mode", "dark-mode");
    document.body.classList.add(savedTheme);
  }
});


