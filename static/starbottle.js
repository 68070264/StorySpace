// static/starMemory.js (ฉบับอัปเกรด "2 ตู้เซฟ")

// 🌟 1. เรามี "กุญแจ" 2 ดอก
/*
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
}; */

function initBottleApp(rootContainer) {
    console.log("initBottleApp() is called!");
  
    const container = rootContainer
      ? rootContainer.querySelector('#bottle-controller')
      : document.querySelector('#bottle-controller');
  
    if (!container) return;
  
    const btn = container.querySelector('#getQuoteBtn');
    const box = container.querySelector('#quoteBox');
  
    const quotes = [
      "You've done enough for today ♥●•٠",
      "Why don't you take a rest? You're great! ✿*ﾟ",
      "Every small step is an achievement *★.•",
      "Don't forget to give yourself a smile (≧▽≦)",
      "Rest if you're tired, but never stop believing in yourself ᕙ(^▿^ᕙ)",
      "The world always has wonderful things waiting for you :･ﾟ★",
      "You are your own best version ❤",
      "It's just a bad day! εїз",
      "Hang in there! (≧ o ≦)",
      "Don't worry. Everything will be fine! (ꈍᴗꈍ)",
      "I believe in you  +ﾟ*｡",
      "The best is yet to come (◡‿◡✿)",
      "Keep going, you're closer than you think ୧ʕ•̀ᴥ•́ʔ୨",
      "Chin up, everything's gonna be ok ( ˘ ³˘)♥",
      "Cheer up, stay strong, and be good I got your back always (ง︡'-'︠)ง",
      "Cheer up, Storms don't last forever ٩(◕‿◕｡)۶"
    ];
  
    btn.addEventListener('click', () => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      box.textContent = quotes[randomIndex];
    });
  }
  
  // ถ้าเปิดหน้าโดยตรง
  document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('#bottle-controller')) {
      initBottleApp();
    }
  });
  
  // export สำหรับ popup
  window.initBottleApp = initBottleApp;
  