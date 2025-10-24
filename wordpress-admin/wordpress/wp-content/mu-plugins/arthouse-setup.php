<?php
/**
 * Must-use plugin to automatically activate Art House Products plugin
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Auto-activate Art House Products plugin
add_action('admin_init', function() {
    $plugin_file = 'arthouse-products/arthouse-products.php';
    
    if (!is_plugin_active($plugin_file)) {
        activate_plugin($plugin_file);
    }
});

// Add CORS headers for API
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        return $value;
    });
});
