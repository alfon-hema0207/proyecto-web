document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const comentario = document.getElementById('comentario').value;
    
    // Validación básica
    if (!email.includes('@') || email.length < 5) {
        showModal('Error', 'Por favor ingresa un correo electrónico válido');
        return;
    }
    
    if (comentario.length < 10) {
        showModal('Error', 'El comentario debe tener al menos 10 caracteres');
        return;
    }
    
    showModal('Éxito', 'Tu mensaje ha sido enviado correctamente');
    this.reset();
});

function showModal(title, message) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <h2>${title}</h2>
            <p>${message}</p>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    });
    
    setTimeout(() => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }, 3000);
}