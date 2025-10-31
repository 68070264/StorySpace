function initTodoApp() {
    
    console.log("initTodoApp() is called! (Calling starMemory...)");

    // --- 1. ค้นหา Element หลัก (เหมือนเดิม) ---
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

    // --- 2. "สมอง" ของแอป (เปลี่ยนวิธีโหลด) ---
    // 🌟🌟🌟 เราไม่ได้ใช้ Array ว่างเปล่าอีกต่อไป 🌟🌟🌟
    // 🌟🌟🌟 เราเรียก "ตู้เซฟ" มาโหลดข้อมูลเริ่มต้น 🌟🌟🌟
    let tasks = []; // 🌟 (1) กลับไปใช้ Array ว่างเปล่า
    const STORAGE_KEY = 'myStorySpace_ActiveTasks'; // 🌟 (2) ประกาศ "กุญแจ" ของตัวเอง

    // --- 3. ฟังก์ชัน "ความจำ" (Save/Load/Render) ---

    // (ฟังก์ชัน render() เหมือนเดิม 100%)
    function render() {
        // ... (โค้ด render() ทั้งหมดของคุณเหมือนเดิมเป๊ะ) ...
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

    // 🌟🌟🌟 "ลบ" ฟังก์ชัน saveTasks() และ loadTasks() เก่าทิ้ง 🌟🌟🌟
    // (เพราะมันย้ายไปอยู่ใน starMemory.js แล้ว)
    
    // (ฟังก์ชัน updateProgressBar เหมือนเดิม 100%)
    function updateProgressBar() { 
        // 🌟🌟🌟 (1) "แปะ" Logic ที่ถูกต้องทับลงไป 🌟🌟🌟
        const totalTasks = tasks.length;
        if (totalTasks === 0) {
            progressBar.style.width = '0%';
            return;
    }

        // 1. นับเฉพาะ task ที่ "เสร็จแล้ว"
        const completedTasks = tasks.filter(task => task.completed).length;

        // 2. คำนวณเปอร์เซ็นต์
        const percentage = (completedTasks / totalTasks) * 100;

        // 3. สั่งให้ CSS เปลี่ยนความกว้าง
        progressBar.style.width = percentage + '%';
        console.log(`Progress: ${completedTasks}/${totalTasks} (${percentage}%)`);
        }


     // 🌟🌟🌟 (3) "เพิ่ม" 2 ฟังก์ชันนี้กลับเข้ามา 🌟🌟🌟
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

    // --- 4. ฟังก์ชัน "จัดการ" (เพิ่ม/ลบ/ติ๊ก/ล้าง) ---

    // (ฟังก์ชัน addTodoItem อัปเกรด)
    function addTodoItem() {
        const taskName = taskInput.value.trim();
        if (taskName === '') return;
        const newTask = { id: Date.now(), name: taskName, completed: false };
        
        tasks.push(newTask); // 1. เพิ่มเข้า "สมอง" (Array)
        
        // 🌟 2. เรียก "ตู้เซฟ" ให้มาเซฟ "สมอง" ทั้งก้อน
        saveTasks();
        
        render(); // 3. วาดใหม่
        taskInput.value = '';
    }
    
    // (ฟังก์ชัน deleteTodoItem อัปเกรด)
    //function deleteTodoItem(taskId) {
        //tasks = tasks.filter(task => task.id.toString() !== taskId); // 1. กรอง "สมอง"
        
        // 🌟 2. เรียก "ตู้เซฟ" ให้มาเซฟ
        //window.starMemory.saveTasks(tasks);
        
        //render(); // 3. วาดใหม่
    //}
    
    // (ฟังก์ชัน toggleTaskComplete อัปเกรด)
    function toggleTaskComplete(taskId) {
        const task = tasks.find(task => task.id.toString() === taskId);
        if (task) {
            task.completed = !task.completed; // 1. พลิก "สมอง"
            
            // 🌟 2. เรียก "ตู้เซฟ" ให้มาเซฟ
            saveTasks();
            
            render(); // 3. วาดใหม่
        }
    }
    
    // (ฟังก์ชัน clearCompletedTasks อัปเกรด)
    function clearCompletedTasks() {
        if (confirm('คุณต้องการลบ Task ที่เสร็จแล้วทั้งหมดใช่หรือไม่?')) {
            tasks = tasks.filter(task => !task.completed); // 1. กรอง "สมอง"
            
            // 🌟 2. เรียก "ตู้เซฟ" ให้มาเซฟ
            saveTasks();
            
            render(); // 3. วาดใหม่
        }
    }

    // 🌟🌟🌟 5. "เพิ่ม" ฟังก์ชันใหม่: "Save Session" 🌟🌟🌟
    // นี่คือฟังก์ชันที่ "ส่ง Payload"
    // function saveSessionToBottle() {
    //     if (tasks.length === 0) {
    //         alert("ไม่มี Task ให้บันทึก");
    //         return;
    //     }
        
    //     if (confirm('คุณต้องการ "บันทึก" Task ทั้งหมดนี้\n(ทั้งที่เสร็จและยังไม่เสร็จ) ลงในขวดโหลใช่หรือไม่?')) {
            
    //         // 1. "Payload" คือ "สมอง" (Array) ทั้งก้อน
    //         const payload = tasks;
            
    //         // 2. "ส่ง Payload" ➡ โยน Task ทั้งหมดให้ "ตู้เซฟ" ที่ 2
    //         window.starMemory.archiveTasks(payload);
            
    //         alert('บันทึก Task ทั้งหมดลงขวดโหลเรียบร้อย!');
            
            // 3. (ทางเลือก) คุณอยากล้าง Task ปัจจุบันทิ้งไหม?
            // (ถ้าอยากล้าง ให้ uncomment 3 บรรทัดล่างนี้)
            // tasks = []; 
            // window.starMemory.saveActiveTasks(tasks);
    //         // render();
    //     }
    // }

    // --- 5. "หูฟัง" (Event Listeners) (เหมือนเดิม 100%) ---
    if (controller.dataset.listenerAttached === 'true') {
        // ... (เหมือนเดิม)
    } else {
        console.log("Attaching main event listener...");
        controller.addEventListener('click', (event) => {
            const action = event.target.dataset.action;
            if (!action) return; 
            if (action === 'ADD_TASK') { addTodoItem(); }
            if (action === 'TOGGLE_TASK') { toggleTaskComplete(event.target.closest('li').dataset.id); }
            // if (action === 'DELETE_TASK') {
            //     if (confirm('...')) { deleteTodoItem(event.target.closest('li').dataset.id); }
            // }
            if (action === 'CLEAR_COMPLETED') { clearCompletedTasks(); }
        });
        taskInput.addEventListener('keypress', (e) => { /* ... (เหมือนเดิม) ... */ });
        controller.dataset.listenerAttached = 'true';
    }
    
    // --- 6. โหลดข้อมูลครั้งแรก ---
    // (เราไม่ต้อง "load" อีกแล้ว เพราะเรา "load" มาตั้งแต่บรรทัดแรก)
    loadTasks();
    render(); // 🌟 วาดของที่เจอ

}



// --- "ส่งออก" (Export) (เหมือนเดิม) ---
window.initTodoApp = initTodoApp;