<?php
require_once __DIR__ . '/../models/Producto.php';

class ProductoController {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function obtenerTodos() {
        $producto = new Producto($this->conn);
        $productos = $producto->obtenerTodos();
        
        if ($productos === null) {
            throw new Exception("Error al obtener productos");
        }
        
        echo json_encode([
            'success' => true,
            'data' => $productos,
            'count' => count($productos)
        ]);
    }

    public function obtenerPorId($id) {
        $producto = new Producto($this->conn);
        $result = $producto->obtenerPorId($id);
        
        if (!$result) {
            throw new Exception("Producto no encontrado");
        }
        
        echo json_encode([
            'success' => true,
            'data' => $result
        ]);
    }

    public function crear($datos) {
        $producto = new Producto($this->conn);
        $exito = $producto->crear(
            htmlspecialchars($datos['nombre']),
            floatval($datos['precio']),
            htmlspecialchars($datos['descripcion'] ?? '')
        );
        
        if (!$exito) {
            throw new Exception("Error al crear producto");
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Producto creado exitosamente'
        ]);
    }

    public function actualizar($id, $datos) {
        $producto = new Producto($this->conn);
        $exito = $producto->actualizar(
            $id,
            htmlspecialchars($datos['nombre']),
            floatval($datos['precio']),
            htmlspecialchars($datos['descripcion'] ?? '')
        );
        
        if (!$exito) {
            throw new Exception("Error al actualizar producto");
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Producto actualizado'
        ]);
    }

    public function eliminar($id) {
        $producto = new Producto($this->conn);
        $exito = $producto->eliminar($id);
        
        if (!$exito) {
            throw new Exception("Error al eliminar producto");
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Producto eliminado'
        ]);
    }
}
?>