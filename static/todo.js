function initTodoApp() {

    console.log("initTodoApp() is called! (Calling starMemory...)");

    const modalBody = document.querySelector('#todoModal .modal-body-content');
    if (!modalBody) { /* ... (error) ... */ return; }

    const controller = modalBody.querySelector('#todo-controller');
    const taskInput = modalBody.querySelector('#task-input');
    const taskList = modalBody.querySelector('#task-list');
    const progressBar = modalBody.querySelector('#progress-bar');
    const clearBtn = modalBody.querySelector('#clear-completed-btn');

    if (!controller || !taskInput || !taskList || !progressBar || !clearBtn) {
        console.error("initTodoApp: Missing one or more key elements");
        return;
    }

    let tasks = [];
    const STORAGE_KEY = 'myStorySpace_ActiveTasks';

    // ฟังก์ชัน add itemTodo
    function render() {
        console.log("Rendering tasks...", tasks);
        taskList.innerHTML = '';
        if (tasks.length === 0) {
            taskList.innerHTML = '<li>No tasks yet. Add one!</li>';
        }
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.dataset.id = task.id;
            if (task.completed) {
                li.classList.add('completed');
            }
            li.innerHTML = `
                <span class="todo-text" data-action="TOGGLE_TASK" style="cursor: pointer;">${task.name}</span>
            `;
            taskList.appendChild(li);
        });
        updateProgressBar();
    }

    // ฟังก์ชัน updateProgressBar
    function updateProgressBar() {
        const totalTasks = tasks.length;
        if (totalTasks === 0) {
            progressBar.style.width = '0%';
            return;
        }
        // นับเฉพาะtaskที่เสร็จแล้ว
        const completedTasks = tasks.filter(task => task.completed).length;

        // คำนวณเปอร์เซ็นต์
        const percentage = (completedTasks / totalTasks) * 100;

        // สั่งให้ CSS เปลี่ยนความกว้าง
        progressBar.style.width = percentage + '%';
        console.log(`Progress: ${completedTasks}/${totalTasks} (${percentage}%)`);
    }

    function saveTasks() {
        console.log("TodoApp: Saving tasks (standalone)...", tasks);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasksFromStorage = localStorage.getItem(STORAGE_KEY);
        if (tasksFromStorage) {
            tasks = JSON.parse(tasksFromStorage);
            console.log("TodoApp: Loaded tasks (standalone):", tasks);
        }
    }

    // ฟังก์ชัน(เพิ่ม/ลบ/ติ๊ก/ล้าง)
    function addTodoItem() {
        const taskName = taskInput.value.trim();
        if (taskName === '') return;
        const newTask = { id: Date.now(), name: taskName, completed: false };

        tasks.push(newTask);
        saveTasks();
        render();
        taskInput.value = '';
    }

    // ฟังก์ชัน toggleTaskComplete
    function toggleTaskComplete(taskId) {
        const task = tasks.find(task => task.id.toString() === taskId);
        if (task) {
            task.completed = !task.completed;
            saveTasks();
            render();
        }
    }

    // ฟังก์ชัน clearCompletedTasks
    function clearCompletedTasks() {
        if (confirm('คุณต้องการลบ Task ที่เสร็จแล้วทั้งหมดใช่หรือไม่?')) {
            tasks = tasks.filter(task => !task.completed);
            saveTasks();
            render();
        }
    }

    // เช็ค action item
    if (controller.dataset.listenerAttached === 'true') {
    } else {
        console.log("Attaching main event listener...");
        controller.addEventListener('click', (event) => {
            const action = event.target.dataset.action;
            if (!action) return;
            if (action === 'ADD_TASK') { addTodoItem(); }
            if (action === 'TOGGLE_TASK') { toggleTaskComplete(event.target.closest('li').dataset.id); }
            if (action === 'CLEAR_COMPLETED') { clearCompletedTasks(); }
        });
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addTodoItem(); // 🌟 ถ้ากด 'Enter' ➡ ให้เรียก "Add Task"
            }
        });
        controller.dataset.listenerAttached = 'true';
    }

    // โหลดข้อมูล
    loadTasks();
    render();

}

// ส่งออก
window.initTodoApp = initTodoApp;
