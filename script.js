document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const dueDateInput = document.getElementById('due-date-input');
    const priorityInput = document.getElementById('priority-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');
    const emptyMessage = document.getElementById('empty-message');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const progressBar = document.getElementById('progress-bar');

    let tasks = loadTasks();

    addBtn.addEventListener('click', addTodo);
    todoList.addEventListener('click', handleListClick);
    filterButtons.forEach(btn => btn.addEventListener('click', filterTasks));
    darkModeToggle.addEventListener('click', toggleDarkMode);

    updateUI();

    function addTodo() {
        const todoText = todoInput.value.trim();
        const dueDate = dueDateInput.value;
        const priority = priorityInput.value;

        if (todoText !== '') {
            const task = {
                text: todoText,
                dueDate,
                priority,
                completed: false,
                subtasks: []
            };
            tasks.push(task);
            saveTasks();
            updateUI();

            todoInput.value = '';
            dueDateInput.value = '';
        } else {
            alert('Please enter a task.');
        }
    }

    function handleListClick(e) {
        const target = e.target;

        if (target.classList.contains('delete-btn')) {
            const index = target.parentElement.dataset.index;
            tasks.splice(index, 1);
            saveTasks();
            updateUI();
        } else if (target.tagName === 'LI') {
            const index = target.dataset.index;
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            updateUI();
        }
    }

    function filterTasks(e) {
        const filter = e.target.getAttribute('data-filter');
        updateUI(filter);
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    }

    function toggleDarkMode() {
        const isDarkMode = document.body.classList.toggle('dark-mode');
        if (isDarkMode) {
            darkModeToggle.textContent = 'Light Mode';
        } else {
            darkModeToggle.textContent = 'Toggle Dark Mode';
        }
    }

    function updateUI(filter = 'all') {
        todoList.innerHTML = '';
        const filteredTasks = tasks.filter(task => {
            if (filter === 'all') return true;
            if (filter === 'active') return !task.completed;
            if (filter === 'completed') return task.completed;
        });
        renderTasks(filteredTasks);
        toggleEmptyMessage();
        updateProgressBar();
    }

    function renderTasks(tasks) {
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.dataset.index = index;

            const taskDetails = document.createElement('div');
            taskDetails.className = 'task-details';

            const taskText = document.createElement('span');
            taskText.className = 'task-text';
            taskText.textContent = task.text;

            const taskDueDate = document.createElement('span');
            taskDueDate.className = 'task-due-date';
            taskDueDate.textContent = `Due: ${task.dueDate}`;

            const taskPriority = document.createElement('span');
            taskPriority.className = 'task-priority';
            taskPriority.textContent = `Priority: ${task.priority}`;

            taskDetails.appendChild(taskText);
            taskDetails.appendChild(taskDueDate);
            taskDetails.appendChild(taskPriority);

            if (task.completed) {
                li.classList.add('completed');
            }

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'delete-btn';

            li.appendChild(taskDetails);
            li.appendChild(deleteBtn);

            todoList.appendChild(li);
        });
    }

    function toggleEmptyMessage() {
        emptyMessage.style.display = tasks.length ? 'none' : 'block';
    }

    function updateProgressBar() {
        const completedTasks = tasks.filter(task => task.completed).length;
        const totalTasks = tasks.length;
        const progress = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
        progressBar.value = progress;
    }
});
