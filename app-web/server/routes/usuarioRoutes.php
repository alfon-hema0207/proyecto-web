<?php
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . '/../controllers/UsuarioController.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        if (isset($_GET['action']) && $_GET['action'] === 'check') {
            session_start();
            if (isset($_SESSION['usuario_id'])) {
                echo json_encode([
                    'authenticated' => true,
                    'usuario' => [
                        'id' => $_SESSION['usuario_id'],
                        'nombre' => $_SESSION['usuario_nombre'],
                        'rol' => $_SESSION['usuario_rol']
                    ]
                ]);
            } else {
                echo json_encode(['authenticated' => false]);
            }
            exit();
        }
        break;
        
    case 'POST':
        if (isset($_GET['action'])) {
            switch ($_GET['action']) {
                case 'login':
                    UsuarioController::login($input);
                    break;
                case 'register':
                    UsuarioController::registrar($input);
                    break;
                    case 'logout':
                        session_start();
                        // Destruir completamente la sesión
                        $_SESSION = array();
                        
                        // Eliminar la cookie de sesión
                        if (ini_get("session.use_cookies")) {
                            $params = session_get_cookie_params();
                            setcookie(session_name(), '', time() - 42000,
                                $params["path"], $params["domain"],
                                $params["secure"], $params["httponly"]
                            );
                        }
                        
                        session_destroy();
                        echo json_encode(['success' => true, 'mensaje' => 'Sesión cerrada']);  // ← Respuesta clara
                        break;
                default:
                    http_response_code(400);
                    echo json_encode(['mensaje' => 'Acción no válida']);
            }
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['mensaje' => 'Método no permitido']);
}
?>