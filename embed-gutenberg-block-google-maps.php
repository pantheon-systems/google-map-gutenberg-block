<?php
/**
 * Plugin Name: Gutenberg Block for Google Maps Embed By Pantheon
 * Description: A plugin enabling a Google Map embed Gutenberg block
 * Author: Pantheon, Andrew Taylor
 * Author URI: https://pantheon.io/
 * Version: 1.3.2
 * License: GPL2+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain: pantheon-google-map-block
 * Requires PHP: 5.6
 * Requires at least: 4.8
 *
 * @package PantheonGoogleMapBlock
 */

namespace PantheonGoogleMapBlock;

//  Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register block editor JavaScript and CSS.
 *
 * @return void
 */
function block_scripts() {
	// Make paths variables so we don't write em twice ;)
	$hash       = '.28b2d48c50f2cc147828';
	$block_path = "assets/js/index$hash.js";
	$style_path = "assets/css/style$hash.css";

	// Register the bundled block JS file.
	if ( file_exists( plugin_dir_path( __FILE__ ) . $block_path ) ) {
		wp_register_script(
			'pantheon-google-map-block-js',
			plugins_url( $block_path, __FILE__ ),
			array( 'wp-i18n', 'wp-element', 'wp-blocks', 'wp-components', 'wp-api' ),
			filemtime( plugin_dir_path( __FILE__ ) . $block_path )
		);
	}

	// Register frontend and editor block styles.
	if ( file_exists( plugin_dir_path( __FILE__ ) . $style_path ) ) {
		wp_register_style(
			'pantheon-google-map-block-css',
			plugins_url( $style_path, __FILE__ ),
			array( 'wp-blocks' ),
			filemtime( plugin_dir_path( __FILE__ ) . $style_path )
		);
	}

}

function register_settings() {
	register_setting(
		'pantheon_google_map_block_api_key',
		'pantheon_google_map_block_api_key',
		array(
			'type'              => 'string',
			'description'       => __( 'Google Map API key for the Gutenberg block plugin.' ),
			'sanitize_callback' => 'sanitize_text_field',
			'show_in_rest'      => true,
			'default'           => '',
		)
	);
}

add_action( 'init', __NAMESPACE__ . '\\register_settings' );

/**
 * Render the Google Map block.
 *
 * @param array $attributes An array of block attributes and values.
 * @return string The rendered HTML output of the block.
 */
function render_gutenberg_map_embed_block( $attributes ) {

	// Get the API key.
	$api_key = get_option( 'pantheon_google_map_block_api_key' );

	// Don't output anything if there is no API key.
	if ( null === $api_key || empty( $api_key ) ) {
		return;
	}

	// Expand all the attributes into separate variables.
	foreach ( $attributes as $key => $value ) {
		${$key} = $value;
	}

	// URL encode the location for Google Maps.
	$location = rawurlencode( $location );

	// Set the API URL based to embed or static maps based on the interactive setting.
	 /* phpcs:ignore */
	$api_url = ( $interactive ) ? "https://www.google.com/maps/embed/v1/place?key=${api_key}&q=${location}&zoom=${zoom}&maptype=${mapType}" : "https://maps.googleapis.com/maps/api/staticmap?center=${location}&zoom=${zoom}&size=${maxWidth}x${maxHeight}&maptype=${mapType}&key=${api_key}";

	// Check status code of the API.
	// phpcs:disable WordPress.WP.AlternativeFunctions
	$ch = curl_init( $api_url );
	curl_setopt( $ch, CURLOPT_HEADER, true );
	curl_setopt( $ch, CURLOPT_NOBODY, true );
	curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1 );
	curl_setopt( $ch, CURLOPT_TIMEOUT, 10 );
	$output   = curl_exec( $ch );
	$httpcode = curl_getinfo( $ch, CURLINFO_HTTP_CODE );
	curl_close( $ch );
	// phpcs:enable WordPress.WP.AlternativeFunctions

	// Don't output anything if the response from Google Maps isn't a 200.
	if ( 200 !== $httpcode ) {
		return;
	}

	// Set the appropriate CSS class names.
	 /* phpcs:ignore */
	$classes = ( $interactive ) ? "wp-block-pantheon-google-map interactive ratio$aspectRatio" : 'wp-block-pantheon-google-map';

	// Create the output.
	$output = "<div class='" . esc_attr( $classes ) . "'><div class='map'>";
	// If the map is interactive show the iframe.
	if ( $interactive ) {
		$output .= "<iframe width='100%' height='100%' frameborder='0' style='border:0' src='". esc_url( $api_url ) ."' allowfullscreen></iframe>";
		// Otherwise use the static API.
	} else {
		$output .= "<img src='" . esc_url( $api_url ) . "' />";
	}
	$output .= '</div></div>';

	// Return the output.
	return $output;
}

/**
 * Register the map block.
 *
 * @return void
 */
function register_map_block() {
	if ( function_exists( 'register_block_type' ) ) {
		block_scripts();
		register_block_type(
			'pantheon/google-map', array(
				'editor_script'   => 'pantheon-google-map-block-js',
				'style'           => 'pantheon-google-map-block-css',
				'attributes'      => array(
					'location'    => array(
						'type'    => 'string',
						'default' => '',
					),
					'mapType'     => array(
						'type'    => 'string',
						'default' => 'roadmap',
					),
					'zoom'        => array(
						'type'    => 'number',
						'default' => 13,
					),
					'maxWidth'    => array(
						'type'    => 'number',
						'default' => 1920,
					),
					'maxHeight'   => array(
						'type'    => 'number',
						'default' => 1329,
					),
					'interactive' => array(
						'type'    => 'boolean',
						'default' => true,
					),
					'aspectRatio' => array(
						'type'    => 'string',
						'default' => '2_1',
					),
				),
				'render_callback' => __NAMESPACE__ . '\\render_gutenberg_map_embed_block',
			)
		);
	}
}


add_action( 'init', __NAMESPACE__ . '\\register_map_block' );
