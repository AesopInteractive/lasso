<?php

/**
 * Grab an option from our settings
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
		case 'zealot': // aesop
			$out = '.zealot-entry-content';
			break;
		case 'fable': // aesop
			$out = '.fable--entry-content';
			break;
		case 'canvas': // wootheme..err...Automattic
			$out = '.entry';
			break;
		case 'kleo': // 
			$out = '.article-content';
			break;
		//case 'exposure': // 
		//	$out = '.entry-content';
		//	break;
		//case 'lore': // 
		//	$out = '.entry-content';
		//	break;
		//case 'worldview': // upthemes
		//	$out = '.entry-content';
		//	break;
		//case 'genesis': // genesis
		//	$out = '.entry-content';
		//	break;
		//case 'camera': // array.is
		//	$out = '.entry-content';
		//	break;
		case 'longform': 
			$out = '.entry-content-wrapper';
			break;

	}

	return apply_filters('lasso_content_class', !empty( $out ) ? $out : false);
	//return !empty( $out ) ? $out : false;
}

function lasso_get_supported_theme_title_class() {

	$name  	= wp_get_theme()->get('Name');
	$slug  	= lasso_clean_string( $name );

	switch ( $slug ) {

		case 'aesop-story-theme': // aesop
			$out = '.aesop-entry-title';
			break;
		case 'jorgen': // aesop
			$out = '.jorgen-entry-title';
			break;
		case 'genji': // aesop
			$out = '.genji-entry-title';
			break;
		case 'kerouac': // aesop
			$out = '.kerouac-entry-title';
			break;
		case 'zealot': // aesop
			$out = '.zealot-entry-title';
			break;
		case 'fable': // aesop
			$out = '.fable--entry-title';
			break;
		case 'kleo': // 
			$out = '.page-title';
			break;
		case 'longform': // 
			$out = '.entry-title';
			break;
	}

	return apply_filters('lasso_title_class', !empty( $out ) ? $out : false);
}

//since 0.9.9.6
function lasso_get_supported_theme_featured_image_class() {

	$name  	= wp_get_theme()->get('Name');
	$slug  	= lasso_clean_string( $name );

	return apply_filters('lasso_featured_image_class', !empty( $out ) ? $out : false);
}


/**
*	Return a string of classes with items that Lasso will remove when entering the editor
*	so that we don't save them as HTML
*
*	@since 0.8.7
*	@return string of comma separated classes
*/
function lasso_supported_no_save(){

	return apply_filters('lasso_dont_save', '.lasso--ignore, .sharedaddy, .us_wrapper, .twitter-tweet, .meta, .edit-link, .ssba, .jp-relatedposts, .fb-comments');
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
		//$out .= $object->slug.', ';
		$out .= $object->name.', ';
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

	$out = "";
	foreach( $objects as $object ) {
		$out .= $object->name.',';
	}

	return $out;
}


/**
 * Get allowed post types for the post chooser modal.
 *
 *
 * @since 0.9.4
 */
function lasso_post_types_names() {
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
	$allowed_post_types = lasso_editor_get_option( 'allowed_post_types', 'lasso_editor', array( 'post', 'page') );
	$allowed_post_types = apply_filters( 'lasso_allowed_post_types', $allowed_post_types );
	if (!current_user_can('edit_pages')) {
		$allowed_post_types = array_diff($allowed_post_types,array('page'));
	}
	foreach( $post_types as $name => $label ) {
		if ( ! in_array( $name, $allowed_post_types ) ) {
			unset( $post_types[ $name ] );
		}
	}
	return $post_types;
}


function lasso_post_types() {
	$post_types = get_post_types( array(
		'public' => true,
	), 'names' );
	//$post_types = array_combine( array_keys( $post_types ), wp_list_pluck( $post_types, 'label' ) );
    unset( $post_types[ 'attachment' ] );

	/**
	 * Set which post types are allowed
	 *
	 * @since 0.9.4
	 *
	 * @param array $allowed_post_types Array of names (not labels) of allowed post types. Must be registered.
	 */
	$allowed_post_types = lasso_editor_get_option( 'allowed_post_types', 'lasso_editor', array( 'post') );
	$allowed_post_types = apply_filters( 'lasso_allowed_post_types', $allowed_post_types );
	foreach( $post_types as $name => $label ) {
		if ( ! in_array( $name, $allowed_post_types ) ) {
			unset( $post_types[ $name ] );
		}
	}
	return $post_types;
}



