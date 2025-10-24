=== Art House Products ===
Contributors: arthouse
Tags: products, api, custom-post-type
Requires at least: 5.0
Tested up to: 6.4
Stable tag: 1.0.0
Requires PHP: 7.4
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Custom post type for managing Art House products with REST API endpoints.

== Description ==

This plugin creates a custom post type for managing Art House products with the following features:

* Custom post type "Products" with admin interface
* Custom fields for product details (price, area, capacity, power, dimensions, weight)
* REST API endpoints for frontend integration
* CORS support for cross-origin requests

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/arthouse-products/` directory
2. Activate the plugin through the 'Plugins' screen in WordPress
3. Go to 'Products' in the admin menu to start adding products

== API Endpoints ==

* GET /wp-json/arthouse/v1/products - Get all products
* GET /wp-json/arthouse/v1/products/{id} - Get single product

== Changelog ==

= 1.0.0 =
* Initial release
