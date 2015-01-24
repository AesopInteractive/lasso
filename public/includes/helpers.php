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
*	Check if the user is logged in and has teh correct capabilities
*	@since 1.0
*/
function lasso_editor_user_can_edit(){

	$is_capable = apply_filters('lasso_editor_capabilities', current_user_can('edit_posts') );

	if ( is_user_logged_in() && $is_capable ) {
		return true;
	} else {
		return false;
	}

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