// client/scripts/register.js
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const usuario = {
        nombre: document.getElementById('nombre').value,
        correo: document.getElementById('correo').value,
        password: document.getElementById('password').value
    };

    // Validación básica frontend
    if (usuario.password.length < 8) {
        alert('La contraseña debe tener al menos 8 caracteres');
        return;
    }

    try {
        const response = await fetch('http://localhost/app-web/server/routes/usuarioRoutes.php?action=register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuario)
        });

        const data = await response.json();
        const mensaje = document.getElementById('mensaje');
        
        if (response.ok) {
            mensaje.textContent = data.mensaje;
            mensaje.style.color = 'green';
            setTimeout(() => window.location.href = 'login.html', 1500);
        } else {
            mensaje.textContent = data.mensaje;
            mensaje.style.color = 'red';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('mensaje').textContent = 'Error de conexión';
    }
});