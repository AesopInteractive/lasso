<?php
/**
 * AH Editor
 *
 * @package   Lasso
 * @author    Nick Haskins <nick@aesopinteractive.com>
 * @license   GPL-2.0+
 * @link      http://aesopinteractive.com
 * @copyright 2015-2017 Aesopinteractive 
 */
namespace lasso_public_facing;
/**
 *
 *
 * @package Lasso
 * @author  Nick Haskins <nick@aesopinteractive.com>
 */
class lasso {

	/**
	 *
	 *
	 * @since    0.0.1
	 *
	 * @var      string
	 */
	protected $plugin_slug = 'lasso';

	/**
	 * Instance of this class.
	 *
	 * @since    0.0.1
	 *
	 * @var      object
	 */
	protected static $instance = null;

	/**
	 *
	 *
	 * @since     0.0.1
	 */
	private function __construct() {

		require_once LASSO_DIR.'/public/includes/underscore-templates.php';

		require_once LASSO_DIR.'/public/includes/editor-modules.php';
		require_once LASSO_DIR.'/public/includes/helpers.php';
		require_once LASSO_DIR.'/public/includes/editor-modules--gallery.php';
		require_once LASSO_DIR.'/public/includes/components.php';
		require_once LASSO_DIR.'/public/includes/option-engine.php';
		require_once LASSO_DIR.'/public/includes/wrap-shortcodes.php';

		// Activate plugin when new blog is added
		add_action( 'wpmu_new_blog', array( $this, 'activate_new_site' ) );

		// Load plugin text domain
		add_action( 'init', array( $this, 'load_plugin_textdomain' ) );
		
		add_action( 'wp_ajax_get_aesop_component',     array( $this, 'get_aesop_component' ) );
		add_action( 'wp_ajax_editus_do_shortcode',     array( $this, 'editus_do_shortcode' ) );
		add_action( 'wp_ajax_editus_lock_post',     array( $this, 'editus_lock_post' ) );
		add_action( 'wp_ajax_editus_unlock_post',     array( $this, 'editus_unlock_post' ) );
		add_action( 'wp_ajax_editus_hide_tour',     array( $this, 'editus_hide_tour' ) );
		add_action( 'wp_ajax_editus_set_post_setting',     array( $this, 'editus_set_post_setting' ) );
		add_action( 'wp_ajax_editus_get_ase_options',     array( $this, 'get_ase_options' ) );
		add_action( 'wp_ajax_editus_delete_post',     array( $this, 'delete_post' ) );
		add_action( 'wp_ajax_editus_featured_img',     array( $this, 'set_featured_img' ) );
		add_action( 'wp_ajax_editus_del_featured_img',     array( $this, 'del_featured_img' ) );

		// enable saving custom fields through REST API
		self::enable_metasave('post');
		self::enable_metasave('page');
		//enqueue assets
		new assets();

	}

	/**
	 * Return the plugin slug.
	 *
	 * @since    0.0.1
	 *
	 * @return    Plugin slug variable.
	 */
	public function get_plugin_slug() {
		return $this->plugin_slug;
	}

	/**
	 * Return an instance of this class.
	 *
	 * @since     0.0.1
	 *
	 * @return    object    A single instance of this class.
	 */
	public static function get_instance() {

		// If the single instance hasn't been set, set it now.
		if ( null == self::$instance ) {
			self::$instance = new self;
		}

		return self::$instance;
	}

	/**
	 * Fired when the plugin is activated.
	 *
	 * @since    0.0.1
	 *
	 * @param boolean $network_wide True if WPMU superadmin uses
	 *                                       "Network Activate" action, false if
	 *                                       WPMU is disabled or plugin is
	 *                                       activated on an individual blog.
	 */
	public static function activate( $network_wide ) {

		if ( function_exists( 'is_multisite' ) && is_multisite() ) {

			if ( $network_wide  ) {

				// Get all blog ids
				$blog_ids = self::get_blog_ids();

				foreach ( $blog_ids as $blog_id ) {

					switch_to_blog( $blog_id );
					self::single_activate();
				}

				restore_current_blog();

			} else {
				self::single_activate();
			}

		} else {
			self::single_activate();
		}

	}

