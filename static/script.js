
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
        
        const contentUrl = button.dataset.contentUrl;

        if (contentUrl) {
            const modalBody = modalToOpen.querySelector('.modal-body-content');

            if (modalBody) {
                modalBody.innerHTML = '<p>Loading...</p>';
            }
            
            if (modalToOpen) {
                modalToOpen.style.display = 'block';
            }

            fetch(contentUrl)
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    return response.text();
                })
                .then(html => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const content = doc.querySelector('.content');
                    
                    if (modalBody) {
                        if (content) {
                            modalBody.innerHTML = content.innerHTML;
                        } else {
                            modalBody.innerHTML = doc.body.innerHTML;
                        }
                    }
                })
                .catch(error => {
                    console.error('Failed to fetch modal content:', error);
                    if (modalBody) {
                        modalBody.innerHTML = '<p>Error loading content. Please try again.</p>';
                    }
                });

        } else {
            if (modalToOpen) {
                modalToOpen.style.display = 'block';
            }
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