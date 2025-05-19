// Función para verificar el rol del usuario
async function checkUserRole() {
    try {
      const response = await fetch('http://localhost/app-web/server/routes/usuarioRoutes.php?action=check', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        return null;
      }
      
      const data = await response.json();
      return data.usuario?.rol || null;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }
  
  // Función para actualizar la UI según el rol
// Función para actualizar la UI según el rol (versión mejorada)
async function updateUIForRole() {
    try {
        const response = await fetch('http://localhost/app-web/server/routes/usuarioRoutes.php?action=check', {
            credentials: 'include'
        });
        
        if (!response.ok) throw new Error('Error en la verificación de sesión');
        
        const data = await response.json();
        
        // Mostrar/ocultar elementos de admin
        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.display = (data.authenticated && data.usuario?.rol === 'admin') ? 'block' : 'none';
        });
        
        // Manejar elementos de cuenta
        const loginItem = document.getElementById('login-item');
        const registerItem = document.getElementById('register-item');
        const logoutItem = document.getElementById('logout-item');
        const adminItem = document.getElementById('admin-item');
        
        if (data.authenticated) {
            if (loginItem) loginItem.style.display = 'none';
            if (registerItem) registerItem.style.display = 'none';
            if (logoutItem) logoutItem.style.display = 'block';
            if (adminItem) adminItem.style.display = data.usuario?.rol === 'admin' ? 'block' : 'none';
        } else {
            if (loginItem) loginItem.style.display = 'block';
            if (registerItem) registerItem.style.display = 'block';
            if (logoutItem) logoutItem.style.display = 'none';
            if (adminItem) adminItem.style.display = 'none';
        }
    } catch (error) {
        console.error('Error al actualizar UI:', error);
        // Por defecto mostrar opciones para no autenticados
        document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
        const logoutItem = document.getElementById('logout-item');
        if (logoutItem) logoutItem.style.display = 'none';
    }
}
  
  // Llamar a la función cuando la página cargue
  document.addEventListener('DOMContentLoaded', updateUIForRole);