	/**
	 * Fired when the plugin is deactivated.
	 *
	 * @since    0.0.1
	 *
	 * @param boolean $network_wide True if WPMU superadmin uses
	 *                                       "Network Deactivate" action, false if
	 *                                       WPMU is disabled or plugin is
	 *                                       deactivated on an individual blog.
	 */
	public static function deactivate( $network_wide ) {

		if ( function_exists( 'is_multisite' ) && is_multisite() ) {

			if ( $network_wide ) {

				// Get all blog ids
				$blog_ids = self::get_blog_ids();

				foreach ( $blog_ids as $blog_id ) {

					switch_to_blog( $blog_id );
					self::single_deactivate();

				}

				restore_current_blog();

			} else {
				self::single_deactivate();
			}

		} else {
			self::single_deactivate();
		}

	}

	/**
	 * Fired when a new site is activated with a WPMU environment.
	 *
	 * @since    0.0.1
	 *
	 * @param int     $blog_id ID of the new blog.
	 */
	public function activate_new_site( $blog_id ) {

		if ( 1 !== did_action( 'wpmu_new_blog' ) ) {
			return;
		}

		switch_to_blog( $blog_id );
		self::single_activate();
		restore_current_blog();

	}

	/**
	 * Get all blog ids of blogs in the current network that are:
	 * - not archived
	 * - not spam
	 * - not deleted
	 *
	 * @since    0.0.1
	 *
	 * @return   array|false    The blog ids, false if no matches.
	 */
	private static function get_blog_ids() {

		global $wpdb;

		// get an array of blog ids
		$sql = "SELECT blog_id FROM $wpdb->blogs
			WHERE archived = '0' AND spam = '0'
			AND deleted = '0'";

		return $wpdb->get_col( $sql );

	}

	/**
	 * Fired for each blog when the plugin is activated.
	 *
	 * @since    0.0.1
	 */
	private static function single_activate() {

		$curr_version = get_option( 'lasso_version' );

		// update upgraded from
		if ( $curr_version ) {
			update_option( 'lasso_updated_from', $curr_version );
		}

		// update lasso version option
		update_option( 'lasso_version', LASSO_VERSION );

		// set transietn for activation welcome
		set_transient( '_lasso_welcome_redirect', true, 30 );


	}

	/**
	 * Fired for each blog when the plugin is deactivated.
	 *
	 * @since    0.0.1
	 */
	private static function single_deactivate() {
		// @TODO: Define deactivation functionality here
	}

	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    1.0.0
	 */
	public function load_plugin_textdomain() {

		$domain = $this->plugin_slug;
		$locale = apply_filters( 'plugin_locale', get_locale(), $domain );

		$out = load_textdomain( $domain, trailingslashit( LASSO_DIR ). 'languages/' . $domain . '-' . $locale . '.mo' );
	}
	
    // new ajax function to lock post for editing
	public function editus_lock_post()
	{
		$post_id= $_POST["postid"];
		$locked = wp_check_post_lock($post_id);
		
		if (!$locked) {
		    wp_set_post_lock($post_id);
			echo "true";
		} else {
			$user_info = get_userdata($locked);
			echo "Post opened by ".$user_info->first_name .  " " . $user_info->last_name;
		}
		exit;
	}
	
	public function editus_unlock_post()
	{
		$post_id= $_POST["postid"];
		$locked = wp_check_post_lock($post_id);
		delete_post_meta( $post_id, '_edit_lock');
		echo "true";
		
		exit;
	}
	
	// new ajax function to update tour setting
	public function editus_hide_tour()
	{
		$user_id = get_current_user_ID();
				
		update_user_meta( $user_id, 'lasso_hide_tour', true );
		exit;
	}
	
	public function editus_set_post_setting()
	{
		
		
		$data = array();
		parse_str($_POST['data'], $data);
		
		if (!wp_verify_nonce( $data[ 'nonce' ], 'lasso-update-post-settings' )) {
			wp_send_json_error();
			exit;
		}
		
		$status = isset( $data['status'] ) ? $data['status'] : false;
		$postid = isset( $data['postid'] ) ? $data['postid'] : false;
		$slug   = isset( $data['story_slug'] ) ? $data['story_slug'] : false;
	

		$args = array(
			'ID'   			=> (int) $postid,
			'post_name'  	=> $slug,
			'post_status' 	=> $status
		);
		
		

		wp_update_post( apply_filters( 'lasso_object_status_update_args', $args ) );
		
		// update categories
		$cats  = isset( $data['story_cats'] ) ? $data['story_cats'] : false;
		
		self::set_post_terms( $postid, $cats, 'category' );
		
		// update tags
		$tags = isset( $data['story_tags'] ) ? $data['story_tags'] : false;
		self::set_post_terms( $postid, $tags, 'post_tag' );
		
		//update date
		$date  = isset( $data['post_date'] ) ? $data['post_date'] : false;
		self::set_date( $postid, $date );
		
		do_action( 'lasso_post_updated', $postid, $slug, $status, get_current_user_ID() );
		$response= array(
			'link'   => get_permalink($postid). (($status=='publish') ? '' : '&preview=true')
		);
		wp_send_json_success($response);
		exit;
	}
	
