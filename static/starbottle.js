// static/starMemory.js (ฉบับอัปเกรด "2 ตู้เซฟ")

// 🌟 1. เรามี "กุญแจ" 2 ดอก
const ACTIVE_KEY = 'myStorySpace_ActiveTasks';
const ARCHIVE_KEY = 'myStorySpace_ArchivedTasks';

// --- "ตู้เซฟ" ที่ 1: Active Tasks ---

function loadActiveTasks() {
    const tasksFromStorage = localStorage.getItem(ACTIVE_KEY);
    // (ถ้าไม่มีของ ➡ คืนค่าเป็น Array ว่างเปล่า)
    return tasksFromStorage ? JSON.parse(tasksFromStorage) : [];
}

function saveActiveTasks(activeTasksArray) {
    console.log("starMemory: Saving ACTIVE tasks...", activeTasksArray);
    localStorage.setItem(ACTIVE_KEY, JSON.stringify(activeTasksArray));
}

// --- "ตู้เซฟ" ที่ 2: Archived Tasks ---

function loadArchivedTasks() {
    const tasksFromStorage = localStorage.getItem(ARCHIVE_KEY);
    // (ถ้าไม่มีของ ➡ คืนค่าเป็น Array ว่างเปล่า)
    return tasksFromStorage ? JSON.parse(tasksFromStorage) : [];
}

function saveArchivedTasks(archivedTasksArray) {
    console.log("starMemory: Saving ARCHIVED tasks...", archivedTasksArray);
    localStorage.setItem(ARCHIVE_KEY, JSON.stringify(archivedTasksArray));
}

// --- 🌟🌟🌟 3. ฟังก์ชัน "ย้ายของ" (ส่ง Payload) 🌟🌟🌟 ---
// นี่คือฟังก์ชันที่รับ "Payload" (tasksToArchive) จาก todo.js
function archiveTasks(tasksToArchive) {
    if (!tasksToArchive || tasksToArchive.length === 0) {
        return; // ไม่มีอะไรให้ย้าย
    }
    
    console.log("starMemory: Received payload to archive...", tasksToArchive);
    
    // 1. โหลด "ของเก่า" (ที่เคยเก็บไว้) จากตู้ Archive
    const currentArchive = loadArchivedTasks();
    
    // 2. "รวม" ของเก่า + ของใหม่ (Payload)
    const newArchive = currentArchive.concat(tasksToArchive);
    
    // 3. "เซฟ" ของที่รวมแล้ว กลับเข้าตู้ Archive
    saveArchivedTasks(newArchive);
}


// --- 4. "ส่งออก" (Export) ---
// (เราจะส่งออก "แพ็กเกจ" starMemory ที่มีฟังก์ชันใหม่)
window.starMemory = {
    loadActiveTasks: loadActiveTasks,
    saveActiveTasks: saveActiveTasks,
    loadArchivedTasks: loadArchivedTasks,
    archiveTasks: archiveTasks // 🌟 ฟังก์ชันใหม่
};