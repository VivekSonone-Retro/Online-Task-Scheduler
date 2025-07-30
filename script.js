let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

document.addEventListener("DOMContentLoaded", () => {
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("dueDate").setAttribute("min", today);
    renderTasks();
});

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
    const input = document.getElementById("taskInput");
    const priority = document.getElementById("priority").value;
    const dueDate = document.getElementById("dueDate").value;
    const dueTime = document.getElementById("dueTime").value;

    if (input.value.trim() && dueDate) {
        tasks.push({
            text: input.value.trim(),
            completed: false,
            priority: priority,
            dueDate: dueDate,
            dueTime: dueTime
        });
        saveTasks();
        input.value = "";
        document.getElementById("dueDate").value = "";
        document.getElementById("dueTime").value = "";
        renderTasks();
    } else {
        alert("Please enter a task and select a valid date.");
    }
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

function editTask(index) {
    const newText = prompt("Edit task:", tasks[index].text);
    if (newText !== null && newText.trim() !== "") {
        tasks[index].text = newText.trim();
        saveTasks();
        renderTasks();
    }
}

function setFilter(filter) {
    currentFilter = filter;
    document.querySelectorAll(".filters button").forEach(btn => btn.classList.remove("active"));
    document.querySelector(`.filters button[onclick="setFilter('${filter}')"]`).classList.add("active");
    renderTasks();
}

function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
}

function renderTasks() {
    const list = document.getElementById("taskList");
    const search = document.getElementById("search").value.toLowerCase();
    list.innerHTML = "";

    let filteredTasks = tasks.filter(task => {
        if (currentFilter === "active") return !task.completed;
        if (currentFilter === "completed") return task.completed;
        return true;
    }).filter(task => task.text.toLowerCase().includes(search));

    filteredTasks.forEach((task, index) => {
        const li = document.createElement("li");
        if (task.completed) li.classList.add("completed");

        const taskInfo = document.createElement("div");
        taskInfo.className = "task-info";

        const span = document.createElement("span");
        span.textContent = task.text;
        span.className = "task-text priority-" + task.priority;
        span.onclick = () => toggleTask(index);

        const dateSpan = document.createElement("small");
        if (task.dueDate) {
            let timeText = task.dueTime ? ` at ${task.dueTime}` : "";
            dateSpan.textContent = `Due: ${task.dueDate}${timeText}`;
        }

        taskInfo.appendChild(span);
        taskInfo.appendChild(dateSpan);
        li.appendChild(taskInfo);

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const editBtn = document.createElement("button");
        editBtn.textContent = "✏";
        editBtn.onclick = () => editTask(index);

        const delBtn = document.createElement("button");
        delBtn.textContent = "❌";
        delBtn.style.background = "crimson";
        delBtn.onclick = () => deleteTask(index);

        actions.appendChild(editBtn);
        actions.appendChild(delBtn);

        li.appendChild(actions);
        list.appendChild(li);
    });
}