////////////////////
// INTERNAL
////////////////////
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

		$content = isset( $tab['content'] ) && is_callable( $tab['content'] ) ? call_user_func( $tab['content'] ) : false;
		$options = isset( $tab['options'] ) && is_callable( $tab['options'] ) ? call_user_func( $tab['options'] ) : false;

		$out = sprintf( '<div class="lasso--modal__content not-visible" data-addon-content="%s">
			%s%s
			</div>', $name, $content, lasso_option_form( $name, $options ) );

	}

	return $out;
}

/**
*	Helper function to clean a string and replace spaces with dash
*
*	@param $string string content
*	@since 0.9.4
*
* @return void|string
*/
function lasso_clean_string( $string = '' ) {

	if ( empty( $string ) )
		return;

	return sanitize_text_field( strtolower( preg_replace('/[\s_]/', '-', $string ) ) );
}

/**
 *	Helper function to switch - to _ after having.
 *
 * This is the evil twin of lasso_clean_string() and may or may not make your data forever unclean.
 *
 *	@param $string string content
 *	@since 0.9.5
 *
 * @return void|string
 */
function lasso_unclean_string( $string = '' ) {

	if ( empty( $string ) ) {
		return;
	}

	return sanitize_text_field( strtolower( str_replace( '-', '_', $string ) ) );
}


////////////////////
// PLUGGABLE
////////////////////

/**
 * Check if the user is logged in and has the correctly passed capability
 *
 * @param unknown $action string a capability such as edit_posts or publish_posts
 * @param unknown $postid int the id of the post object to check against
 * @since 0.9.9.7 added filter 'lasso_user_can_filter'
 */
if ( !function_exists( 'lasso_user_can' ) ):
	function lasso_user_can( $action = '', $postid = 0 ) {
        $result = false;
		if ( empty( $action ) )
			$action = 'edit_posts';

		if ( empty( $postid ) )
			$postid = get_the_ID();

		if ( is_user_logged_in() && current_user_can( $action, $postid ) ) {
			// check against post types:
			$allowed_post_types = lasso_editor_get_option( 'allowed_post_types', 'lasso_editor', array( 'post', 'page') );
			
			if (!current_user_can('edit_pages')) {
				$allowed_post_types = array_diff($allowed_post_types,array('page'));
			}
			
            if (!empty($allowed_post_types) && !empty($postid)) {
				$type = get_post_type( $postid );
                $allowed_post_types = apply_filters( 'lasso_allowed_post_types', $allowed_post_types );
				
                if ( in_array( $type, $allowed_post_types ) ) {
				   $result =  true;
			    }
            } else {
                //we are not checking against a post, return true
				$result =  true;
        	}
		} else {
			$result = false;
		}
		
		return apply_filters( 'lasso_user_can_filter', $result,  $action, $postid);
	}
endif;

/**
*	Empty state message thats shown when no data available
*
*	@since 0.9.5
*/
if ( !function_exists('lasso_editor_empty_results') ):

	function lasso_editor_empty_results( $type = 'posts' ){

		if ( 'posts' == $type ) {

			$string = apply_filters('lasso_empty_state_message', __('No posts to show', 'lasso') );
			$icon = 'lasso-icon-file-text2';
			$button = false;

		} elseif ( 'revision' == $type ) {

			$string = apply_filters('lasso_empty_state_message', __('No revisions found', 'lasso') );
			$icon = 'lasso-icon-history';
			$button = sprintf('<a href="#" class="lasso--btn-secondary" id="lasso--close-modal">%s</a>', __('Close','lasso') );

		}

		return sprintf('<div id="lasso--empty-state" class="lasso--empty-state"><i class="lasso--empty-state-icon lasso-icon %s"></i><p>%s</p>%s</div>', $icon, $string, $button );
	}

endif;














