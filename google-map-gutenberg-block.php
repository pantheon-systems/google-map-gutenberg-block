<?php
/**
 * Plugin Name: Google Map Gutenberg Block by Pantheon
 * Description: A plugin enabling a Google Map Gutenberg block
 * Author: Pantheon, Andrew Taylor
 * Author URI: https://pantheon.io/
 * Version: 1.0.0
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
if (! defined('ABSPATH')) {
    exit;
}

/**
 * Enqueue block editor JavaScript and CSS
 * 
 * @return void
 */
function blockScripts()
{
    $blockPath = 'assets/js/index.min.js';
    // Make paths variables so we don't write em twice ;)
    $stylePath = 'assets/css/style.min.css';

    // Enqueue the bundled block JS file
    if (file_exists(plugin_dir_path(__FILE__) . $blockPath)) {
        wp_enqueue_script(
            'pantheon-google-map-block-frontend-js',
            plugins_url($blockPath, __FILE__),
            [ 'wp-i18n', 'wp-element', 'wp-blocks', 'wp-components', 'wp-api' ],
            filemtime(plugin_dir_path(__FILE__) . $blockPath)
        );
    }

    // Enqueue frontend and editor block styles
    if (file_exists(plugin_dir_path(__FILE__) . $stylePath)) {
        wp_enqueue_style(
            'pantheon-google-map-block-css',
            plugins_url($stylePath, __FILE__),
            [ 'wp-blocks' ],
            filemtime(plugin_dir_path(__FILE__) . $stylePath)
        );
    }

}

// Hook scripts function into block editor hook
add_action('enqueue_block_assets', __NAMESPACE__ . '\\blockScripts');

/**
 * Setup Pantheon Google Map Gutenberg Block Settings Page
 */
class SettingsPage
{

    private $_options;

    /**
     * Add actions and filters
     */
    public function __construct()
    {
        add_action('admin_menu', array($this, 'addOptionsPage'));
        add_action('admin_init', array($this, 'pageInit'));
    }

    /**
     * Add options pge
     *
     * @return void
     */
    public function addOptionsPage()
    {
        add_options_page(
            __('Google Map Block Global Settings'),
            __('Google Map Block'),
            'manage_options',
            'pantheon-google-map-block',
            array($this, 'createAdminPage')
        );
    }

    /**
     * Create admin page
     *
     * @return void
     */
    public function createAdminPage()
    {

    $this->_options = get_option('pantheon_google_map_block_options'); ?>

    <div class="wrap">

        <?php screen_icon(); ?>

        <h2>
        <?php _e('Pantheon Google Map Block Global Settings'); ?>
        </h2>

        <form method="post" action="options.php">

            <?php
            settings_fields('pantheon_google_map_block_options_group');
            do_settings_sections('pantheon-google-map-block');
            submit_button();
            ?>

        </form>

    </div>

    <?php
    }

    /**
     * Initialize options page
     *
     * @return void
     */
    public function pageInit()
    {
        register_setting(
            'pantheon_google_map_block_options_group',
            'pantheon_google_map_block_options',
            array($this, 'sanitize')
        );

        add_settings_section(
            'pantheon_google_map_block',
            '', // string that prints out a header
            array($this, 'printSectionInfo'),
            'pantheon-google-map-block'
        );

        add_settings_field(
            'api_key',
            __('Google Maps API key'),
            array($this, 'apiInputCallback'),
            'pantheon-google-map-block',
            'pantheon_google_map_block'
        );
    }

    /**
     * Sanitize input
     *
     * @param array $input
     * @return void
     */
    public function sanitize($input)
    {
        $new_input = array();

        if (isset($input['api_key'])){
            $new_input['api_key'] = sanitize_text_field($input['api_key']);
        }

        return $new_input;
    }

    /**
     * Print section info
     *
     * @return void
     */
    public function printSectionInfo()
    {
        print ''; // prints a <p> kinda deal
    }

    /**
     * API Key Input Callback
     *
     * @return void
     */
    public function apiInputCallback()
    {
        printf(
            '<input type="text" id="api_key" name="pantheon_google_map_block_options[api_key]" style="%s" value="%s" />
            <p class="description">The Google Map will not work without an API key. You can obtain one <a href="https://developers.google.com/maps/documentation/embed/get-api-key">here</a>. <br />
            The API key will be exposed publicly to generate the map. It is important to <a href="https://developers.google.com/maps/documentation/embed/get-api-key#key-restrictions">restrict your API key</a> so others do not abuse it.
            </p>
            ',
            'width:100%;max-width:500px;',
            isset($this->_options['api_key']) ? esc_attr($this->_options['api_key']) : ''
        );
    }

}

if (is_admin()) {
    $pantheon_google_map_block_settings_page = new SettingsPage();
}

add_action( 'rest_api_init', __NAMESPACE__ . '\\registerAPIhooks' );

/**
 * Register WordPress REST API endpoint for Google Map Block
 *
 * @return void
 */
function registerAPIhooks() {

    register_rest_route( 'pantheon-google-map-block/v1', 'options', array(
        array(
            'methods' => 'GET',
            'callback' => __NAMESPACE__ . '\\returnGoogleMapBlockOptions',
        ),
    ) );

}

/**
 * Return plugin options for Google Map Block
 *
 * @return array
 */
function returnGoogleMapBlockOptions() {

    $global_block_settings = get_option('pantheon_google_map_block_options');

    if( null === $global_block_settings ){
        $global_block_settings = array();
    }

    if (!isset($global_block_settings['api_key'])) {
        $global_block_settings['api_key'] = '';
    }

     return array(
        'rest_url' => esc_url(rest_url()),
        'settings' => $global_block_settings,
        'settings_url' => admin_url('options-general.php?page=pantheon-google-map-block'),
    );

}