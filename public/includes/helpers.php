<?php

/**
 * Grab an optoin from our settings
 *
 * If we're on multsite we'll grab the site option which is stored in the main blogs site option tables, otherwise
 * we'll grab the option which is stored on the single blogs option tables
 *
 * @param unknown $option  string name of the option
 * @param unknown $section string name of the section
 * @param unknown $default string/int default option value
 * @return the option value
 * @since 1.0
 */
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

/**
 * Check to see if any Lasso galleries exist
 *
 * @since 1.0
 */
function lasso_editor_galleries_exist() {

	$q = new wp_query( array( 'post_type' => 'ai_galleries', 'post_status' => 'publish' ) );

	if ( $q->have_posts() )
		return true;
	else
		return false;
}

/**
 * Return a CSS class of an automatically supported theme
 *
 * @since 0.8.6
 * @return a css class if the theme is supported, false if nothing
 */
function lasso_get_supported_theme_class() {

	$name  	= wp_get_theme()->get('Name');
	$slug  	= lasso_clean_string( $name );

	switch ( $slug ) {

		case 'twentytwelve': // automattic
			$out = '.entry-content';
			break;
		case 'twentythirteen': // automattic
			$out = '.entry-content';
			break;
		case 'twentyfourteen': // automattic
			$out = '.entry-content';
			break;
		case 'twentyfifteen': // automattic
			$out = '.entry-content';
			break;
		case 'aesop-story-theme': // aesop
			$out = '.aesop-entry-content';
			break;
		case 'jorgen': // aesop
			$out = '.jorgen-entry-content';
			break;
		case 'novella': // aesop
			$out = '.novella-entry-content';
			break;
		case 'genji': // aesop
			$out = '.genji-entry-content';
			break;
		case 'kerouac': // aesop
			$out = '.kerouac-entry-content';
			break;
		case 'worldview': // upthemes
			$out = '.entry-content';
			break;
		case 'genesis': // genesis
			$out = '.entry-content';
			break;
		case 'camera': // array.is
			$out = '.entry-content';
			break;

	}

	return !empty( $out ) ? $out : false;
}

/**
*	Return a string of classes with items that Lasso will remove when entering the editor
*	so that we don't save them as HTML
*
*	@since 0.8.7
*	@return string of comma separated classes
*/
function lasso_supported_no_save(){

	return apply_filters('lasso_dont_save', '.lasso--ignore, .sharedaddy, .us_wrapper, .twitter-tweet');
}

/**
 * Generic sanitization, useful for sanitization of arrays.
 *
 * @since 0.9.2
 *
 * @param array|object|string $data Data to sanatize.
 *
 * @return array|mixed|object|string|void
 */
function lasso_sanitize_data( $data ) {
	return \lasso\sanatize::do_sanitize( $data );

}

/**
 *	Return a comma delimited list of categories for a specific post object
 *
 *	@since 0.9.3
 *	@return string of comma delimited category slugs
*/
function lasso_get_post_objects( $postid = '', $taxonomy = 'category') {

	if ( empty( $postid ) )
		$postid = get_the_ID();

	$objects = 'category' == $taxonomy ? get_the_category( $postid ) : get_the_tags( $postid );

	if ( empty( $objects) )
		return;

	$out = '';
	foreach( $objects as $object ) {
		$out .= $object->slug.', ';
	}

	return rtrim($out, ', ');

}

/**
 *	Return an array of categories for autocomplete
 *
 *	@since 0.9.3
 *	@return array all categoiries
*/
function lasso_get_objects( $taxonomy = 'category' ) {

	$objects = 'category' == $taxonomy ? get_categories(array('hide_empty' => 0)) : get_tags(array('hide_empty' => 0));

	if ( empty( $objects) )
		return;

	$out = array();
	foreach( $objects as $object ) {
		$out[] = $object->slug;
	}

	return $out;
}


/**
 * Get allowed post types for the post chooser modal.
 *
 *
 * @since 0.9.4
 */
