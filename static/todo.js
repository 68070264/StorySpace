// static/todo.js (ฉบับอัปเกรด: "Save Session" mode ที่ถูกต้อง)

function initTodoApp() {
    
    console.log("initTodoApp() is called! (Save Session mode)");

    // --- 1. ค้นหา Element หลัก (เปลี่ยน clearBtn เป็น saveBtn) ---
    const modalBody = document.querySelector('#todoModal .modal-body-content');
    if (!modalBody) { /* ... (error) ... */ return; }

    const controller = modalBody.querySelector('#todo-controller');
    const taskInput = modalBody.querySelector('#task-input');
    const taskList = modalBody.querySelector('#task-list');
    const progressBar = modalBody.querySelector('#progress-bar');
    
    // 🌟 1. ค้นหาปุ่มใหม่ (ล่างขวา)
    const saveBtn = modalBody.querySelector('#save-to-bottle-btn'); // 🌟 (ต้องตรงกับ HTML)

    // 🌟 2. เพิ่ม saveBtn ใน if check
    if (!controller || !taskInput || !taskList || !progressBar || !saveBtn) {
         console.error("initTodoApp: Missing one or more key elements");
         return;
    }

    // --- 2. "สมอง" ของแอป (เรียก "ตู้เซฟ" ที่ถูกต้อง) ---
    // 🌟 3. เรียก "ตู้เซฟ" ที่ 1 (Active) 
    let tasks = window.starMemory.loadActiveTasks();

    // --- 3. ฟังก์ชัน "ความจำ" (Save/Load/Render) ---

    // 🌟 4. "แก้ไข" ฟังก์ชัน "วาดหน้าจอ" (ลบปุ่ม Delete [X])
    function render() {
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
            // (ลบ <button class="delete-btn"...> ออกจากตรงนี้)
            li.innerHTML = `
                <span class="todo-text" data-action="TOGGLE_TASK" style="cursor: pointer;">${task.name}</span>
            `;
            taskList.appendChild(li);
        });
        updateProgressBar();
    }
    
    // (ฟังก์ชัน updateProgressBar เหมือนเดิม)
    function updateProgressBar() {
        const totalTasks = tasks.length;
        if (totalTasks === 0) { progressBar.style.width = '0%'; return; }
        const completedTasks = tasks.filter(task => task.completed).length;
        const percentage = (completedTasks / totalTasks) * 100;
        progressBar.style.width = percentage + '%';
    }

    // --- 4. ฟังก์ชัน "จัดการ" (อัปเกรด) ---

    function addTodoItem() {
        const taskName = taskInput.value.trim();
        if (taskName === '') return;
        const newTask = { id: Date.now(), name: taskName, completed: false };
        tasks.push(newTask); 
        
        // 🌟 5. เซฟ "ตู้เซฟ" ที่ 1 (Active)
        window.starMemory.saveActiveTasks(tasks);
        
        render(); 
        taskInput.value = '';
    }
    
    function toggleTaskComplete(taskId) {
        const task = tasks.find(task => task.id.toString() === taskId);
        if (task) {
            task.completed = !task.completed; 
            
            // 🌟 6. เซฟ "ตู้เซฟ" ที่ 1 (Active)
            window.starMemory.saveActiveTasks(tasks); 
            
            render();
        }
    }
    
    // 🌟🌟🌟 7. "ลบ" deleteTodoItem() และ clearCompletedTasks() ทิ้ง 🌟🌟🌟
    
    // 🌟🌟🌟 8. "เพิ่ม" ฟังก์ชันใหม่: "Save Session" 🌟🌟🌟
    function saveSessionToBottle() {
        if (tasks.length === 0) {
            alert("ไม่มี Task ให้บันทึก");
            return;
        }
        
        if (confirm('คุณต้องการ "บันทึก" Task ทั้งหมดนี้\n(ทั้งที่เสร็จและยังไม่เสร็จ) ลงในขวดโหลใช่หรือไม่?')) {
            
            // 1. "Payload" คือ "สมอง" (Array) ทั้งก้อน
            const payload = tasks;
            
            // 2. "ส่ง Payload" ➡ โยน Task ทั้งหมดให้ "ตู้เซฟ" ที่ 2
            window.starMemory.archiveTasks(payload);
            
            alert('บันทึก Task ทั้งหมดลงขวดโหลเรียบร้อย!');
            
            // 3. (ทางเลือก) ล้าง Task ปัจจุบันทิ้ง
            tasks = []; 
            window.starMemory.saveActiveTasks(tasks);
            render();
        }
    }

    // --- 5. "หูฟัง" (Event Listeners) (อัปเกรด) ---
    if (controller.dataset.listenerAttached === 'true') { return; } 
    
    console.log("Attaching main event listener...");
    
    controller.addEventListener('click', (event) => {
        const action = event.target.dataset.action;
        if (!action) return; 

        if (action === 'ADD_TASK') { 
            addTodoItem(); 
        }
        if (action === 'TOGGLE_TASK') { 
            toggleTaskComplete(event.target.closest('li').dataset.id); 
        }
        
        // 🌟 9. เปลี่ยน Logic การฟัง (ลบ DELETE และ CLEAR)
        if (action === 'SAVE_TO_BOTTLE') { 
            saveSessionToBottle(); 
        }
    });
    
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') { 
            addTodoItem(); 
        }
    });
    
    controller.dataset.listenerAttached = 'true';
    
    // --- 6. โหลดข้อมูลครั้งแรก ---
    render();
}

// --- "ส่งออก" (Export) (เหมือนเดิม) ---
window.initTodoApp = initTodoApp;