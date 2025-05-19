<?php
class Producto {
    private $conn;
    private $table = 'productos';

    public function __construct($db) {
        $this->conn = $db;
    }

    public function obtenerTodos() {
        $query = "SELECT id, nombre, precio, descripcion FROM " . $this->table . " WHERE disponible = 1";
        $stmt = $this->conn->prepare($query);
        
        if (!$stmt || !$stmt->execute()) {
            error_log("Error SQL: " . ($stmt ? $stmt->error : $this->conn->error));
            return null;
        }
        
        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function obtenerPorId($id) {
        $query = "SELECT id, nombre, precio, descripcion FROM " . $this->table . " WHERE id = ? AND disponible = 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        
        if (!$stmt || !$stmt->execute()) {
            error_log("Error SQL: " . ($stmt ? $stmt->error : $this->conn->error));
            return null;
        }
        
        $result = $stmt->get_result();
        return $result->fetch_assoc();
    }

    public function crear($nombre, $precio, $descripcion) {
        $query = "INSERT INTO " . $this->table . " (nombre, precio, descripcion) VALUES (?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("sds", $nombre, $precio, $descripcion);
        
        if (!$stmt || !$stmt->execute()) {
            error_log("Error SQL: " . ($stmt ? $stmt->error : $this->conn->error));
            return false;
        }
        
        return true;
    }

    public function actualizar($id, $nombre, $precio, $descripcion) {
        $query = "UPDATE " . $this->table . " SET nombre = ?, precio = ?, descripcion = ? WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("sdsi", $nombre, $precio, $descripcion, $id);
        
        if (!$stmt || !$stmt->execute()) {
            error_log("Error SQL: " . ($stmt ? $stmt->error : $this->conn->error));
            return false;
        }
        
        return true;
    }

    public function eliminar($id) {
        $query = "UPDATE " . $this->table . " SET disponible = 0 WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        
        if (!$stmt || !$stmt->execute()) {
            error_log("Error SQL: " . ($stmt ? $stmt->error : $this->conn->error));
            return false;
        }
        
        return true;
    }
}
?>