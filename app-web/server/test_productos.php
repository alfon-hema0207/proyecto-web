<?php
require_once "config/database.php";
require_once "models/Producto.php";

$db = new Database();
$conn = $db->getConnection();

$producto = new Producto($conn);
$datos = $producto->obtenerTodos();

echo "<pre>";
print_r($datos);
echo "</pre>";
?>
