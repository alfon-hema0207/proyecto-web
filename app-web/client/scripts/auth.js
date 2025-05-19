// client/scripts/auth.js
document.getElementById('loginForm')?.addEventListener('submit', async function(e) {
  e.preventDefault();

  const correo = document.getElementById('correo').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('http://localhost/app-web/server/routes/usuarioRoutes.php?action=login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ correo, password }),
    });

    const data = await response.json();
    const mensaje = document.getElementById('mensaje');

    if (data.success) {
      mensaje.textContent = `¡Bienvenido, ${data.usuario.nombre}!`;
      mensaje.className = 'mensaje success';
      
      // Redirigir según el rol
      setTimeout(() => {
        if (data.usuario.rol === 'admin') {
          window.location.href = 'productos.html';
        } else {
          window.location.href = 'index.html';
        }
      }, 1500);
    } else {
      mensaje.textContent = data.mensaje || 'Error en el login';
      mensaje.className = 'mensaje error';
    }
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('mensaje').textContent = 'Error de conexión';
    document.getElementById('mensaje').className = 'mensaje error';
  }
});

// Función para cerrar sesión (mejorada)
document.addEventListener('DOMContentLoaded', function() {
  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
      logoutLink.addEventListener('click', async function(e) {
          e.preventDefault();
          
          try {
              const response = await fetch('http://localhost/app-web/server/routes/usuarioRoutes.php?action=logout', {
                  method: 'POST',
                  credentials: 'include',
                  headers: {
                      'Content-Type': 'application/json'
                  }
              });

              const data = await response.json();
              
              if (data.success) {
                  // Redirigir a login.html tras cerrar sesión
                  window.location.href = '/app-web/client/login.html';  // ← Cambio clave aquí
              } else {
                  console.error('Error al cerrar sesión:', data.mensaje || 'Error desconocido');
                  // Redirigir igualmente para limpiar el estado
                  window.location.href = '/app-web/client/login.html';
              }
          } catch (error) {
              console.error('Error:', error);
              // Redirigir incluso si hay error
              window.location.href = '/app-web/client/login.html';
          }
      });
  }
});