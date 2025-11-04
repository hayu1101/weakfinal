 document.addEventListener('DOMContentLoaded', function() {
            const taskInput = document.getElementById('taskInput');
            const addBtn = document.getElementById('addBtn');
            const taskList = document.getElementById('taskList');
            const filterBtns = document.querySelectorAll('.filter-btn');
            const totalTasksSpan = document.getElementById('totalTasks');
            const completedTasksSpan = document.getElementById('completedTasks');
            const deleteModal = document.getElementById('deleteModal');
            const confirmDeleteBtn = document.getElementById('confirmDelete');
            const cancelDeleteBtn = document.getElementById('cancelDelete');
            let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            let currentFilter = 'all';
            let taskToDelete = null;
            function init() {
                renderTasks();
                updateStats();
                addBtn.addEventListener('click', addTask);
                taskInput.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        addTask();
                    }
                });
                
                filterBtns.forEach(btn => {
                    btn.addEventListener('click', function() {
                        filterBtns.forEach(b => b.classList.remove('active'));
                        this.classList.add('active');

                        currentFilter = this.getAttribute('data-filter');
                        renderTasks();
                    });
                });
            
                confirmDeleteBtn.addEventListener('click', confirmDelete);
                cancelDeleteBtn.addEventListener('click', closeModal);
                deleteModal.addEventListener('click', function(e) {
                    if (e.target === deleteModal) {
                        closeModal();
                    }
                });
            }
            
            function addTask() {
                const taskText = taskInput.value.trim();
                
                if (taskText === '') {
                    alert('Please enter a task!');
                    return;
                }
                
                const newTask = {
                    id: Date.now(),
                    text: taskText,
                    completed: false
                };
                
                tasks.push(newTask);
                saveTasks();
                renderTasks();
                updateStats();
        
                taskInput.value = '';
                taskInput.focus();
            }
            function toggleTask(id) {
                tasks = tasks.map(task => {
                    if (task.id === id) {
                        return { ...task, completed: !task.completed };
                    }
                    return task;
                });
                
                saveTasks();
                renderTasks();
                updateStats();
            }
            function showDeleteModal(id) {
                taskToDelete = id;
                deleteModal.style.display = 'flex';
            }
            
            function confirmDelete() {
                if (taskToDelete) {
                    tasks = tasks.filter(task => task.id !== taskToDelete);
                    saveTasks();
                    renderTasks();
                    updateStats();
                    closeModal();
                }
            }
    
            function closeModal() {
                deleteModal.style.display = 'none';
                taskToDelete = null;
            }
            
            function renderTasks() {
                let filteredTasks = tasks;
                if (currentFilter === 'active') {
                    filteredTasks = tasks.filter(task => !task.completed);
                } else if (currentFilter === 'completed') {
                    filteredTasks = tasks.filter(task => task.completed);
                }
            
                taskList.innerHTML = '';
            
                if (filteredTasks.length === 0) {
                    const emptyState = document.createElement('div');
                    emptyState.className = 'empty-state';
                    
                    if (currentFilter === 'all') {
                        emptyState.textContent = 'No tasks yet. Add a task to get started!';
                    } else if (currentFilter === 'active') {
                        emptyState.textContent = 'No active tasks. Great job!';
                    } else {
                        emptyState.textContent = 'No completed tasks yet.';
                    }
                    
                    taskList.appendChild(emptyState);
                    return;
                }
                filteredTasks.forEach(task => {
                    const taskItem = document.createElement('li');
                    taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
                    
                    taskItem.innerHTML = `
                        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                        <span class="task-text">${task.text}</span>
                        <button class="delete-btn">×</button>
                    `;
                    const checkbox = taskItem.querySelector('.task-checkbox');
                    checkbox.addEventListener('change', () => toggleTask(task.id));
                    
                    const deleteBtn = taskItem.querySelector('.delete-btn');
                    deleteBtn.addEventListener('click', () => showDeleteModal(task.id));
                    
                    taskList.appendChild(taskItem);
                });
            }
            
            function updateStats() {
                const totalTasks = tasks.length;
                const completedTasks = tasks.filter(task => task.completed).length;
                
                totalTasksSpan.textContent = `Total: ${totalTasks}`;
                completedTasksSpan.textContent = `Completed: ${completedTasks}`;
            }
            function saveTasks() {
                localStorage.setItem('tasks', JSON.stringify(tasks));
            }
            init();
        });
    