	public static function enable_metasave($type)
	{
		register_rest_field( $type, 'metadata', array(
			'get_callback' => function ( $data ) {
				return get_post_meta( $data['id']);//, '', '' );
			}, 
			'update_callback' => function( $data, $post ) {
				foreach ($data as $key => $value) {
					update_post_meta($post->ID, $key, $value);
				}
				return true;
			}
		));
	}
	
	public function editus_do_shortcode()
	{
		
		$code= $_POST["code"];
		$code = str_replace('\"', '"', $code);
		
		$code_wrapped = lasso_wrap_shortcodes( $code);
		$out =  do_shortcode($code);
		if ($out != '') {
			$out =  do_shortcode($code_wrapped);
			echo $out;
			exit;
		}
		
		// do_shortcode didn't work. Try again using wp_embed

		/** @var \WP_Embed $wp_embed */
		global $wp_embed;
		$wp_embed->post_ID = $_POST["ID"];
		$out =$wp_embed->run_shortcode( $code_wrapped );
		
		echo $out;
		exit;
	}
	
	public function get_aesop_component()
	{
		
		
		$code= $_POST["code"];
		$atts = array(
		 );
		foreach ($_POST as $key => $value) {
			if ($key !="code" && $key !="action") {
			    //$shortcode = $shortcode.$key.'="'.$value.'" ';
				$atts[$key] = $value;
			}
		}
		if ($code == "aesop_video") {
		    require_once( ABSPATH . '/wp-content/plugins/aesop-story-engine/public/includes/components/component-video.php');
		    echo aesop_video_shortcode($atts);
		}
		else if ($code == "aesop_image") {
		    require_once( ABSPATH . '/wp-content/plugins/aesop-story-engine/public/includes/components/component-image.php');
		    echo aesop_image_shortcode($atts);
		}
		else if ($code == "aesop_quote") {
		    require_once( ABSPATH . '/wp-content/plugins/aesop-story-engine/public/includes/components/component-quote.php');
		    echo aesop_quote_shortcode($atts);
		}
		else if ($code == "aesop_parallax") {
		    require_once( ABSPATH . '/wp-content/plugins/aesop-story-engine/public/includes/components/component-parallax.php');
		    echo aesop_parallax_shortcode($atts);
		}
		else if ($code == "aesop_character") {
		    require_once( ABSPATH . '/wp-content/plugins/aesop-story-engine/public/includes/components/component-character.php');
		    echo aesop_character_shortcode($atts);
		}
		else if ($code == "aesop_collection") {
		    require_once( ABSPATH . '/wp-content/plugins/aesop-story-engine/public/includes/components/component-collections.php');
		    echo aesop_collection_shortcode($atts);
		}
		else if ($code == "aesop_chapter") {
		    require_once( ABSPATH . '/wp-content/plugins/aesop-story-engine/public/includes/components/component-heading.php');
		    echo aesop_chapter_shortcode($atts);
		}
		else if ($code == "aesop_content") {
		    require_once( ABSPATH . '/wp-content/plugins/aesop-story-engine/public/includes/components/component-cbox.php');
		    echo aesop_content_shortcode($atts, $atts['content_data']);
		}
		else if ($code == "aesop_gallery") {
		    require_once( ABSPATH . '/wp-content/plugins/aesop-story-engine/public/includes/components/component-gallery.php');
		    echo do_shortcode( '[aesop_gallery id="'.$atts["id"].'"]');
		}
		else if ($code == "aesop_audio") {
		    require_once( ABSPATH . '/wp-content/plugins/aesop-story-engine/public/includes/components/component-audio.php');
		    echo aesop_audio_shortcode($atts);
		}
		else {
			$code = '['.$code.' ';
			foreach ($atts as $key => $value) {
			    $code = ''.$key.'="'.$value.'" ';
			}
			$code = $code.']';
			echo do_shortcode($code);
		    //require_once( ABSPATH . '/wp-content/plugins/aesop-events/public/includes/shortcode.php');
		    //echo aesop_audio_shortcode($atts);
		}
		
		exit; 
	}
	
	
	public function get_ase_options()
	{
		$blob = lasso_editor_options_blob();
		$code= $_POST["component"];
		echo $blob[$code];
		exit; 
	}
	
