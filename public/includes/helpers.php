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
function aesop_editor_get_option( $option, $section, $default = '' ) {

	if ( empty( $option ) )
		return;

    $options = get_option( $section );


    if ( isset( $options[$option] ) ) {
        return $options[$option];
    }

    return $default;
}

/**
*
*	Check if the user is logged in and has teh correct capabilities
*/
function aesop_editor_user_can_edit(){

	$is_capable = apply_filters('aesop_editor_capabilities', current_user_can('edit_posts') );

	if ( is_user_logged_in() && $is_capable ) {
		return true;
	} else {
		return false;
	}

}

