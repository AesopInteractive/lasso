<?php

/**
*
*	Grab an optoin from our settings
*
*	@param $option string name of the option
*	@param $section string name of the section
*	@param $default string/int default option value
*	@return the option value
*	@since 1.0
*/
function lasso_editor_get_option( $option, $section, $default = '' ) {

	if ( empty( $option ) )
		return;

	if ( function_exists('is_multisite') && is_multisite() ) {

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
*
*	Check to see if any Lasso galleries exist
*	@since 1.0
*/
function lasso_editor_galleries_exist(){

	$q = new wp_query(array('post_type' => 'ai_galleries','posts_per_page' => -1,'post_status' => 'publish'));

	if ( $q->have_posts() )
		return true;
	else
		return false;
}

/**
*
*	Get a list of themes automatically supported by Lasso and return their contents CSS class
*
*	@param $textdomain string the textdomain of the WordPress theme. We're using the textdomain because it's automatically slugified by the author and its easy.
*	@since 0.8.6
*	@return a css class if the theme is supported, false if nothing
*/
function lasso_supported_themes( $textdomain = '' ) {

	if ( empty( $textdomain ) )
		return;

	switch ( $textdomain ) {

		case 'twentytwelve':
			$out = '.entry-content';
			break;
		case 'twentythirteen':
			$out = '.entry-content';
			break;
		case 'twentyfourteen':
			$out = '.entry-content';
			break;
		case 'twentyfifteen':
			$out = '.entry-content';
			break;
		case 'aesop-story-theme':
			$out = '.aesop-entry-content';
			break;
		default:
			$out = '.entry-content';
			break;
	}

	return $out ? $out : false;
}

////////////////////
// PLUGGABLE
////////////////////

/**
*
*	Check if the user is logged in and has the correctly passed capability
*
*	@param $action string a capability such as edit_posts or publish_posts
*	@since 1.0
*/
if ( !function_exists('lasso_user_can') ):
	function lasso_user_can( $action = 'edit_post' ){

		if ( is_user_logged_in() && current_user_can( $action ) ) {
			return true;
		} else {
			return false;
		}

	}
endif;