	public function delete_post( ) {

		$postid = isset( $_POST['postid'] ) ? $_POST['postid'] : false;

		// bail out if teh current user can't publish posts
		if ( !lasso_user_can( 'delete_post', $postid ) )
			return;
		
		if (!wp_verify_nonce( $_POST[ 'nonce' ], 'lasso_delete_post' )) {
			wp_send_json_error();
			exit;
		}

		$args = array(
			'ID'   			=> (int) $postid,
			'post_status' 	=> 'trash'
		);

		wp_update_post( apply_filters( 'lasso_object_deleted_args', $args ) );

		do_action( 'lasso_object_deleted', $postid, get_current_user_ID() );

		exit;
	}
	
	public function set_featured_img( ) {

		$postid  	= isset( $_POST['postid'] ) ? $_POST['postid'] : false;
		$image_id  	= isset( $_POST['image_id'] ) ? absint( $_POST['image_id'] ) : false;
		if (!wp_verify_nonce( $_POST[ 'nonce' ], 'lasso_gallery' )) {
			wp_send_json_error();
			exit;
		}	

		set_post_thumbnail( $postid, $image_id );

		do_action( 'lasso_featured_image_set', $postid, $image_id, get_current_user_ID() );

		exit;
	}
	
	public function del_featured_img( ) {

		$postid  = isset( $_POST['postid'] ) ? $_POST['postid'] : false;
		if (!wp_verify_nonce( $_POST[ 'nonce' ], 'lasso_gallery' )) {
			wp_send_json_error();
			exit;
		}	

		delete_post_thumbnail( $postid );

		do_action( 'lasso_featured_image_deleted', $postid, get_current_user_ID() );

		exit;
	}
	
	/*public function revision_get( ) {
		$args = array();
		if ( isset( $_POST[ 'limit' ] ) ) {
			$args[ 'posts_per_page' ] = $data[ 'limit' ];
		}else{
			$args[ 'posts_per_page' ] = 6; // we start at revision 0
		}

		$revisions = wp_get_post_revisions( $_POST[ 'postid' ], $args  );
		if ( is_array( $revisions )  && ! empty( $revisions )  ) {
			self::set_revisions( $data[ 'postid' ], $revisions );
		}

		return self::$revisions;
	}*/
	
	public function set_post_terms( $postid, $value, $taxonomy ) {
		if( $value ) {
			$value = explode( ',', $value );
			$allow_new_category = lasso_editor_get_option( 'allow_new_category', 'lasso_editor' );
			
			if ($taxonomy =='category') {
                // convert from names to category ids
				$cats = array();
				foreach ($value as $cat) {
					$cat_id = get_cat_ID($cat);
					if ($cat_id !=0) {
						$cats [] = $cat_id;
					} else if ($allow_new_category) {
					    $cats [] = wp_create_category($cat);
					}
				}
				$value = $cats;
			}
	
			$result = wp_set_object_terms( $postid, $value, $taxonomy );
		}
		else  {
			//remove all terms from post
			$result = wp_set_object_terms( $postid, null, $taxonomy );
		}

		if ( ! is_wp_error( $result ) ) {
			return true;
		}else{
			return false;
		}
	}
	
	function getEnglishMonthName($foreignMonthName){

		  setlocale(LC_ALL, 'en_US');

		  $month_numbers = range(1,12);

		  foreach($month_numbers as $month)
			$english_months[] = strftime('%B',mktime(0,0,0,$month,1,2011));

		  setlocale(LC_ALL, get_locale());

		  foreach($month_numbers as $month)
			$foreign_months[] = utf8_encode(strftime('%B',mktime(0,0,0,$month,1,2011)));

		  return str_replace($foreign_months, $english_months, $foreignMonthName);
	}


	
	public function set_date( $postid, $value) {
		if( $value ) {
			$value = self::getEnglishMonthName($value)." ".date("H:i:s", current_time( 'timestamp', 1 ));
            wp_update_post(
				array (
					'ID'            => $postid, // ID of the post to update
					'post_date'     => date( 'Y-m-d H:i:s',  strtotime($value) ),
					'post_date_gmt'     => gmdate( 'Y-m-d H:i:s',  strtotime($value) ),
				)
			);
		}
	}
}
