// Settings
let userName = localStorage.getItem('userName') || '';
let pomodoroTime = parseInt(localStorage.getItem('pomodoroTime')) || 25;
let darkMode = localStorage.getItem('darkMode') === 'true';

// Apply dark mode on load
if (darkMode) {
    document.body.classList.add('dark-mode');
}

// Toggle Dark Mode
function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', darkMode);
}

// Greeting and DateTime
function updateGreeting() {
    const hour = new Date().getHours();
    const greetingEl = document.getElementById('greeting');
    let timeGreeting = '';
    
    if (hour < 12) {
        timeGreeting = 'Good Morning';
    } else if (hour < 18) {
        timeGreeting = 'Good Afternoon';
    } else {
        timeGreeting = 'Good Evening';
    }
    
    if (userName) {
        greetingEl.textContent = `${timeGreeting}, ${userName}`;
    } else {
        greetingEl.textContent = timeGreeting;
    }
}

function updateDateTime() {
    const now = new Date();
    const timeEl = document.getElementById('time');
    const dateEl = document.getElementById('date');
    
    timeEl.textContent = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    });
    
    dateEl.textContent = now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// To-Do List
let todos = JSON.parse(localStorage.getItem('todos')) || [];

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
    const todoList = document.getElementById('todoList');
    const todoStats = document.getElementById('todoStats');
    todoList.innerHTML = '';
    
    const doneCount = todos.filter(t => t.done).length;
    todoStats.textContent = `${todos.length} tasks (${doneCount} done)`;
    
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.done ? 'done' : ''}`;
        
        li.innerHTML = `
            <span class="todo-text" onclick="toggleTodo(${index})">${todo.text}</span>
            <div class="todo-actions">
                <button class="btn-small btn-edit" onclick="editTodo(${index})">Edit</button>
                <button class="btn-small btn-delete" onclick="deleteTodo(${index})">×</button>
            </div>
        `;
        
        todoList.appendChild(li);
    });
}

function addTodo() {
    const input = document.getElementById('taskInput');
    const text = input.value.trim();
    
    if (text) {
        // Check for duplicates
        const isDuplicate = todos.some(todo => todo.text.toLowerCase() === text.toLowerCase());
        if (isDuplicate) {
            alert('This task already exists!');
            return;
        }
        
        todos.push({ text, done: false });
        saveTodos();
        renderTodos();
        input.value = '';
    }
}

function sortTodos(type) {
    if (type === 'active') {
        todos.sort((a, b) => a.done - b.done);
    } else if (type === 'completed') {
        todos.sort((a, b) => b.done - a.done);
    } else if (type === 'name') {
        todos.sort((a, b) => a.text.localeCompare(b.text));
    }
    saveTodos();
    renderTodos();
}

function toggleTodo(index) {
    todos[index].done = !todos[index].done;
    saveTodos();
    renderTodos();
}

function editTodo(index) {
    const newText = prompt('Edit task:', todos[index].text);
    if (newText !== null && newText.trim()) {
        todos[index].text = newText.trim();
        saveTodos();
        renderTodos();
    }
}

function deleteTodo(index) {
    if (confirm('Delete this task?')) {
        todos.splice(index, 1);
        saveTodos();
        renderTodos();
    }
}

// Focus Timer
let timerInterval = null;
let timeLeft = pomodoroTime * 60;
let isRunning = false;

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timerDisplay').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimerDisplay();
            } else {
                stopTimer();
                alert('Focus session complete! Time for a break.');
            }
        }, 1000);
    }
}

function stopTimer() {
    isRunning = false;
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function resetTimer() {
    stopTimer();
    timeLeft = pomodoroTime * 60;
    updateTimerDisplay();
}

// Quick Links
let links = JSON.parse(localStorage.getItem('links')) || [];

function saveLinks() {
    localStorage.setItem('links', JSON.stringify(links));
}

function renderLinks() {
    const linksGrid = document.getElementById('linksGrid');
    linksGrid.innerHTML = '';
    
    links.forEach((link, index) => {
        const linkBtn = document.createElement('a');
        linkBtn.href = link.url;
        linkBtn.target = '_blank';
        linkBtn.className = 'link-button';
        linkBtn.textContent = link.name;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'link-delete';
        deleteBtn.textContent = '×';
        deleteBtn.onclick = (e) => {
            e.preventDefault();
            deleteLink(index);
        };
        
        linkBtn.appendChild(deleteBtn);
        linksGrid.appendChild(linkBtn);
    });
}

function addLink() {
    const nameInput = document.getElementById('linkName');
    const urlInput = document.getElementById('linkUrl');
    const name = nameInput.value.trim();
    let url = urlInput.value.trim();
    
    if (name && url) {
        // Add https:// if not present
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        
        links.push({ name, url });
        saveLinks();
        renderLinks();
        nameInput.value = '';
        urlInput.value = '';
    }
}

function deleteLink(index) {
    if (confirm('Delete this link?')) {
        links.splice(index, 1);
        saveLinks();
        renderLinks();
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Name input
    const nameInput = document.getElementById('nameInput');
    nameInput.value = userName;
    nameInput.addEventListener('change', function() {
        userName = this.value.trim();
        localStorage.setItem('userName', userName);
        updateGreeting();
    });
    
    // Timer duration
    const timerDuration = document.getElementById('timerDuration');
    timerDuration.value = pomodoroTime;
    timerDuration.addEventListener('change', function() {
        const minutes = parseInt(this.value);
        if (minutes >= 1 && minutes <= 60) {
            pomodoroTime = minutes;
            localStorage.setItem('pomodoroTime', pomodoroTime);
            resetTimer();
        } else {
            alert('Please enter a number between 1 and 60');
            this.value = pomodoroTime;
        }
    });
    
    document.getElementById('addTaskBtn').addEventListener('click', addTodo);
    document.getElementById('taskInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });

    document.getElementById('startBtn').addEventListener('click', startTimer);
    document.getElementById('stopBtn').addEventListener('click', stopTimer);
    document.getElementById('resetBtn').addEventListener('click', resetTimer);

    document.getElementById('addLinkBtn').addEventListener('click', addLink);

    document.getElementById('darkModeBtn').addEventListener('click', toggleDarkMode);
    document.getElementById('sortActive').addEventListener('click', () => sortTodos('active'));

    // Initialize
    updateGreeting();
    updateDateTime();
    setInterval(updateDateTime, 1000);
    renderTodos();
    renderLinks();
    updateTimerDisplay();
});
