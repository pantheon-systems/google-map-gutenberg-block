<?php
/**
 * Plugin Name: Gutenberg Block for Google Maps Embed By Pantheon
 * Description: A plugin enabling a Google Map embed Gutenberg block
 * Author: Pantheon, Andrew Taylor
 * Author URI: https://pantheon.io/
 * Version: 1.5.1
 * License: GPL2
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain: pantheon-google-map-block
 * Requires PHP: 5.6
 * Requires at least: 5.0
 *
 * @package PantheonGoogleMapBlock
 */

 namespace PantheonGoogleMapBlock;

//  Exit if accessed directly.
if (! defined('ABSPATH')) {
    exit;
}

/**
 * Get the defined API Key or key set on the writing settings.
 *
 * @return string
 */
function getGoogleMapAPIKey()
{
    if ( defined( 'GOOGLE_MAPS_API_KEY' ) ) {
		return GOOGLE_MAPS_API_KEY;
	}
	return get_option( 'pantheon_google_map_block_api_key', '' );
}

/**
 * Register block editor JavaScript and CSS
 * 
 * @return void
 */
function blockScripts()
{
    // Make paths variables so we don't write em twice ;)
    $hash = 'aef3c8c366ce19f8c0b4';
    $blockPath = "assets/js/index.$hash.js";
    $stylePath = "assets/css/style.$hash.css";

    // Register the bundled block JS file
    if (file_exists(plugin_dir_path(__FILE__) . $blockPath)) {
        wp_register_script(
            'pantheon-google-map-block-js',
            plugins_url($blockPath, __FILE__),
            array( 'wp-i18n', 'wp-element', 'wp-blocks', 'wp-components', 'wp-api', 'wp-editor' ),
            filemtime(plugin_dir_path(__FILE__) . $blockPath),
            true
        );

        wp_add_inline_script(
			'pantheon-google-map-block-js',
			sprintf(
                'var PantheonGoogleMapsData = %s;',
                wp_json_encode(
                    array(
                        'APIKey' => getGoogleMapAPIKey(),
                        'userCanManageOptions' => current_user_can( 'manage_options' ),
                    )
                )
            ),
			'before'
		);
    }

    // Register frontend and editor block styles
    if (file_exists(plugin_dir_path(__FILE__) . $stylePath)) {
        wp_register_style(
            'pantheon-google-map-block-css',
            plugins_url($stylePath, __FILE__),
            array(),
            filemtime(plugin_dir_path(__FILE__) . $stylePath)
        );
    }

}

function registerSettings() {
    register_setting(
        'pantheon_google_map_block_api_key',
        'pantheon_google_map_block_api_key',
        array(
            'type' => 'string',
            'description' => __('Google Map API key for the Gutenberg block plugin.'),
            'sanitize_callback' => 'sanitize_text_field',
            'show_in_rest' => true,
            'default' => ''
        )
    );
}

add_action( 'init', __NAMESPACE__ . '\registerSettings'  );

/**
 * Render the Googe Map block
 *
 * @param array $attributes
 * @return string
 */
function renderGutenbergMapEmbedblock( $attributes ) {
    
    // Get the API key
    $APIkey = getGoogleMapAPIKey();

    // Don't output anything if there is no API key
    if (null === $APIkey || empty( $APIkey )) {
        return;
    }

    // Exapnd all the atributes into separate variables
    foreach($attributes as $key=>$value) {
        ${$key} = $value; 
    }

    // URL encode the location for Google Maps
    $location = urlencode ( $location );

    // Set the API url based to embed or static maps based on the interactive setting
    $apiURL = ( $interactive ) ? "https://www.google.com/maps/embed/v1/place?key=${APIkey}&q=${location}&zoom=${zoom}&maptype=${mapType}" : "https://maps.googleapis.com/maps/api/staticmap?center=${location}&zoom=${zoom}&size=${maxWidth}x${maxHeight}&maptype=${mapType}&key=${APIkey}";
    
    // Check status code of apiURL
    $ch = curl_init($apiURL);
    curl_setopt($ch, CURLOPT_HEADER, true);
    curl_setopt($ch, CURLOPT_NOBODY, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
    curl_setopt($ch, CURLOPT_TIMEOUT,10);
    $output = curl_exec($ch);
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    // Don't output anything if the response from Google Maps isn't a 200
    if( $httpcode !== 200 ){
        return;
    }

    // Set the appropriate CSS class names
    $classNames = ( $interactive ) ? "wp-block-pantheon-google-map interactive ratio$aspectRatio" : "wp-block-pantheon-google-map";
    
    // Create the output
    $output = "<div class='$classNames'><div class='map'>";
    // If the map is interactive show the iframe
    if( $interactive ){
        $output .= "<iframe width='100%' height='100%' frameborder='0' style='border:0' src='$apiURL' allowfullscreen></iframe>";
    // Otherwise use the static API
    } else {
        $output .= "<img src='$apiURL' />";
    }
    $output .= '</div></div>';

    // Return the output
    return apply_filters('render_pantheon_google_map_block', $output, $attributes);
}

/**
 * Register the map block
 *
 * @return void
 */
function registerMapBlock() {
    if( \function_exists('register_block_type') ){
        blockScripts();
        \register_block_type( 'pantheon/google-map', array(
            'editor_script' => 'pantheon-google-map-block-js',
            'style' => 'pantheon-google-map-block-css',
            'attributes' => array (
                'location' => array (
                    'type' => 'string',
                    'default' => '',
                ),
                'mapType' => array (
                    'type' => 'string',
                    'default' => 'roadmap',
                ),
                'zoom' => array (
                    'type' => 'number',
                    'default' => 13,
                ),
                'maxWidth' => array (
                    'type' => 'number',
                    'default' => 1920,
                ),
                'maxHeight' => array (
                    'type' => 'number',
                    'default' => 1329,
                ),
                'interactive' => array (
                    'type' => 'boolean',
                    'default' => true,
                ),
                'aspectRatio' => array (
                    'type' => 'string',
                    'default' => '2_1',
                ),
            ),
            'render_callback' => __NAMESPACE__ . '\renderGutenbergMapEmbedblock',
        ) );
    }
}


add_action('init', __NAMESPACE__ . '\registerMapBlock' );
