
const openBtns = document.querySelectorAll('.clickable-image');
const closeBtns = document.querySelectorAll('.close-button');
const modals = document.querySelectorAll('.modal');

function closeAllmodals() {
  modals.forEach(modal => {
    modal.style.display = 'none';
  });
}

openBtns.forEach(button => {
    button.addEventListener('click', () => {
      closeAllmodals();
        const modalId = button.dataset.modalTarget;
        const modalToOpen = document.getElementById(modalId);
        
        if (modalToOpen) {
            modalToOpen.style.display = 'block';
        }
    });
});

closeBtns.forEach(button => {
    button.addEventListener('click', () => {
        const modalToClose = button.closest('.modal');
        if (modalToClose) {
            modalToClose.style.display = 'none';
        }
    });
});

window.addEventListener('click', event => {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
});