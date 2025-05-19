<?php
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../controllers/ProductoController.php';
require_once __DIR__ . '/../middlewares/AuthMiddleware.php';


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$db = new Database();
$conn = $db->getConnection();
$controller = new ProductoController($conn);
$input = json_decode(file_get_contents('php://input'), true);

try {
    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            // Todos pueden ver productos
            if (isset($_GET['id'])) {
                $controller->obtenerPorId($_GET['id']);
            } else {
                $controller->obtenerTodos();
            }
            break;
            
        case 'POST':
            // Solo admin puede crear productos
            AuthMiddleware::isAdmin();
            if (empty($input['nombre']) || empty($input['precio'])) {
                throw new Exception("Nombre y precio son requeridos");
            }
            $controller->crear($input);
            break;
            
        case 'PUT':
            // Solo admin puede actualizar
            AuthMiddleware::isAdmin();
            if (isset($_GET['id'])) {
                $controller->actualizar($_GET['id'], $input);
            }
            break;
            
        case 'DELETE':
            // Solo admin puede eliminar
            AuthMiddleware::isAdmin();
            if (isset($_GET['id'])) {
                $controller->eliminar($_GET['id']);
            }
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['success' => false, 'error' => 'Método no permitido']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ]);
}
?>