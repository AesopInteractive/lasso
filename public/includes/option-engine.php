<?php
/**
*	This is used by addons to add cool stuff to the settings modal as an additional tab
*
*	Example:
*	add_filter('lasso_modal_tabs', 'try_tabs');
*	function try_tabs( $tabs ){
*		$tabs[] = array(
*	  		'name' 	=> 'Tab',
*	  		'content' => 'mytestcallback',
*	  		'options'	=> 'myOptionsCallback'
*		);
*
*		return $tabs;
*	}
*	function myOptionsCallback(){
*
*		$options = array(
*			array(
*				'id'		=> 'title',
*				'name' 		=> 'Title',
*				'type'		=> 'text',
*				'default'	=> 'default',
*				'desc'		=> 'Cool'
*			),
*			array(
*				'id'		=> 'another',
*				'name' 		=> 'Another',
*				'type'		=> 'textarea',
*				'default'	=> 'default',
*				'desc'		=> 'Awesome'
*			)
*		);
*
*		return $options;
*
*	}
*
*	@since 0.9.4
*/

/**
*	Get an array of addon data for the settings modal
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

				$out .= '<li class="active-tab" data-addon-name="core">Lasso</li>';

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
*	Build a post meta options form
*
*	@param $name string the name of this tab being logged
*	@param $options array an array of option fields in the format below
*
*					array(
*						'id'		=> 'title',
*						'name' 		=> 'Title',
*						'type'		=> 'text',
*						'default'	=> 'default',
*						'desc'		=> 'My description'
*					)
*
*	@since 0.9.5
*	@subpackage lasso_modal_addons_content
*/
function lasso_option_form( $name = '', $options = array() ){

	ob_start();

	if ( empty( $name ) || empty( $options ) || !is_array( $options ) )
		return;

	$nonce = wp_create_nonce('lasso-process-post-meta');
	$key   = sprintf('_lasso_%s_settings', $name );

	$out = sprintf('<form id="lasso--post-form" class="lasso--post-form">' );

		$out .= lasso_option_fields( $name, $options );
		$out .='<div class="form--bottom">';
			$out .='<input type="submit" value="Save">';
			$out .='<input type="hidden" name="tab_name" value="'.$key.'">';
			$out .='<input type="hidden" name="post_id" value="'.get_the_ID().'">';
			$out .='<input type="hidden" name="nonce" value="'.$nonce.'">';
			$out .='<input type="hidden" name="action" value="process_meta_update">';
		$out .='</div>';

	$out .= '</form>';

	echo $out;

	return ob_get_clean();

}

/**
*	Build settings fields for lasso_option_form
*
*	@param $name string the name of this tab being logged
*	@param $options array an array of option fields in the format above
*	@since 0.9.5
*	@subpackage lasso_modal_addons_content
*/
function lasso_option_fields( $name = '', $options = array() ){

	$out 	= '';
	$before = '<div class="lasso--postsettings__option">';
	$after 	= '</div>';

	if ( empty( $name ) || empty( $options ) )
		return;

	foreach ( (array) $options as $option ) {

		$type = isset( $option['type'] ) ? $option['type'] : 'text';

		switch ( $type ) {
			case 'text':
				$out .= sprintf('%s%s%s', $before, lasso_option_engine_option( $name, $option,'text' ), $after );
				break;
			case 'textarea':
				$out .= sprintf('%s%s%s', $before, lasso_option_engine_option( $name, $option,'textarea' ), $after );
				break;
			case 'checkbox':
				$out .= sprintf('%s%s%s', $before, lasso_option_engine_option( $name, $option,'checkbox' ), $after );
				break;
		}

	}

	return $out;
}


/**
*	Build settings inputs for settings fields
*
*	@param $name
*	@param $option mixed object
*	@param $type string text, textarea, checkbox, color
*	@since 5.0
*/
function lasso_option_engine_option( $name = '', $option = '', $type = '') {

	if ( empty( $type ) || empty( $option ) )
		return;

	$id = isset( $option['id'] ) ? $option['id'] : false;
	$id = $id ? lasso_clean_string( $id ) : false;

	$desc = isset( $option['desc'] ) ? $option['desc'] : false;

	$value = get_post_meta( get_the_id(), $option[ 'id' ], true );

	switch ( $type ) {
		case 'text':
			$out = sprintf('<label for="lasso--post-option-%s">%s</label><input id="lasso--post-option-%s" name="%s" type="text" value="%s">',$id, esc_html( $desc ), $id, $id, $value );
			break;
		case 'textarea':
			$out = sprintf('<label for="lasso--post-option-%s">%s</label><textarea id="lasso--post-option-%s" name="%s">%s</textarea>',$id, esc_html( $desc ), $id, $id, $value );
			break;
		case 'checkbox':
			$out = sprintf('<label for="lasso--post-option-%s" class="checkbox-control checkbox"><input id="lasso--post-option-%s" type="checkbox" name="%s" class="checkbox"><span class="control-indicator"></span>%s',$id, $id, $id ,esc_html( $desc ) );
			break;
	}

	return $out;

}

