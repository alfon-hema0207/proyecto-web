<?php
class AuthMiddleware {
    public static function authenticate() {
        session_start();
        if (!isset($_SESSION['usuario_id'])) {
            http_response_code(401);
            echo json_encode(['success' => false, 'error' => 'No autenticado']);
            exit();
        }
    }

    public static function isAdmin() {
        session_start();
        if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_rol'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['success' => false, 'error' => 'Acceso no autorizado']);
            exit();
        }
    }
}
?>