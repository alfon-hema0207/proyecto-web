<?php
// server/models/Usuario.php

class Usuario {
    private $conn;
    private $table = 'usuarios';

    public function __construct($db) {
        $this->conn = $db;
    }

    public function existeCorreo($correo) {
        $query = "SELECT id FROM " . $this->table . " WHERE correo = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('s', $correo);
        $stmt->execute();
        return $stmt->get_result()->num_rows > 0;
    }

    public function registrar($nombre, $correo, $password, $rol = 'cliente') {
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        $query = "INSERT INTO " . $this->table . " (nombre, correo, password, rol) VALUES (?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('ssss', $nombre, $correo, $hashedPassword, $rol);
        return $stmt->execute();
    }

    public function login($correo, $password) {
        $query = "SELECT id, nombre, correo, password, rol FROM " . $this->table . " WHERE correo = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('s', $correo);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) return false;

        $user = $result->fetch_assoc();
        return password_verify($password, $user['password']) ? [
            'id' => $user['id'],
            'nombre' => $user['nombre'],
            'correo' => $user['correo'],
            'rol' => $user['rol']
        ] : false;
    }

    public function obtenerPorId($id) {
        $query = "SELECT id, nombre, correo FROM " . $this->table . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('i', $id);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }
}
?>