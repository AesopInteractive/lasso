<?php
/**
*
*	Creates the settings panel
*
*/
require_once dirname( __FILE__ ) . '/class.settings-api.php';

class aesopEditorSettings {

    private $settings_api;

    const version = '1.0';

    function __construct() {

        $this->dir  		= plugin_dir_path( __FILE__ );
        $this->url  		= plugins_url( '', __FILE__ );
        $this->settings_api = new aesopEditor_Settings_API;

        add_action( 'admin_init', 						array($this, 'admin_init') );
        add_action( 'admin_menu', 						array($this,'menu_page'));

    }

    function admin_init() {

        //set the settings
        $this->settings_api->set_sections( self::sections() );
        $this->settings_api->set_fields( self::fields() );

        //initialize settings
        $this->settings_api->admin_init();
    }

	function menu_page() {
		add_submenu_page( 'options-general.php', 'Aesop Editor', __('Aesop Editor','aesop-editor'), 'manage_options', 'aesop-editor-settings', array($this,'page_content') );
	}


	function page_content() {

		echo '<div class="wrap">';
			?><h2><?php _e('Aesop Editor Settings','aesop-editor');?></h2><?php

			$this->settings_api->show_navigation();
        	$this->settings_api->show_forms();

		echo '</div>';

	}

    function sections() {
        $sections = array(
            array(
                'id' 	=> 'aesop_editor',
                'title' => __( 'Setup', 'aesop-editor' )
            )
        );
        return $sections;
    }

    function fields() {

		// test test echo aesop_editor_get_option('article_class','aesop_editor');

        $settings_fields = array(
            'aesop_editor' => array(
            	array(
                    'name' 				=> 'article_class',
                    'label' 			=> __( 'Article Class', 'aesop-editor' ),
                    'desc' 				=> 'Provide the CSS class of element that displays the post. This should be the first parent container class that holds the_content.',
                    'type' 				=> 'text',
                    'default' 			=> '',
                    'sanitize_callback' => 'sanitize_text_field'
                ),
                array(
                    'name' 				=> 'featimg_class',
                    'label' 			=> __( 'Featured Image Class', 'aesop-editor' ),
                    'desc' 				=> 'Provide the CSS class that uses a featured image as a background image. This currently only supports themes that have the featuree image set as background image.',
                    'type' 				=> 'text',
                    'default' 			=> '',
                    'sanitize_callback' => 'sanitize_text_field'
                ),
                array(
                    'name' 				=> 'title_class',
                    'label' 			=> __( 'Article Title Class', 'aesop-editor' ),
                    'desc' 				=> 'Provide the CSS class for the post title. This will enable you to update the title of the post by clicking and typing.',
                    'type' 				=> 'text',
                    'default' 			=> '',
                    'sanitize_callback' => 'sanitize_text_field'
                )
            )
        );

        return $settings_fields;
    }

    /**
    *
    *	Sanitize checkbox input
    *
    */
    function sanitize_checkbox( $input ) {

		if ( $input ) {

			$output = '1';

		} else {

			$output = false;

		}

		return $output;
	}

	/**
	*
	*	Sanitize integers
	*
	*/
	function sanitize_int( $input ) {

		if ( $input ) {

			$output = absint( $input );

		} else {

			$output = false;

		}

		return $output;
	}
}

new aesopEditorSettings();






