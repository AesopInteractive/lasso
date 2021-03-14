<?php
/**
 *
 *
 * @package   Editus
 * @author    Hyun Supul <hyun@aesopinteractive.com>, Nick Haskins <nick@aesopinteractive.com>
 * @link      http://edituswp.com
 * @copyright 2015-2020 Aesopinteractive 
 *
 * Plugin Name:       Editus
 * Plugin URI:        http://edituswp.com
 * Description:       Front-end editor and story builder.
 * Version:           1.3.5
 * Author:            Aesopinteractive 
 * Author URI:        http://aesopinteractive.com
 * Text Domain:       lasso
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

// Set some constants
define( 'LASSO_VERSION', '1.3.5' );
define( 'LASSO_DIR', plugin_dir_path( __FILE__ ) );
define( 'LASSO_URL', plugins_url( '', __FILE__ ) );
define( 'LASSO_FILE', __FILE__ );

/**
 * Load plugin if PHP version is 5.4 or later.
 */
if ( version_compare( PHP_VERSION, '5.4.0', '>=' ) ) {

	include_once( LASSO_DIR . '/bootstrap.php' );

} else {

	add_action('admin_head', 'lasso_fail_notice');
	function lasso_fail_notice(){

		printf('<div class="error"><p>Editus requires PHP 5.4 or higher.</p></div>');

	}
}

add_filter('register_post_type_args', 'lasso_show_in_rest', 10, 2);
function lasso_show_in_rest($args, $post_type){
 
    $allowed_post_types = lasso_editor_get_option( 'allowed_post_types', 'lasso_editor', array( ) );
	$allowed_post_types = apply_filters( 'lasso_allowed_post_types', $allowed_post_types );
	if (in_array( $post_type,$allowed_post_types)) {
		$args['show_in_rest'] = true;
		if ($post_type != 'post' && $post_type != 'page') {
			$args['rest_base'] = $post_type;
		}
	}
 
    return $args;
}


function lasso_editor_get_option( $option, $section, $default = '' ) {

	if ( empty( $option ) )
		return;

	if ( function_exists( 'is_multisite' ) && is_multisite() ) {

		$options = get_site_option( $section );

	} else {

		$options = get_option( $section );
	}

	if ( isset( $options[$option] ) ) {
		return $options[$option];
	}

	return $default;
}

register_meta('user', 'lasso_hide_tour', array(
  "type" => "string",
  "show_in_rest" => true // this is the key part
));

// Gutenberg
if( function_exists( 'is_gutenberg_page' ) ) {
	function add_raw_to_post( $response, $post, $request ) {
		$response_data = $response->get_data();
		if ( is_array( $response_data['content'] )) {
			$response_data['content']['raw'] =  $post->post_content ;
			$response->set_data( $response_data );
		}

		return $response;
	}
	add_filter( "rest_prepare_post", 'add_raw_to_post', 10, 3 );
}



//table codes to be added
class editus_table {
    
    public function __construct(){
        $add_table = lasso_editor_get_option('add_table', 'lasso_editor', false);
        if ($add_table) {
            add_action('wp_enqueue_scripts', array($this,'scripts'));
            
        }
	}
    
    function scripts()
    {
        add_action('lasso_editor_controls_after_outside', array($this,'editus_table_edit_menu'));
            add_filter('lasso_components',array($this,'editus_components_add_table'),10,1);
            add_action( 'lasso_toolbar_components', array($this,'editus_toolbar_components_add_table'), 10 );
            wp_enqueue_style( 'editus-table-style', LASSO_URL.  '/public/assets/css/editus-table-edit-public.css', LASSO_VERSION, true );
            wp_enqueue_script( 'editus_table',  LASSO_URL. '/public/assets/js/editus-table-edit-public.js', array( 'jquery' ), LASSO_VERSION, true );
    }
    
    function editus_table_edit_menu()
    { ?>

        <ul class='editus-table-menu'>
          <li data-action="insertcol"><?php echo __('Insert Column','lasso')?></li>
          <li data-action="insertrow"><?php echo __('Insert Row','lasso')?></li>
          <li data-action="delcol"><?php echo __('Delete Column','lasso')?></li>
          <li data-action="delrow"><?php echo __('Delete Row','lasso')?></li>
        </ul>
    <?php
    }
    
    
    function editus_html_table()
    {   
        return '<figure class="wp-block-table"><table><tr><th>Cell 1</th><th>Cell 2</th></tr><tr><td>Cell 3</td><td>Cell 4</td></tr></table></figure><p></p>';
    }


    function editus_components_add_table( $array ){
        $custom = array(
               'htmltable' => array(
                         'name'    => __('HTML Table','lasso'),
                          'content' => self::editus_html_table(),
                )
        );
        return array_merge( $array, $custom );
    }


    function editus_toolbar_components_add_table( ) {
          ?>
          <li data-type="htmltable" title="<?php esc_attr_e( 'HTML Table', 'lasso' );?>" class="quote lasso-toolbar--component__htmltable dashicons dashicons-grid-view"></li>
          <?php
    }
}


new editus_table();

