class VentaApp {
    constructor() {
        this.carrito = [];
        this.total = 0;
        this.init();
    }
    
    async init() {
        await this.cargarProductos();
        this.setupEventListeners();
    }
    
    async cargarProductos() {
        try {
            const response = await fetch('http://localhost/app-web/server/routes/productoRoutes.php');
            const { data } = await response.json();
            
            const container = document.querySelector('.productos-grid');
            container.innerHTML = data.map(producto => `
                <div class="producto-checkout" data-id="${producto.id}">
                    <div class="producto-info">
                        <h3>${producto.nombre}</h3>
                        <p class="price">$${parseFloat(producto.precio).toFixed(2)}</p>
                        ${producto.descripcion ? `<p class="producto-desc">${producto.descripcion}</p>` : ''}
                    </div>
                    <div class="producto-actions">
                        <input type="checkbox" class="producto-check" id="producto-${producto.id}">
                        <label for="producto-${producto.id}" class="check-label">Seleccionar</label>
                        <input type="number" class="producto-cantidad" min="1" value="1" disabled>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error:', error);
            showModal('Error', 'No se pudieron cargar los productos');
        }
    }
    
    setupEventListeners() {
        // Checkbox de productos
        document.querySelector('.productos-grid').addEventListener('change', (e) => {
            const target = e.target;
            
            if (target.classList.contains('producto-check')) {
                const productoEl = target.closest('.producto-checkout');
                const id = productoEl.dataset.id;
                const nombre = productoEl.querySelector('h3').textContent;
                const precio = parseFloat(productoEl.querySelector('.price').textContent.replace('$', ''));
                const cantidadInput = productoEl.querySelector('.producto-cantidad');
                const cantidad = parseInt(cantidadInput.value);
                
                // Habilitar/deshabilitar cantidad según checkbox
                cantidadInput.disabled = !target.checked;
                
                if (target.checked) {
                    this.agregarAlCarrito(id, nombre, precio, cantidad);
                } else {
                    this.removerDelCarrito(id);
                }
                
                this.actualizarCarritoUI();
            }
        });
        
        // Cambiar cantidad
        document.querySelector('.productos-grid').addEventListener('input', (e) => {
            if (e.target.classList.contains('producto-cantidad')) {
                const productoEl = e.target.closest('.producto-checkout');
                const id = productoEl.dataset.id;
                const cantidad = parseInt(e.target.value);
                
                const item = this.carrito.find(item => item.id === id);
                if (item) {
                    item.cantidad = cantidad;
                    item.subtotal = item.precio * cantidad;
                    this.calcularTotal();
                    this.actualizarCarritoUI();
                }
            }
        });
        
        // Botón carrito
        document.getElementById('btnCarrito').addEventListener('click', () => {
            document.querySelector('.checkout-sidebar').classList.toggle('active');
        });
        
        // Cerrar carrito
        document.querySelector('.checkout-close').addEventListener('click', () => {
            document.querySelector('.checkout-sidebar').classList.remove('active');
        });
        
        // Botón comprar
        document.getElementById('btnComprar').addEventListener('click', (e) => {
            e.preventDefault();
            
            if (this.carrito.length === 0) {
                showModal('Error', 'Por favor selecciona al menos un producto');
                return;
            }
            
            if (!document.getElementById('terms').checked) {
                showModal('Error', 'Debes aceptar los términos y condiciones');
                return;
            }
            
            showModal('Éxito', 'Compra realizada con éxito!');
            this.carrito = [];
            this.actualizarCarritoUI();
            document.querySelectorAll('.producto-check').forEach(checkbox => {
                checkbox.checked = false;
            });
            document.querySelectorAll('.producto-cantidad').forEach(input => {
                input.disabled = true;
            });
        });
        
        // Botón cancelar
        document.getElementById('btnCancelar').addEventListener('click', (e) => {
            e.preventDefault();
            this.carrito = [];
            this.actualizarCarritoUI();
            document.querySelectorAll('.producto-check').forEach(checkbox => {
                checkbox.checked = false;
            });
            document.querySelectorAll('.producto-cantidad').forEach(input => {
                input.disabled = true;
            });
            document.getElementById('terms').checked = false;
        });
    }
    
    agregarAlCarrito(id, nombre, precio, cantidad) {
        this.carrito.push({
            id,
            nombre,
            precio,
            cantidad,
            subtotal: precio * cantidad
        });
        this.calcularTotal();
    }
    
    removerDelCarrito(id) {
        this.carrito = this.carrito.filter(item => item.id !== id);
        this.calcularTotal();
    }
    
    calcularTotal() {
        this.total = this.carrito.reduce((sum, item) => sum + item.subtotal, 0);
    }
    
    actualizarCarritoUI() {
        const container = document.querySelector('.checkout-items');
        container.innerHTML = this.carrito.map(item => `
            <div class="checkout-item" data-id="${item.id}">
                <span>${item.nombre} (x${item.cantidad})</span>
                <span>$${item.subtotal.toFixed(2)}</span>
            </div>
        `).join('');
        
        document.getElementById('total').textContent = this.total.toFixed(2);
        document.querySelector('.carrito-count').textContent = this.carrito.length;
    }
}

// Función para mostrar modal
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

// Iniciar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    new VentaApp();
});