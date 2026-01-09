const apiUrl = '/api/tasks/';

document.addEventListener('DOMContentLoaded', () => {
    fetchTasks();
});

// GET TASKS
async function fetchTasks(filter = 'all') {
    const res = await fetch(apiUrl);
    const tasks = await res.json();
    const list = document.getElementById('taskList');
    list.innerHTML = '';

    tasks.forEach(task => {
        if (filter === 'todo' && task.is_completed) return;
        if (filter === 'done' && !task.is_completed) return;

        const li = document.createElement('li');
        if (task.is_completed) li.classList.add('completed');

        // FORMAT 24H
        const time24 = task.due_time.substring(0, 5);

        li.innerHTML = `
            <span>
                <strong>${task.title}</strong> <br>
                <small style="color: #666;">Due: ${task.due_date} at ${time24}</small>
            </span>
            <div class="actions">
                <button class="btn-check" onclick="toggleTask(${task.id}, ${task.is_completed})">✓</button>
                <button class="btn-del" onclick="deleteTask(${task.id})">✕</button>
            </div>
        `;
        list.appendChild(li);
    });
}

// CREATE
async function createTask() {
    const title = document.getElementById('taskTitle').value;
    const date = document.getElementById('taskDate').value;
    const time = document.getElementById('taskTime').value;

    if (!title || !date || !time) {
        alert('Please fill all fields');
        return;
    }

    await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title, due_date: date, due_time: time })
    });

    document.getElementById('taskTitle').value = '';
    fetchTasks();
}

// UPDATE
async function toggleTask(id, currentStatus) {
    await fetch(`${apiUrl}${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_completed: !currentStatus })
    });
    fetchTasks();
}

// DELETE
async function deleteTask(id) {
    if (confirm('Delete this task?')) {
        await fetch(`${apiUrl}${id}/`, { method: 'DELETE' });
        fetchTasks();
    }
}

// FILTER
function filterTasks(type) {
    fetchTasks(type);
}
