<?php
// Simple test to check if plugin is working
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

echo json_encode(array(
    'status' => 'success',
    'message' => 'Plugin is working',
    'timestamp' => date('Y-m-d H:i:s')
));
?>
