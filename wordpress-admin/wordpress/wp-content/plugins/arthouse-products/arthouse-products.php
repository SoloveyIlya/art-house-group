<?php
/**
 * Plugin Name: Art House Products
 * Description: Custom post type for managing Art House products with API endpoints
 * Version: 1.0.0
 * Author: Art House Group
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class ArtHouseProducts {
    
    public function __construct() {
        add_action('init', array($this, 'register_product_post_type'));
        add_action('add_meta_boxes', array($this, 'add_product_meta_boxes'));
        add_action('save_post', array($this, 'save_product_meta'));
        add_action('rest_api_init', array($this, 'register_api_routes'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
    }
    
    // Register custom post type
    public function register_product_post_type() {
        $labels = array(
            'name' => 'Продукты',
            'singular_name' => 'Продукт',
            'menu_name' => 'Продукты',
            'add_new' => 'Добавить продукт',
            'add_new_item' => 'Добавить новый продукт',
            'edit_item' => 'Редактировать продукт',
            'new_item' => 'Новый продукт',
            'view_item' => 'Просмотреть продукт',
            'search_items' => 'Поиск продуктов',
            'not_found' => 'Продукты не найдены',
            'not_found_in_trash' => 'В корзине продуктов не найдено'
        );
        
        $args = array(
            'labels' => $labels,
            'public' => true,
            'publicly_queryable' => true,
            'show_ui' => true,
            'show_in_menu' => true,
            'query_var' => true,
            'rewrite' => array('slug' => 'products'),
            'capability_type' => 'post',
            'has_archive' => true,
            'hierarchical' => false,
            'menu_position' => 5,
            'menu_icon' => 'dashicons-admin-home',
            'supports' => array('title', 'editor', 'thumbnail', 'excerpt'),
            'show_in_rest' => true
        );
        
        register_post_type('product', $args);
    }
    
    // Add meta boxes for product fields
    public function add_product_meta_boxes() {
        add_meta_box(
            'product_details',
            'Детали продукта',
            array($this, 'product_details_callback'),
            'product',
            'normal',
            'high'
        );
    }
    
    // Meta box callback
    public function product_details_callback($post) {
        wp_nonce_field('product_meta_nonce', 'product_meta_nonce');
        
        $price = get_post_meta($post->ID, '_product_price', true);
        $area = get_post_meta($post->ID, '_product_area', true);
        $capacity = get_post_meta($post->ID, '_product_capacity', true);
        $power = get_post_meta($post->ID, '_product_power', true);
        $dimensions = get_post_meta($post->ID, '_product_dimensions', true);
        $weight = get_post_meta($post->ID, '_product_weight', true);
        $short_description = get_post_meta($post->ID, '_product_short_description', true);
        $external_protection = get_post_meta($post->ID, '_product_external_protection', true);
        $guest_control = get_post_meta($post->ID, '_product_guest_control', true);
        $accessories = get_post_meta($post->ID, '_product_accessories', true);
        ?>
        <table class="form-table">
            <tr>
                <th><label for="product_price">Цена ($)</label></th>
                <td><input type="text" id="product_price" name="product_price" value="<?php echo esc_attr($price); ?>" style="width: 100%;" /></td>
            </tr>
            <tr>
                <th><label for="product_area">Площадь (м²)</label></th>
                <td><input type="text" id="product_area" name="product_area" value="<?php echo esc_attr($area); ?>" style="width: 100%;" /></td>
            </tr>
            <tr>
                <th><label for="product_capacity">Вместимость</label></th>
                <td><input type="text" id="product_capacity" name="product_capacity" value="<?php echo esc_attr($capacity); ?>" style="width: 100%;" /></td>
            </tr>
            <tr>
                <th><label for="product_power">Мощность (кВт)</label></th>
                <td><input type="text" id="product_power" name="product_power" value="<?php echo esc_attr($power); ?>" style="width: 100%;" /></td>
            </tr>
            <tr>
                <th><label for="product_dimensions">Размеры (м)</label></th>
                <td><input type="text" id="product_dimensions" name="product_dimensions" value="<?php echo esc_attr($dimensions); ?>" style="width: 100%;" /></td>
            </tr>
            <tr>
                <th><label for="product_weight">Вес (тонны)</label></th>
                <td><input type="text" id="product_weight" name="product_weight" value="<?php echo esc_attr($weight); ?>" style="width: 100%;" /></td>
            </tr>
            <tr>
                <th><label for="product_short_description">Краткое описание</label></th>
                <td><textarea id="product_short_description" name="product_short_description" rows="4" style="width: 100%;"><?php echo esc_textarea($short_description); ?></textarea></td>
            </tr>
            <tr>
                <th><label for="product_external_protection">Внешняя система защиты</label></th>
                <td>
                    <div class="list-manager" data-field="external_protection">
                        <div class="input-group" style="display: flex; gap: 10px; margin-bottom: 10px;">
                            <input type="text" id="external_protection_input" placeholder="Введите пункт системы защиты" style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" />
                            <button type="button" class="add-item-btn" data-target="external_protection" style="padding: 8px 16px; background: #0073aa; color: white; border: none; border-radius: 4px; cursor: pointer;">Добавить</button>
                        </div>
                        <div class="items-list" id="external_protection_list" style="border: 1px solid #ddd; border-radius: 4px; min-height: 100px; padding: 10px; background: #f9f9f9;">
                            <!-- Items will be added here -->
                        </div>
                        <textarea id="product_external_protection" name="product_external_protection" style="display: none;"><?php echo esc_textarea($external_protection); ?></textarea>
                    </div>
                </td>
            </tr>
            <tr>
                <th><label for="product_guest_control">Система гостевого контроля</label></th>
                <td>
                    <div class="list-manager" data-field="guest_control">
                        <div class="input-group" style="display: flex; gap: 10px; margin-bottom: 10px;">
                            <input type="text" id="guest_control_input" placeholder="Введите пункт системы гостевого контроля" style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" />
                            <button type="button" class="add-item-btn" data-target="guest_control" style="padding: 8px 16px; background: #0073aa; color: white; border: none; border-radius: 4px; cursor: pointer;">Добавить</button>
                        </div>
                        <div class="items-list" id="guest_control_list" style="border: 1px solid #ddd; border-radius: 4px; min-height: 100px; padding: 10px; background: #f9f9f9;">
                            <!-- Items will be added here -->
                        </div>
                        <textarea id="product_guest_control" name="product_guest_control" style="display: none;"><?php echo esc_textarea($guest_control); ?></textarea>
                    </div>
                </td>
            </tr>
            <tr>
                <th><label for="product_accessories">Аксессуары для продукта</label></th>
                <td>
                    <div class="list-manager" data-field="accessories">
                        <div class="input-group" style="display: flex; gap: 10px; margin-bottom: 10px;">
                            <input type="text" id="accessories_input" placeholder="Введите аксессуар" style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" />
                            <button type="button" class="add-item-btn" data-target="accessories" style="padding: 8px 16px; background: #0073aa; color: white; border: none; border-radius: 4px; cursor: pointer;">Добавить</button>
                        </div>
                        <div class="items-list" id="accessories_list" style="border: 1px solid #ddd; border-radius: 4px; min-height: 100px; padding: 10px; background: #f9f9f9;">
                            <!-- Items will be added here -->
                        </div>
                        <textarea id="product_accessories" name="product_accessories" style="display: none;"><?php echo esc_textarea($accessories); ?></textarea>
                    </div>
                </td>
            </tr>
        </table>
        
        <script>
        jQuery(document).ready(function($) {
            // Initialize list managers
            $('.list-manager').each(function() {
                const manager = $(this);
                const field = manager.data('field');
                const textarea = manager.find('textarea');
                const input = manager.find('input[type="text"]');
                const list = manager.find('.items-list');
                const addBtn = manager.find('.add-item-btn');
                
                // Load existing items
                loadItems(field, textarea, list);
                
                // Add item on button click
                addBtn.on('click', function() {
                    const value = input.val().trim();
                    if (value) {
                        addItem(field, value, textarea, list);
                        input.val('');
                    }
                });
                
                // Add item on Enter key
                input.on('keypress', function(e) {
                    if (e.which === 13) {
                        e.preventDefault();
                        const value = input.val().trim();
                        if (value) {
                            addItem(field, value, textarea, list);
                            input.val('');
                        }
                    }
                });
            });
            
            function loadItems(field, textarea, list) {
                const data = textarea.val();
                if (data) {
                    const items = data.split('\n').filter(item => item.trim());
                    items.forEach(item => {
                        if (item.trim()) {
                            addItemToList(field, item.trim(), list);
                        }
                    });
                }
            }
            
            function addItem(field, value, textarea, list) {
                addItemToList(field, value, list);
                updateTextarea(textarea, list);
            }
            
            function addItemToList(field, value, list) {
                const itemId = 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                const itemHtml = `
                    <div class="list-item" data-id="${itemId}" style="display: flex; align-items: center; justify-content: space-between; padding: 8px; margin: 4px 0; background: white; border: 1px solid #ddd; border-radius: 4px;">
                        <span class="item-text">${value}</span>
                        <button type="button" class="remove-item-btn" data-id="${itemId}" style="background: #dc3545; color: white; border: none; border-radius: 3px; padding: 4px 8px; cursor: pointer; font-size: 12px;">×</button>
                    </div>
                `;
                list.append(itemHtml);
                
                // Add remove functionality
                list.find(`[data-id="${itemId}"] .remove-item-btn`).on('click', function() {
                    $(this).closest('.list-item').remove();
                    updateTextarea(textarea, list);
                });
            }
            
            function updateTextarea(textarea, list) {
                const items = [];
                list.find('.item-text').each(function() {
                    items.push($(this).text());
                });
                textarea.val(items.join('\n'));
            }
        });
        </script>
        
        <style>
        .list-manager .items-list {
            max-height: 200px;
            overflow-y: auto;
        }
        .list-manager .list-item {
            transition: all 0.2s ease;
        }
        .list-manager .list-item:hover {
            background-color: #f0f0f0 !important;
        }
        .list-manager .remove-item-btn:hover {
            background-color: #c82333 !important;
        }
        .list-manager .add-item-btn:hover {
            background-color: #005a87 !important;
        }
        </style>
        <?php
    }
    
    // Save meta data
    public function save_product_meta($post_id) {
        if (!isset($_POST['product_meta_nonce']) || !wp_verify_nonce($_POST['product_meta_nonce'], 'product_meta_nonce')) {
            return;
        }
        
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }
        
        if (!current_user_can('edit_post', $post_id)) {
            return;
        }
        
        $fields = array('product_price', 'product_area', 'product_capacity', 'product_power', 'product_dimensions', 'product_weight', 'product_short_description', 'product_external_protection', 'product_guest_control', 'product_accessories');
        
        foreach ($fields as $field) {
            if (isset($_POST[$field])) {
                update_post_meta($post_id, '_' . $field, sanitize_text_field($_POST[$field]));
            }
        }
    }
    
    // Register API routes
    public function register_api_routes() {
        register_rest_route('arthouse/v1', '/products', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_products'),
            'permission_callback' => '__return_true'
        ));
        
        register_rest_route('arthouse/v1', '/products/(?P<id>\d+)', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_product'),
            'permission_callback' => '__return_true'
        ));
    }
    
    // Get all products
    public function get_products($request) {
        $args = array(
            'post_type' => 'product',
            'post_status' => 'publish',
            'posts_per_page' => -1,
            'orderby' => 'menu_order',
            'order' => 'ASC'
        );
        
        $products = get_posts($args);
        $products_data = array();
        
        foreach ($products as $product) {
            $products_data[] = $this->format_product_data($product);
        }
        
        return new WP_REST_Response($products_data, 200);
    }
    
    // Get single product
    public function get_product($request) {
        $product_id = $request['id'];
        $product = get_post($product_id);
        
        if (!$product || $product->post_type !== 'product') {
            return new WP_Error('not_found', 'Product not found', array('status' => 404));
        }
        
        return new WP_REST_Response($this->format_product_data($product), 200);
    }
    
    // Format product data for API
    private function format_product_data($product) {
        $image_id = get_post_thumbnail_id($product->ID);
        $image_url = $image_id ? wp_get_attachment_image_url($image_id, 'large') : '';
        
        return array(
            'id' => $product->ID,
            'title' => $product->post_title,
            'description' => $product->post_content,
            'excerpt' => $product->post_excerpt,
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
            'slug' => $product->post_name,
            'date' => $product->post_date
        );
    }
    
    // Enqueue scripts for CORS
    public function enqueue_scripts() {
        // Add CORS headers
        if (defined('CORS_ENABLED') && CORS_ENABLED) {
            add_action('rest_api_init', function() {
                remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
                add_filter('rest_pre_serve_request', function($value) {
                    header('Access-Control-Allow-Origin: *');
                    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
                    header('Access-Control-Allow-Headers: Content-Type, Authorization');
                    return $value;
                });
            });
        }
    }
}

// Initialize the plugin
new ArtHouseProducts();
