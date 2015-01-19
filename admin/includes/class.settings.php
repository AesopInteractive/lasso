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

    // init the settings and feields
    function admin_init() {

        //set the settings
        $this->settings_api->set_sections( self::sections() );
        $this->settings_api->set_fields( self::fields() );

        //initialize settings
        $this->settings_api->admin_init();
    }

    // add menu page to options
	function menu_page() {
		add_submenu_page( 'options-general.php', 'Aesop Editor', __('Aesop Editor','aesop-editor'), 'manage_options', 'aesop-editor-settings', array($this,'page_content') );
	}

	// Draw the page wrap
	function page_content() {

		echo '<div class="wrap">';
			?><h2><?php _e('Aesop Editor Settings','aesop-editor');?></h2><?php

			$this->settings_api->show_navigation();
        	$this->settings_api->show_forms();

		echo '</div>';

	}


	// Draw the settings sections
    function sections() {
        $sections = array(
            array(
                'id' 	=> 'aesop_editor',
                'title' => __( 'Setup', 'aesop-editor' )
            ),
            array(
                'id' 	=> 'aesop_editor_advanced',
                'title' => __( 'Advanced', 'aesop-editor' )
            )
        );
        return $sections;
    }

    // Draw the settings fields
    function fields() {

        $settings_fields = array(
            'aesop_editor' => array(
            	array(
                    'name' 				=> 'article_class',
                    'label' 			=> __( 'Article Class', 'aesop-editor' ),
                    'desc' 				=> 'Provide the CSS class of container that holds the post. This should be the first parent container class that holds the_content.',
                    'type' 				=> 'text',
                    'default' 			=> '',
                    'sanitize_callback' => 'sanitize_text_field'
                ),
                array(
                    'name' 				=> 'featimg_class',
                    'label' 			=> __( 'Featured Image Class', 'aesop-editor' ),
                    'desc' 				=> 'Provide the CSS class that uses a featured image as a background image. This currently only supports themes that have the featured image set as background image.',
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
            ),
			'aesop_editor_advanced' => array(
            	array(
                    'name' 				=> 'post_save_disabled',
                    'label' 			=> __( 'Disable Post Saving', 'aesop-editor' ),
                    'desc' 				=> 'By default the editor will update the database with the post or page it is being used on. Check this box to disable this. If you check this box, it is assumed that you will be using the provided filters to save your own content.',
                    'type' 				=> 'checkbox',
                    'default' 			=> '',
                    'sanitize_callback' => 'sanitize_checkbox'
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

}

new aesopEditorSettings();






