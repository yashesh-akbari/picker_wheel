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

function renderTable(data = arr) {
  const tbody = document.getElementById("todo_body");
  tbody.innerHTML = "";

  data.forEach((todo, index) => {
    let tr = document.createElement("tr");
    let remaining = getRemainingDays(todo.input_date);
    let remainingText = remaining < 0 ? "expired" : `${remaining} day${remaining === 1 ? '' : 's'} remain`;

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${todo.input_text}</td>
      <td>${todo.input_category}</td>
      <td>${todo.input_level}</td>
      <td>${todo.input_date}</td>
      <td>${remainingText}</td>
      <td>${todo.status}</td>
      <td>
        <button onclick="deleteTodo(${index})">Delete</button>
        <button onclick="editTodo(${index})">Edit</button>
        <button onclick="toggleStatus(${index})">Mark as ${todo.status === 'completed' ? 'not completed' : 'completed'}</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

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

//fliter the item list
const filters = {
  category: '',
  importance: '',
  daysRange: '',
  status: ''
};

document.getElementById("filter_category").addEventListener("change", (e) => {
  filters.category = e.target.value;
  applyFilters();
});

document.getElementById("filter_importance").addEventListener("change", (e) => {
  filters.importance = e.target.value;
  applyFilters();
});

document.getElementById("filter_date").addEventListener("change", (e) => {
  filters.daysRange = e.target.value;
  applyFilters();
});

document.getElementById("filter_status").addEventListener("change", (e) => {
  filters.status = e.target.value;
  applyFilters();
});

function getRemainingDays(targetDate) {
  let today = new Date();
  let end = new Date(targetDate);
  let diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
  return diff;
}

function applyFilters() {
  let filtered = arr.filter((todo) => {
    const remain = getRemainingDays(todo.input_date);

    const matchCategory = filters.category === "" || todo.input_category === filters.category;
    const matchImportance = filters.importance === "" || todo.input_level === filters.importance;

    const matchDays =
      filters.daysRange === "" ||
      (filters.daysRange === "1-7 days" && remain >= 1 && remain <= 7) ||
      (filters.daysRange === "7-14 days" && remain >= 8 && remain <= 14) ||
      (filters.daysRange === "14+ days" && remain > 14);

    const matchStatus =
      filters.status === "" ||
      filters.status === "all task" ||
      (filters.status === "completed task" && todo.status === "completed") ||
      (filters.status === "not completed task" && todo.status === "not completed");

    return matchCategory && matchImportance && matchDays && matchStatus;
  });

  renderTable(filtered);
}
