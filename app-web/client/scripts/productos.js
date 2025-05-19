document.getElementById('formProducto').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const producto = {
      nombre: document.getElementById('nombre').value,
      precio: parseFloat(document.getElementById('precio').value),
      descripcion: document.getElementById('descripcion').value
    };
  
    try {
      const response = await fetch('http://localhost/app-web/server/routes/productoRoutes.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(producto)
      });
      
      if (!response.ok) throw new Error('Error al guardar');
      
      alert('Producto guardado!');
      window.location.href = 'index.html';
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar el producto');
    }
  });