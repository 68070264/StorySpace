const openBtns = document.querySelectorAll('.clickable-image, .hotspot');
const closeBtns = document.querySelectorAll('.close-button');
const modals = document.querySelectorAll('.modal');

function closeAllModals() {
  modals.forEach(m => m.style.display = 'none');
  document.body.style.overflow = '';
}

function openModalFrom(button) {
  closeAllModals();

  const modalId = button.dataset.modalTarget;
  const contentUrl = button.dataset.contentUrl;
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  const body = modal.querySelector('.modal-body-content');
  if (body) body.innerHTML = '<p>Loading...</p>';

  if (contentUrl && body) {
    fetch(contentUrl, { headers: { 'X-Requested-With': 'fetch' } })
      .then(r => r.text())
      .then(html => {
        body.innerHTML = html;

        // To-Do
        if (modalId === 'todoModal' && window.initTodoApp) {
          window.initTodoApp();
        }

        // Timer
        if (modalId === 'clockModal' && window.initTimerApp) {
          const inner = modal.querySelector('.modal-inner');
          window.initTimerApp(inner || body);
        }

        // Bottle
        if (modalId === 'bottleModal' && window.initBottleApp) {
          window.initBottleApp(body);

          // ✅ รอให้เนื้อหาโหลดเสร็จแล้วค่อย bind ปุ่มปิด
          setTimeout(() => {
            const closeBtn = body.querySelector('.close-button');
            if (closeBtn) {
              closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
                document.body.style.overflow = '';
              });
            }
          }, 100);
        }


        // Forecast
        if (modalId === 'forecastModal' && window.initForecastApp) {
          window.initForecastApp(body);
        }
      })
      .catch(err => {
        console.error('Error loading content:', err);
        if (body) body.innerHTML = '<p style="color:red;">Failed to load content.</p>';
      });
  }
}

// Event listeners
openBtns.forEach(btn => btn.addEventListener('click', () => openModalFrom(btn)));
closeBtns.forEach(btn => btn.addEventListener('click', () => {
  const modal = btn.closest('.modal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}));

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