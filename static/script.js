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

  const box = modal.querySelector('.modal-content');
  const body = modal.querySelector('.modal-body-content');

  // เปิดฉากหลัง + กล่องทันที (ไม่ต้อง animate)
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  if (body) body.innerHTML = '<p>Loading...</p>';

  if (contentUrl && body) {
    fetch(contentUrl, { headers: { 'X-Requested-With': 'fetch' } })
      .then(r => {
        if (!r.ok) throw new Error('bad response');
        return r.text();
      })
      .then(html => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const content = doc.querySelector('.content');
        body.innerHTML = content ? content.innerHTML : doc.body.innerHTML;
      })
      .catch(err => {
        console.error('Failed to fetch modal content:', err);
        body.innerHTML = '<p>Error loading content. Please try again.</p>';
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

// ✨ เพิ่มเอฟเฟกต์ hover ให้ hotspot เห็นง่าย
/*document.querySelectorAll('.hotspot').forEach(hs => {
  hs.addEventListener('mouseenter', () => {
    hs.style.outline = '2px solid rgba(255,255,255,0.7)';
  });
  hs.addEventListener('mouseleave', () => {
    hs.style.outline = 'none';
  });
});*/
