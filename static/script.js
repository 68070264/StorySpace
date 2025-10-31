const openBtns = document.querySelectorAll('.clickable-image, .hotspot');
const closeBtns = document.querySelectorAll('.close-button');
const modals = document.querySelectorAll('.modal');

function closeAllModals() {
  modals.forEach(m => {
    m.style.display = 'none';
  });
  document.body.style.overflow = '';
}

function openModalFrom(button) {
  closeAllModals();

  const modalId = button.dataset.modalTarget;
  const contentUrl = button.dataset.contentUrl;
  const modal = document.getElementById(modalId);
  if (!modal)return;
  const body = modal.querySelector('.modal-body-content');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  if (body) body.innerHTML = '<p>Loading...</p>';

  if (contentUrl && body) {
    fetch(contentUrl, { headers: { 'X-Requested-With': 'fetch' } })
      .then(r => r.text())
      .then(html => {
        
        // 1. ฉีด HTML (เหมือนเดิม)
        body.innerHTML = html;
        
        // --- 🌟🌟🌟 นี่คือส่วนที่ขาดหายไป 🌟🌟🌟 ---
        // 2. เรียก "กล่องเครื่องมือ" ของ To-Do List มาทำงาน
        
        if (modalId === 'todoModal') {
            if (window.initTodoApp) {
                console.log("script.js: Calling window.initTodoApp()...");
                window.initTodoApp(); // สั่งให้ติดตั้งปุ่ม!
            } else {
                console.error("script.js: FATAL ERROR! 'todo.js' did not load or initTodoApp is not defined.");
            }
        }
        if (modalId === 'clockModal') {
          if (window.initTimerApp) {
            console.log("script.js: initTimerApp(body)");
            window.initTimerApp(body);             // ส่ง root ของ modal เข้าไป
          } else {
            console.error("timer.js ยังไม่โหลด หรือ initTimerApp ยังไม่ประกาศ");
          }
        }
      })
      .catch(err => {
        // (โค้ด catch error เหมือนเดิม)
      });
  }

}

openBtns.forEach(btn => btn.addEventListener('click', () => openModalFrom(btn)));

closeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const modal = btn.closest('.modal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  });
});

window.addEventListener('click', e => {
  if (e.target.classList.contains('modal')) {
    e.target.style.display = 'none';
    document.body.style.overflow = '';
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeAllModals();
});

window.addEventListener('DOMContentLoaded', () => {
    modals.forEach(m => {
      m.style.display = 'none';          // ซ่อน modal ทั้งหมด
      m.classList.remove('show', 'hide'); // ล้างคลาสที่อาจเปิดค้าง
    });
    document.body.style.overflow = '';   // คืน scroll ปกติ
  });
  

// ✨ เพิ่มเอฟเฟกต์ hover ให้ hotspot เห็นง่าย
/*document.querySelectorAll('.hotspot').forEach(hs => {
  hs.addEventListener('mouseenter', () => {
    hs.style.outline = '2px solid rgba(255,255,255,0.7)';
  });
  hs.addEventListener('mouseleave', () => {
    hs.style.outline = 'none';
  });
});*/