function lasso_post_types() {

	$post_types = get_post_types( array(
		'public' => true,
	), 'objects' );
	$post_types = array_combine( array_keys( $post_types ), wp_list_pluck( $post_types, 'label' ) );
    unset( $post_types[ 'attachment' ] );

	/**
	 * Set which post types are allowed
	 *
	 * @since 0.9.4
	 *
	 * @param array $allowed_post_types Array of names (not labels) of allowed post types. Must be registered.
	 */
	$allowed_post_types = apply_filters( 'lasso_allowed_post_types', array( 'post', 'page' ) );
	foreach( $post_types as $name => $label ) {
		if ( ! in_array( $name, $allowed_post_types ) ) {
			unset( $post_types[ $name ] );
		}

	}

	return $post_types;

}

/**
*	Get an array of addon data for the settings modal
*	This is used by addons to add cool stuff to the settings modal as an additional tab
*
*	Example:
*	add_filter('lasso_modal_tabs', 'try_tabs');
*	function try_tabs( $tabs ){
*		$tabs[] = array(
*		  'name' => 'Tab',
*		  'callback' => 'mycallbackfunction'
*		);
*
*		return $tabs;
*	}
*	@since 0.9.4
*/
function lasso_get_modal_tabs(){

	$tabs = array();

	return apply_filters('lasso_modal_tabs', $tabs);

}

/**
*	Build a side tabs to fit alongside the post settings modal
*	This is used by addons to add cool stuff to the settings modal as an additional tab
*
*	@param $type string tab or content
*	@uses lasso_get_modal_tabs()
*	@uses lasso_modal_addons_content()
*	@since 0.9.4
*/
function lasso_modal_addons( $type = 'tab' ){

	$tabs = lasso_get_modal_tabs();
	$out = '';

	if ( $tabs ):

		if ( 'tab' == $type ) {

			$out = '<ul class="lasso--modal__tabs">';

				$out .= '<li class="active-tab" data-addon-name="core">core</li>';

				foreach ( $tabs as $tab ) {

					if ( isset( $tab ) ) {

						$out .= lasso_modal_addons_content( $tab, $type );
					}
				}

			$out .= '</ul>';

		} elseif ( 'content' == $type ) {


			foreach ( $tabs as $tab ) {

				if ( isset( $tab ) ) {
					$out .= lasso_modal_addons_content( $tab , $type );
				}
			}

		}

	endif;

	return !empty( $out ) ? $out : false;
}

/**
*	Used internally as a callback to build a tab or content area for modal addons
*
*	@param $tab object
*	@param $type string tab or content
*	@uses lasso_modal_addons()
*	@since 0.9.4
*/
function lasso_modal_addons_content( $tab = '', $type ){

	$name = lasso_clean_string( $tab['name'] );

	if ( 'tab' == $type ) {

		$out = sprintf( '<li data-addon-name="%s">%s</li>', $name, $tab['name'] );

	} else if ( 'content' == $type ){

		$content = is_callable( $tab['callback'] ) ? call_user_func($tab['callback']) : $tab['callback'];

		$out = sprintf( '<div class="lasso--modal__content not-visible" data-addon-content="%s">%s</div>', $name, $content );

	}

	return $out;
}

/**
*	Helper function to clean a sttring and replace spaces with dash
*
*	@param $string string content
*	@since 0.9.4
*/
function lasso_clean_string( $string = '' ) {

	if ( empty( $string ) )
		return;

	return sanitize_text_field( strtolower( preg_replace('/[\s_]/', '-', $string ) ) );
}


////////////////////
// PLUGGABLE
////////////////////

/**
 * Check if the user is logged in and has the correctly passed capability
 *
 * @param unknown $action string a capability such as edit_posts or publish_posts
 * @param unknown $postid int the id of the post object to check against
 * @since 1.0
 */
if ( !function_exists( 'lasso_user_can' ) ):
	function lasso_user_can( $action = '', $postid = 0 ) {

		if ( empty( $action ) )
			$action = 'edit_post';

		if ( empty( $postid ) )
			$postid = get_the_ID();

		if ( is_user_logged_in() && current_user_can( $action, $postid ) ) {

			return true;

		} else {

			return false;

		}

	}
endif;
