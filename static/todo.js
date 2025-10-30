// static/todo.js (ฉบับมี "ความจำ" - localStorage)

function initTodoApp() {
    
    console.log("initTodoApp() is called! (localStorage mode)");

    // --- 1. ค้นหา Element หลัก ---
    const modalBody = document.querySelector('#todoModal .modal-body-content');
    if (!modalBody) { /* ... (error) ... */ return; }

    const controller = modalBody.querySelector('#todo-controller');
    const taskInput = modalBody.querySelector('#task-input');
    const taskList = modalBody.querySelector('#task-list');

    if (!controller || !taskInput || !taskList) { /* ... (error) ... */ return; }

    // --- 2. "สมอง" ของแอป: Array ที่เก็บ Task ทั้งหมด ---
    let tasks = []; // นี่คือ "ความจริง" (Single Source of Truth)
    const STORAGE_KEY = 'myStorySpaceTasks'; // ชื่อ "ตู้เซฟ" ของเรา

    // --- 3. ฟังก์ชัน "ความจำ" (Save/Load/Render) ---

    // ฟังก์ชัน "วาดหน้าจอ" 
    // (จะวาดใหม่ทั้งหมดโดยอิงจาก "สมอง" คือ Array 'tasks')
    function render() {
        console.log("Rendering tasks...", tasks);
        
        taskList.innerHTML = ''; // เคลียร์ของเก่าทิ้ง

        if (tasks.length === 0) {
            taskList.innerHTML = '<li>No tasks yet. Add one!</li>';
            return;
        }

        tasks.forEach(task => {
            const li = document.createElement('li');
            
            // 🌟 สำคัญ: เราเก็บ ID ไว้ใน data-id
            li.dataset.id = task.id; 
            
            // 🌟 เราใช้ task.name จาก "สมอง"
            li.innerHTML = `
                <span class_name="todo-text" data-action="DELETE_TASK" style="cursor: pointer;">${task.name}</span>
            `;
            taskList.appendChild(li);
        });
    }

    // ฟังก์ชัน "เซฟลงตู้เซฟ"
    function saveTasks() {
        console.log("Saving to localStorage...", tasks);
        // localStorage เก็บได้แค่ "ตัวหนังสือ" เราจึงต้องแปลง Array เป็น JSON string
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }

    // ฟังก์ชัน "โหลดจากตู้เซฟ"
    function loadTasks() {
        const tasksFromStorage = localStorage.getItem(STORAGE_KEY);
        if (tasksFromStorage) {
            // ถ้ามีของเก่า ➡ แปลง JSON string กลับเป็น Array แล้วยัดใส่ "สมอง"
            tasks = JSON.parse(tasksFromStorage);
            console.log("Loaded tasks from localStorage:", tasks);
        } else {
            console.log("No tasks found in storage.");
        }
    }

    // --- 4. ฟังก์ชัน "จัดการ" (เพิ่ม/ลบ) ---

    // ฟังก์ชันสำหรับ "เพิ่ม" ToDo
    function addTodoItem() {
        const taskName = taskInput.value.trim();
        if (taskName === '') return;

        // 1. สร้าง "วัตถุ" (Object) ของ Task ใหม่
        const newTask = {
            // เราใช้เวลา (มิลลิวินาที) เป็น ID เพื่อให้ไม่ซ้ำกัน
            id: Date.now(), 
            name: taskName,
            completed: false // (เผื่อไว้ใช้ในอนาคต)
        };

        // 2. เพิ่มเข้า "สมอง" (Array)
        tasks.push(newTask);
        
        // 3. เซฟ
        saveTasks();
        
        // 4. วาดใหม่
        render();

        taskInput.value = ''; // เคลียร์ช่อง input
    }
    
    // ฟังก์ชันสำหรับ "ลบ" ToDo
    function deleteTodoItem(taskId) {
        // 1. กรอง "สมอง" (Array) ➡ เอาเฉพาะ Task ที่ ID "ไม่ตรงกับ" ที่จะลบ
        tasks = tasks.filter(task => task.id.toString() !== taskId);
        
        // 2. เซฟ
        saveTasks();
        
        // 3. วาดใหม่
        render();
    }


    // --- 5. "หูฟัง" (Event Listeners) ---
    if (controller.dataset.listenerAttached === 'true') {
        console.log("Listeners already attached.");
    } else {
        console.log("Attaching main event listener...");
        
        controller.addEventListener('click', (event) => {
            const action = event.target.dataset.action;

            if (action === 'ADD_TASK') {
                addTodoItem(); // 🌟 เรียกฟังก์ชันใหม่
            }
            
            if (action === 'DELETE_TASK') {
                if (confirm('คุณต้องการลบ Task นี้ใช่หรือไม่?')) {
                    // 🌟 หา ID จาก <li> แล้วส่งไปให้ฟังก์ชันลบ
                    const li = event.target.closest('li');
                    deleteTodoItem(li.dataset.id); 
                }
            }
        });
        
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addTodoItem();
            }
        });
        
        controller.dataset.listenerAttached = 'true';
    }
    
    // --- 6. โหลดข้อมูลครั้งแรก ---
    loadTasks(); // 🌟 เปิดตู้เซฟ
    render();    // 🌟 วาดของที่เจอ

}

// --- "ส่งออก" (Export) ---
window.initTodoApp = initTodoApp;