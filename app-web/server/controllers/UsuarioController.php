<?php
// server/controllers/UsuarioController.php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/Usuario.php';

class UsuarioController {
    public static function registrar($datos) {
        $db = new Database();
        $conn = $db->getConnection();
        $usuario = new Usuario($conn);

        // Validaciones
        if (empty($datos['nombre']) || empty($datos['correo']) || empty($datos['password'])) {
            http_response_code(400);
            echo json_encode(['mensaje' => 'Todos los campos son obligatorios']);
            return;
        }

        if (!filter_var($datos['correo'], FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(['mensaje' => 'Correo no válido']);
            return;
        }

        if ($usuario->existeCorreo($datos['correo'])) {
            http_response_code(409);
            echo json_encode(['mensaje' => 'El correo ya está registrado']);
            return;
        }

        // Registro
        if ($usuario->registrar($datos['nombre'], $datos['correo'], $datos['password'])) {
            echo json_encode(['mensaje' => 'Registro exitoso']);
        } else {
            http_response_code(500);
            echo json_encode(['mensaje' => 'Error en el registro']);
        }
    }

    public static function login($datos) {
        session_start();
        $db = new Database();
        $conn = $db->getConnection();
        $usuario = new Usuario($conn);

        if (empty($datos['correo']) || empty($datos['password'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'mensaje' => 'Correo y contraseña son obligatorios']);
            return;
        }

        $usuarioData = $usuario->login($datos['correo'], $datos['password']);

        if ($usuarioData) {
            $_SESSION['usuario_id'] = $usuarioData['id'];
            $_SESSION['usuario_nombre'] = $usuarioData['nombre'];
            $_SESSION['usuario_rol'] = $usuarioData['rol'];
            
            echo json_encode([
                'success' => true,
                'mensaje' => 'Login exitoso', 
                'usuario' => $usuarioData
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['success' => false, 'mensaje' => 'Credenciales incorrectas']);
        }
    }

    public static function logout() {
        session_start();
        session_unset();
        session_destroy();
        echo json_encode(['mensaje' => 'Sesión cerrada']);
    }

    public static function obtenerPerfil() {
        session_start();
        if (!isset($_SESSION['usuario_id'])) {
            http_response_code(401);
            echo json_encode(['mensaje' => 'No autenticado']);
            return;
        }

        $db = new Database();
        $conn = $db->getConnection();
        $usuario = new Usuario($conn);
        echo json_encode($usuario->obtenerPorId($_SESSION['usuario_id']));
    }
}
?>