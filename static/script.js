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
  if (!modal) return;

  const body = modal.querySelector('.modal-body-content');

  // เปิด popup ทันที
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  // ✅ โหลดหน้า timer/todo/bottle ด้วย iframe (จะรัน JS ภายในได้ปกติ)
  body.innerHTML = `
    <iframe 
      src="${contentUrl}" 
      style="
        width: 100%;
        height: 80vh;
        border: none;
        border-radius: 12px;
      ">
    </iframe>
  `;
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
    m.style.display = 'none';
    m.classList.remove('show', 'hide');
  });
  document.body.style.overflow = '';
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
