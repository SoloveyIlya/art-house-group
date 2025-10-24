<?php
/**
 * The base configuration for WordPress
 *
 * @package WordPress
 */

// ** Database settings ** //
define( 'DB_NAME', 'arthouse_wp' );
define( 'DB_USER', 'root' );
define( 'DB_PASSWORD', 'root' );
define( 'DB_HOST', 'localhost:8888' );
define( 'DB_CHARSET', 'utf8' );
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 */
define( 'AUTH_KEY',         'arthouse_auth_key_2024_secure_random_string_here' );
define( 'SECURE_AUTH_KEY',  'arthouse_secure_auth_key_2024_secure_random_string_here' );
define( 'LOGGED_IN_KEY',    'arthouse_logged_in_key_2024_secure_random_string_here' );
define( 'NONCE_KEY',        'arthouse_nonce_key_2024_secure_random_string_here' );
define( 'AUTH_SALT',        'arthouse_auth_salt_2024_secure_random_string_here' );
define( 'SECURE_AUTH_SALT', 'arthouse_secure_auth_salt_2024_secure_random_string_here' );
define( 'LOGGED_IN_SALT',   'arthouse_logged_in_salt_2024_secure_random_string_here' );
define( 'NONCE_SALT',       'arthouse_nonce_salt_2024_secure_random_string_here' );

/**#@-*/

/**
 * WordPress database table prefix.
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 */
define( 'WP_DEBUG', true );
define( 'WP_DEBUG_LOG', true );
define( 'WP_DEBUG_DISPLAY', false );

/**
 * CORS settings for API access
 */
define( 'CORS_ENABLED', true );

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
