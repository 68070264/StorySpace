// static/starMemory.js (ฉบับอัปเกรด "2 ตู้เซฟ")

// 🌟 1. เรามี "กุญแจ" 2 ดอก
const ACTIVE_KEY = 'myStorySpace_ActiveTasks';
const ARCHIVE_KEY = 'myStorySpace_ArchivedTasks';

// --- 1. ฟังก์ชัน "โหลดจากตู้เซฟ" ---
function loadTasksFromMemory() {
    const tasksFromStorage = localStorage.getItem(STORAGE_KEY);
    if (tasksFromStorage) {
        // แปลง JSON string กลับเป็น Array
        console.log("starMemory: Loaded tasks from localStorage.");
        return JSON.parse(tasksFromStorage);
    } else {
        // ถ้าไม่มีของ ➡ คืนค่าเป็น Array ว่างเปล่า
        console.log("starMemory: No tasks found. Returning empty array.");
        return [];
    }
}

// --- 2. ฟังก์ชัน "เซฟลงตู้เซฟ" ---
// (ฟังก์ชันนี้จะรับ "สมอง" (Array) ทั้งก้อนมาเซฟ)
function saveTasksToMemory(tasksArray) {
    console.log("starMemory: Saving tasks to localStorage...", tasksArray);
    // แปลง Array เป็น JSON string
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksArray));
}

// --- 4. "ส่งออก" (Export) ---
// (เราจะส่งออก "แพ็กเกจ" starMemory ที่มีฟังก์ชันใหม่)
window.starMemory = {
    loadTasks: loadTasksFromMemory,
    saveTasks: saveTasksToMemory
};