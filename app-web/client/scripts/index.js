class ProductosApp {
    constructor() {
        this.init();
    }

    async init() {
        await this.cargarProductos();
        this.setupEventListeners();
    }

    async cargarProductos() {
        const loading = document.getElementById('loading');
        const container = document.getElementById('productos-container');
        const errorContainer = document.getElementById('error-container');
        
        loading.style.display = 'block';loading.innerHTML = '<div class="spinner"></div><p>Cargando productos...</p>';
        container.innerHTML = '';
        errorContainer.innerHTML = '';

        try {
            const response = await fetch('http://localhost/app-web/server/routes/productoRoutes.php', {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const { success, data, error } = await response.json();

            if (!success) {
                throw new Error(error || "Error al obtener productos");
            }

            if (data.length === 0) {
                container.innerHTML = '<p class="no-products">No hay productos disponibles</p>';
                return;
            }

            this.renderProductos(data);
        } catch (error) {
            console.error("Error:", error);
            errorContainer.innerHTML = `
                <div class="error">
                    <p>Error al cargar productos: ${error.message}</p>
                    <button onclick="window.location.reload()">Reintentar</button>
                </div>
            `;
        } finally {
            loading.style.display = 'none';
        }
    }

    renderProductos(productos) {
        const container = document.getElementById('productos-container');
        container.innerHTML = productos.map(producto => `
            <div class="producto-card" data-id="${producto.id}">
                <h3>${this.escapeHtml(producto.nombre)}</h3>
                <p class="price">$${parseFloat(producto.precio).toFixed(2)}</p>
                ${producto.descripcion ? `<p class="description">${this.escapeHtml(producto.descripcion)}</p>` : ''}
            </div>
        `).join('');
    }

    setupEventListeners() {
        document.getElementById('btnAddProduct').addEventListener('click', () => {
            window.location.href = 'productos.html';
        });

        document.getElementById('btnLogout').addEventListener('click', async () => {
            try {
                const response = await fetch('http://localhost/app-web/server/routes/usuarioRoutes.php?action=logout', {
                    method: 'POST',
                    credentials: 'include'
                });

                if (response.ok) {
                    window.location.href = 'login.html';
                } else {
                    alert('Error al cerrar sesión');
                }
            } catch (error) {
                console.error("Error:", error);
                alert('Error de conexión');
            }
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new ProductosApp();
});