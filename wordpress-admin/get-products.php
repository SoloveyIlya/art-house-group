<?php
// Simple script to get products from WordPress
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Include WordPress
require_once('wordpress/wp-load.php');

// Get products
$args = array(
    'post_type' => 'product',
    'post_status' => 'publish',
    'posts_per_page' => -1
);

$products = get_posts($args);
$products_data = array();

foreach ($products as $product) {
    $image_id = get_post_thumbnail_id($product->ID);
    $image_url = $image_id ? wp_get_attachment_image_url($image_id, 'large') : '';
    
    // If no featured image, try to get first image from content
    if (empty($image_url)) {
        $content = $product->post_content;
        preg_match('/<img[^>]+src="([^"]+)"/', $content, $matches);
        if (!empty($matches[1])) {
            $image_url = $matches[1];
        }
    }
    
    // Fallback to default image
    if (empty($image_url)) {
        $image_url = 'http://localhost:8888/art-house-group/media/catalog/g30.png.webp';
    }
    
    $products_data[] = array(
        'id' => $product->ID,
        'title' => $product->post_title,
        'description' => $product->post_content,
        'short_description' => get_post_meta($product->ID, '_product_short_description', true),
        'price' => get_post_meta($product->ID, '_product_price', true),
        'area' => get_post_meta($product->ID, '_product_area', true),
        'capacity' => get_post_meta($product->ID, '_product_capacity', true),
        'power' => get_post_meta($product->ID, '_product_power', true),
        'dimensions' => get_post_meta($product->ID, '_product_dimensions', true),
        'weight' => get_post_meta($product->ID, '_product_weight', true),
        'external_protection' => get_post_meta($product->ID, '_product_external_protection', true),
        'guest_control' => get_post_meta($product->ID, '_product_guest_control', true),
        'accessories' => get_post_meta($product->ID, '_product_accessories', true),
        'image' => $image_url,
        'slug' => $product->post_name
    );
}

echo json_encode($products_data);
?>
