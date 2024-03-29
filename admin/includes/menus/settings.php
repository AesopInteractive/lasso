<?php
/**
 * Class responsible for adding a settings submenu
 *
 */
namespace lasso_admin\menus;

class settings {

	function __construct() {

		add_action( 'admin_menu',     array( $this, 'menu' ) );
		add_action( 'network_admin_menu',   array( $this, 'menu' ) );
		add_action( 'wp_ajax_lasso-editor-settings', array( $this, 'process_settings' ) );

	}

	/**
	 * Add a submenu page to the "Settings" tab if network activated, otherwise add to our menu page
	 *
	 * @since 1.0
	 */
	function menu() {

		// CHANGED Removed condition.
		add_submenu_page( 'lasso-editor', __( 'Settings', 'lasso' ), __( 'Settings', 'lasso' ), 'manage_options', 'lasso-editor-settings', array( $this, 'settings' ) );

	}

	/**
	 * Submenu page callback
	 *
	 * @since 1.0
	 */
	function settings() {

		echo self::lasso_editor_settings_form();
	}

	/**
	 * Save settings via ajax
	 *
	 * @since 1.0
	 */
	function process_settings() {

		// bail out if current user isn't and administrator and they are not logged in
		if ( !current_user_can( 'manage_options' ) || !is_user_logged_in() )
			return;

		if ( isset( $_POST['action'] ) && 'lasso-editor-settings' == $_POST['action'] && check_admin_referer( 'nonce', 'lasso_editor_settings' ) ) {

			$options = isset( $_POST['lasso_editor'] ) ? $_POST['lasso_editor'] : false;
			
			$arr = $options['allowed_post_types'];
			$options = array_map( 'sanitize_text_field', $options );
			$options['allowed_post_types'] = array_keys( $arr);

			

			if ( function_exists( 'is_multisite' ) && is_multisite() ) {

				update_site_option( 'lasso_editor', $options );

			} else {

				update_option( 'lasso_editor', $options );
			}

			wp_send_json_success();

		} else {

			wp_send_json_error();

		}

		die();

	}
	
	function create_section_for_color_picker($id, $title, $defvalue) { 
		$color_value = lasso_editor_get_option( $id, 'lasso_editor',$defvalue );
	 
		echo '<div lass="lasso-editor-settings--option-inner">'."\n";
		echo '<label>'.$title.'</label>';
		echo '<input type="text" name="lasso_editor['.$id.']" value="'.$color_value.'" id="lasso-editor-'.$title.'" class="color-picker"/>';
		echo "</div>\n";
	 }

	/**
	 * Draw the settings form
	 *
	 * @since 1.0
	 */
	function lasso_editor_settings_form() {

		if ( !is_user_logged_in() )
			return;
        
        // check for lasso story engine and add a class doniting this
        $ase_status = class_exists( 'Aesop_Core' ) || defined( 'LASSO_CUSTOM' ) ? 'ase-active' : 'ase-not-active';

		$article_object   = lasso_editor_get_option( 'article_class', 'lasso_editor' );
		$featImgClass    = lasso_editor_get_option( 'featimg_class', 'lasso_editor' );
		$titleClass    = lasso_editor_get_option( 'title_class', 'lasso_editor' );

		$post_new_disabled   = lasso_editor_get_option( 'post_adding_disabled', 'lasso_editor' );
		$save_to_post_disabled  = lasso_editor_get_option( 'post_save_disabled', 'lasso_editor' );
		$edit_post_disabled  = lasso_editor_get_option( 'post_edit_disabled', 'lasso_editor' );
		$post_settings_disabled = lasso_editor_get_option( 'post_settings_disabled', 'lasso_editor' );
		$allow_change_date = lasso_editor_get_option( 'allow_change_date', 'lasso_editor' );
        $allow_edit_excerpt = lasso_editor_get_option( 'allow_edit_excerpt', 'lasso_editor' );
		$allow_new_category = lasso_editor_get_option( 'allow_new_category', 'lasso_editor' );
		$shortcodify_disabled  = lasso_editor_get_option( 'shortcodify_disabled', 'lasso_editor' );
		$enable_autosave  = lasso_editor_get_option( 'enable_autosave', 'lasso_editor' );
		
		$disable_shortcode_editing = lasso_editor_get_option('disable_shortcode_editing', 'lasso_editor');

		$use_old_ui      = lasso_editor_get_option( 'use_old_ui', 'lasso_editor' );
		$toolbar_headings      = lasso_editor_get_option( 'toolbar_headings', 'lasso_editor' );
		$toolbar_headings_h4      = lasso_editor_get_option( 'toolbar_headings_h4', 'lasso_editor' );
		$toolbar_list      = lasso_editor_get_option( 'toolbar_list', 'lasso_editor' );
		$toolbar_show_color      = lasso_editor_get_option( 'toolbar_show_color', 'lasso_editor' );
		$toolbar_show_alignment  = lasso_editor_get_option( 'toolbar_show_alignment', 'lasso_editor' );
        
        $text_select_popup = lasso_editor_get_option('text_select_popup', 'lasso_editor', false);
		
		$objectsNoSave  	= lasso_editor_get_option('dont_save', 'lasso_editor');
		$objectsNonEditable  	= lasso_editor_get_option('non_editable', 'lasso_editor');
		$disable_tour = lasso_editor_get_option('disable_tour', 'lasso_editor');
		$show_ignored_items = lasso_editor_get_option('show_ignored_items', 'lasso_editor');
		$save_using_rest_disabled = lasso_editor_get_option('save_using_rest_disabled', 'lasso_editor');
		
		$default_post_types = apply_filters( 'lasso_allowed_post_types', array( 'post', 'page'));
		$allowed_post_types = lasso_editor_get_option( 'allowed_post_types', 'lasso_editor',  $default_post_types);
		
		$links_editable = lasso_editor_get_option('links_editable', 'lasso_editor', false);
		$bold_tag = lasso_editor_get_option( 'bold_tag', 'lasso_editor',  "b");
		$i_tag = lasso_editor_get_option( 'i_tag', 'lasso_editor',  "i");
        
        $add_table = lasso_editor_get_option('add_table', 'lasso_editor', false);
        $add_paragraph = lasso_editor_get_option('add_paragraph', 'lasso_editor', false);
		
		// do we support pending status
		$no_pending_status = lasso_editor_get_option('no_pending_status', 'lasso_editor');
		
		$no_url_setting = lasso_editor_get_option('no_url_setting', 'lasso_editor');
		
		$insert_comp_ui = lasso_editor_get_option('insert_comp_ui', 'lasso_editor');
		if (!$insert_comp_ui) {
			$insert_comp_ui = 'drag';
		}
        
        $link_prefix_http = lasso_editor_get_option('link_prefix_http', 'lasso_editor');
		$inherit_categories = lasso_editor_get_option('inherit_categories', 'lasso_editor');
        
        $use_old_wpimg = lasso_editor_get_option('use_old_wpimg', 'lasso_editor','off');
        $use_wp_block_image = lasso_editor_get_option('use_wp_block_image', 'lasso_editor','off');
		
		$support_custom_taxonomy   = lasso_editor_get_option( 'support_custom_taxonomy', 'lasso_editor' );
        
        $new_post_text    = lasso_editor_get_option( 'new_post_text', 'lasso_editor' );
        
        $no_wrap_shortcode    = lasso_editor_get_option( 'no_wrap_shortcode', 'lasso_editor');

?>
		<div class="wrap">
		<style>
		.lasso-editor-settings--option-wrap {
			display:none;
		}
		
		.accordion:before {
			font-family: dashicons;
			content: "\f139";
		}
		.accordion.show:before {
			font-family: dashicons;
			content: "\f140";
		}
		</style>
		<script>
		(function( $ ) {
			jQuery(document).ready(function(){
				jQuery('.accordion.show').next().addClass('show');
				jQuery('.accordion.show').next().slideDown(350);
				jQuery('.accordion').click(function(e) {
					e.preventDefault();
				  
					var $this = $(this);
				  
					if ($this.hasClass('show')) {
						$this.removeClass('show');
						$this.next().removeClass('show');
						$this.next().slideUp(350);
					} else {
						$this.toggleClass('show');
						$this.next().addClass('show');
						$this.next().slideDown(350);
					}
				});
			});
		})( jQuery );
		
		
		</script>        
	    	<h2><?php _e( 'Editus Settings', 'lasso' );?></h2>
            
			<form id="lasso-editor-settings-form" class="lasso--form-settings" method="post" enctype="multipart/form-data">

				<?php do_action('lasso_settings_before');?>
				
				
				
				<h3 class="accordion show"><?php _e( 'Enable for:', 'lasso' );?></h3>
				<div class="lasso-editor-settings--option-wrap show">
					<div class="lasso-editor-settings--option-inner">
						
						<span class="lasso--setting-description"><?php _e( 'Enable Editus for the following post types.', 'lasso' );?></span>
						<?php
						$args = array(
							'public'   => true
						);
						 
						$allowed_post_types = apply_filters( 'lasso_allowed_post_types', $allowed_post_types );
						$post_types = get_post_types( $args, 'objects' );
						 
						foreach ( $post_types  as $post_type ) {
						   if ($post_type->name == 'attachment') continue;
						   $checked ="";
						   if (  in_array( $post_type->name, $allowed_post_types )  ) {
								$checked = 'checked="checked"';
						   }
						   echo '<label><input type="checkbox" '.$checked.' name="lasso_editor[allowed_post_types]['.$post_type->name.']" id="lasso_editor[allowed_post_types]['.$post_type->name.']" >'.$post_type->name.'</label>';
						}
						?>
					</div>
				</div>
				

				<h3 class="accordion show"><?php _e( 'Internal Settings', 'lasso' );?></h3>
				<div class="lasso-editor-settings--option-wrap show">
					<div class="lasso-editor-settings--option-inner" style="border:none;">
						<label><?php _e( 'Article Class', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'Provide the CSS class (including the preceding dot) of container that holds the post. This should be the first parent container class that holds the_content.', 'lasso' );?></span>
						<input type="text" name="lasso_editor[article_class]" id="lasso_editor[article_class]" value="<?php echo esc_attr( $article_object );?>" placeholder=".entry-content">
					</div>
				
					<div class="lasso-editor-settings--option-inner" style="border:none;">
						<label><?php _e( 'Featured Image Class', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'Provide the CSS class that uses a featured image as a background image. This currently only supports themes that have the featured image set as background image.', 'lasso' );?></span>
						<input type="text" name="lasso_editor[featimg_class]" id="lasso_editor[featimg_class]" value="<?php echo esc_attr( $featImgClass );?>" placeholder=".entry-content">
					</div>
				
					<div class="lasso-editor-settings--option-inner" style="border:none;">
						<label><?php _e( 'Article Title Class', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'Provide the CSS class for the post title. This will enable you to update the title of the post by clicking and typing.', 'lasso' );?></span>
						<input type="text" name="lasso_editor[title_class]" id="lasso_editor[title_class]" value="<?php echo esc_attr( $titleClass );?>" placeholder=".entry-content">
					</div>
				
					<div class="lasso-editor-settings--option-inner" style="border:none;">
						<label><?php _e( 'Ignored Items to Save', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'If your post container holds additional markup, list the css class names (comma separated, including the dot) of those items. When you enter the editor, Editus will remove (NOT delete) these items so that it does not save them as HTML.', 'lasso' );?></span>
						<textarea name="lasso_editor[dont_save]" id="lasso_editor[dont_save]" placeholder=".classname, .another-class"><?php echo esc_attr( $objectsNoSave );?></textarea>
					</div>
				
					<div class="lasso-editor-settings--option-inner" style="border:none;">
						<label><?php _e( 'Read Only Items', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'If your post has items that should not be editable, list the css class names (comma separated, including the dot) of those items.', 'lasso' );?></span>
						<textarea name="lasso_editor[non_editable]" id="lasso_editor[non_editable]" placeholder=".classname, .another-class"><?php echo esc_attr( $objectsNonEditable );?></textarea>
					</div>
				
					<div class="lasso-editor-settings--option-inner" >
						<input type="checkbox" class="checkbox" name="lasso_editor[show_ignored_items]" id="lasso_editor[show_ignored_items]" <?php echo checked( $show_ignored_items, 'on' );?> >
						<label for="lasso_editor[show_ignored_items]"> <?php _e( 'Show Ignored Items', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'By default the ignored items are hidden. Check this to show ignored items while keeping them uneditable.', 'lasso' );?></span>
					</div>
				</div>

				<h3 class="accordion"><?php _e( 'Editor UI', 'lasso' );?></h3>
				<div class="lasso-editor-settings--option-wrap">
					<div class="lasso-editor-settings--option-inner" style="border:none;">
						<input type="checkbox" class="checkbox" name="lasso_editor[use_old_ui]" id="lasso_editor_use_old_ui" <?php echo checked( $use_old_ui, 'on' );?> >
						<label for="lasso_editor[use_old_ui]"><?php _e( 'Use the Old Toolbar', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'Use this option to disable the new color options and use the pre-1.0 toolbar.', 'lasso' );?></span>
					</div>
				    <div id="lasso-editor-settings--colors">
					<?php
					self::create_section_for_color_picker('button-color1', _e( 'Editor Bar Color Top', 'lasso' ), '#0000ff');
					self::create_section_for_color_picker('button-color2', _e( 'Editor Bar Color Bottom', 'lasso' ), '#000030');
					self::create_section_for_color_picker('dialog-color', _e( 'Dialog Color', 'lasso' ), '#000055');
					self::create_section_for_color_picker('text-color', _e( 'Icon/Text Color', 'lasso' ), '#ffffff');
					?>
					<button type="button" id="lasso-editor-settings--default-colors" ><?php _e( 'Default Colors', 'lasso' );?></button>
				    <div style="height:50px;"></div>
					</div>
					<div class="lasso-editor-settings--option-inner" style="border:none;">
						<input type="checkbox" class="checkbox" name="lasso_editor[toolbar_headings]" id="lasso_editor[toolbar_headings]" <?php echo checked( $toolbar_headings, 'on' );?> >
						<label for="lasso_editor[toolbar_headings]"><?php _e( 'Enable H2 and H3 Buttons', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'Show the buttons to set H2 and H3 settings.', 'lasso' );?></span>

					</div>
					<div class="lasso-editor-settings--option-inner" style="border:none;">
						<input type="checkbox" class="checkbox" name="lasso_editor[toolbar_headings_h4]" id="lasso_editor[toolbar_headings_h4]" <?php echo checked( $toolbar_headings_h4, 'on' );?> >
						<label for="lasso_editor[toolbar_headings_h4]"><?php _e( 'Enable H4/H5/H6 Buttons', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'Show the buttons to set H4/H5/H6 settings.', 'lasso' );?></span>

					</div>
					
					<div class="lasso-editor-settings--option-inner" style="border:none;">
						<input type="checkbox" class="checkbox" name="lasso_editor[toolbar_list]" id="lasso_editor[toolbar_list]" <?php echo checked( $toolbar_list, 'on' );?> >
						<label for="lasso_editor[toolbar_list]"><?php _e( 'Enable OL/UL Buttons', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'Show the buttons to create Ordered and Unordered Lists from text selection.', 'lasso' );?></span>
					</div>
					
					<div class="lasso-editor-settings--option-inner" style="border:none;">
						<input type="checkbox" class="checkbox" name="lasso_editor[toolbar_show_color]" id="lasso_editor[toolbar_show_color]" <?php echo checked( $toolbar_show_color, 'on' );?> >
						<label for="lasso_editor[toolbar_show_color]"><?php _e( 'Enable Text Color Buttons', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'Show the buttons to set text colors.', 'lasso' );?></span>

					</div>
					<div class="lasso-editor-settings--option-inner" style="border:none;">
						<input type="checkbox" class="checkbox" name="lasso_editor[toolbar_show_alignment]" id="lasso_editor[toolbar_show_alignment]" <?php echo checked( $toolbar_show_alignment, 'on' );?> >
						<label for="lasso_editor[toolbar_show_alignment]"><?php _e( 'Enable Text Align Buttons', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'Show the buttons to set text alignment.', 'lasso' );?></span>

					</div>
					
					<div class="lasso-editor-settings--option-inner" style="border:none;">
						<input type="checkbox" class="checkbox" name="lasso_editor[links_editable]" id="lasso_editor[links_editable]" <?php echo checked( $links_editable, 'on' );?> >
						<label for="lasso_editor[links_editable]"><?php _e( 'Make links editable under the Editing Mode', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'Make links editable under the Editing Mode. Turning this on will make the links non-clickable while editing.', 'lasso' );?></span>

					</div>
					<div class="lasso-editor-settings--option-inner" style="border:none;">
					    <label for="lasso_editor[insert_comp_ui]"> <?php _e( 'Insert Component UI', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'UI mechanism to insert components', 'lasso' );?></span>
						<div class="lasso-editor-settings--option-inner" style="border:none;">
					       <input type="radio" name="lasso_editor[insert_comp_ui]" value='drag' <?php echo checked( $insert_comp_ui, 'drag' );?>> <?php _e( 'Drag and Drop', 'lasso' );?>
						</div>
						<div class="lasso-editor-settings--option-inner" style="border:none;">
						<input type="radio" name="lasso_editor[insert_comp_ui]" value="click" <?php echo checked( $insert_comp_ui, 'click' );?>> <?php _e( 'Click', 'lasso' );?>
						</div>
						<div class="lasso-editor-settings--option-inner" style="border:none;">
						<input type="radio" name="lasso_editor[insert_comp_ui]" value="mediumcom" <?php echo checked( $insert_comp_ui, 'mediumcom' );?>> <?php _e( 'Auto Button on Empty Paragraph. medium.com-like UI.', 'lasso' );?>
						</div>
					</div>
                    
                    <div class="lasso-editor-settings--option-inner" >
						<input type="checkbox" class="checkbox" name="lasso_editor[text_select_popup]" id="lasso_editor[text_select_popup]" <?php echo checked( $text_select_popup, 'on' );?> >
						<label for="lasso_editor[text_select_popup]"><?php _e( 'Popup When Text is Selected', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'Instead of using the bottom toolbar to format texts, use a popup box to format texts.', 'lasso' );?></span>

					</div>
                    
				</div>
				
				<h3 class="accordion"><?php _e( 'Component', 'lasso' );?></h3>
                <div class="lasso-editor-settings--option-wrap" style="border:none;" >
                    <div class="lasso-editor-settings--option-inner" style="border:none">
						<input type="checkbox" class="checkbox" name="lasso_editor[add_table]" id="lasso_editor[add_table]" <?php echo checked( $add_table, 'on' );?> >
						<label for="lasso_editor[add_table]"><span class="dashicons dashicons-grid-view"> </span> <?php _e( 'Additional Component: Table', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'Allow user to add and edit tables.', 'lasso' );?></span>

					</div>
                    
                     <div class="lasso-editor-settings--option-inner" >
						<input type="checkbox" class="checkbox" name="lasso_editor[add_paragraph]" id="lasso_editor[add_paragraph]" <?php echo checked( $add_paragraph, 'on' );?> >
						<label for="lasso_editor[add_paragraph]"><span class="dashicons dashicons-editor-paragraph"></span><?php _e( 'Additional Component: Paragraph', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'Plain HTML Paragraph.', 'lasso' );?></span>

					</div>
                
                <?php if ( 'ase-active' != $ase_status ) { ?>
                    <script>
                    $(document).ready(function(){
                        $("#lasso_editor\\[use_old_wpimg\\]").on('change', function(){                        
                            if($("#lasso_editor\\[use_old_wpimg\\]:checked").length){
                                $("#lasso_editor\\[use_wp_block_image\\]").prop('disabled', true);
                                $("#lasso_editor\\[use_wp_block_image\\]").prop('checked', false);
                                return;
                            }

                            $("#lasso_editor\\[use_wp_block_image\\]").prop('disabled', false);
                        });

                        $("#lasso_editor\\[use_wp_block_image\\]").on('change', function(){        
                            if($("#lasso_editor\\[use_wp_block_image\\]:checked").length){
                                $("#lasso_editor\\[use_old_wpimg\\]").prop('disabled', true);
                                $("#lasso_editor\\[use_old_wpimg\\]").prop('checked', false);
                                return;
                            }

                            $("#lasso_editor\\[use_old_wpimg\\]").prop('disabled', false);
                        });
                    })
                    </script>
                
                    <div class="lasso-editor-settings--option-inner" style="border:none">
						<input type="checkbox" class="checkbox" name="lasso_editor[use_old_wpimg]" id="lasso_editor[use_old_wpimg]" <?php echo checked( $use_old_wpimg, 'on' );?> >
						<label for="lasso_editor[use_old_wpimg]"><?php _e( 'Use Simple Image', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'Use Simple Image Component without Extra Options.', 'lasso' );?></span>

					</div>
                
                
                    <div class="lasso-editor-settings--option-inner">
						<input type="checkbox" class="checkbox" name="lasso_editor[use_wp_block_image]" id="lasso_editor[use_wp_block_image]" <?php echo checked( $use_wp_block_image, 'on' );?> >
						<label for="lasso_editor[use_wp_block_image]"><?php _e( 'Use WP Image Block', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'Use WP Image Block as the image component. Gutenberg Block Editor needs to be enabled.', 'lasso' );?></span>

					</div>
                <?php }?>
                </div>
				

				<h3 class="accordion"><?php _e( 'Post Settings UI', 'lasso' );?></h3>
				<div class="lasso-editor-settings--option-wrap"  >
					<div class="lasso-editor-settings--option-inner" style="border:none">
						<input type="checkbox" class="checkbox" name="lasso_editor[post_settings_disabled]" id="lasso_editor[post_settings_disabled]" <?php echo checked( $post_settings_disabled, 'on' );?> >
						<label for="lasso_editor[post_settings_disabled]"> <?php _e( 'Disable Post Settings', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'Check this to disable users from being able to edit post settings from the front-end.', 'lasso' );?></span>
					</div>
					
					<div class="lasso-editor-settings--option-inner" style="border:none">
						<input type="checkbox" class="checkbox" name="lasso_editor[allow_change_date]" id="lasso_editor[allow_change_date]" <?php echo checked( $allow_change_date, 'on' );?> >
						<label for="lasso_editor[allow_change_date]"> <?php _e( 'Allow Changing Post Date', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'Add the date selector to change the post\'s date to the Post Setting dialog', 'lasso' );?></span>
					</div>
                    
                    <div class="lasso-editor-settings--option-inner" style="border:none">
						<input type="checkbox" class="checkbox" name="lasso_editor[allow_edit_excerpt]" id="lasso_editor[allow_edit_excerpt]" <?php echo checked( $allow_edit_excerpt, 'on' );?> >
						<label for="lasso_editor[allow_edit_excerpt]"> <?php _e( 'Allow Editing Excerpt', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'Allow the post\'s excerpt to be edited in the Post Setting dialog', 'lasso' );?></span>
					</div>
					
					<div class="lasso-editor-settings--option-inner" style="border:none">
						<input type="checkbox" class="checkbox" name="lasso_editor[allow_new_category]" id="lasso_editor[allow_new_category]" <?php echo checked( $allow_new_category, 'on' );?> >
						<label for="lasso_editor[allow_new_category]"> <?php _e( 'Allow Adding New Category', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'Add the user to create new, previously non-existing categories for posts.', 'lasso' );?></span>
					</div>
					
					<div class="lasso-editor-settings--option-inner" style="border:none">
						<input type="checkbox" class="checkbox" name="lasso_editor[no_pending_status]" id="lasso_editor[no_pending_status]" <?php echo checked( $no_pending_status, 'on' );?> >
						<label for="lasso_editor[no_pending_status]"> <?php _e( 'Do Not Allow "Pending" Status', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'Remove the Option to Set the Status to Pending.', 'lasso' );?></span>
					</div>
					
					<div class="lasso-editor-settings--option-inner" style="border:none">
						<input type="checkbox" class="checkbox" name="lasso_editor[no_url_setting]" id="lasso_editor[no_slug_setting]" <?php echo checked( $no_url_setting, 'on' );?> >
						<label for="lasso_editor[no_url_setting]"> <?php _e( 'Remove POST URL Option', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'Remove the Option to Set the URL for the Post.', 'lasso' );?></span>
					</div>
				
					<div class="lasso-editor-settings--option-inner" style="border:none">
						<input type="checkbox" class="checkbox" name="lasso_editor[post_adding_disabled]" id="lasso_editor[post_adding_disabled]" <?php echo checked( $post_new_disabled, 'on' );?> >
						<label for="lasso_editor[post_adding_disabled]"><?php _e( 'Disable Post Adding', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'Check this box to disable users from being able to add new posts from the front-end.', 'lasso' );?></span>
					</div>
					
					<div class="lasso-editor-settings--option-inner" >
						<input type="checkbox" class="checkbox" name="lasso_editor[support_custom_taxonomy]" id="lasso_editor[support_custom_taxonomy]" <?php echo checked( $support_custom_taxonomy, 'on' );?> >
						<label for="lasso_editor[support_custom_taxonomy]"><?php _e( 'Support Custom Taxonomy', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'Allow editing custom taxonomies.', 'lasso' );?></span>
					</div>
					

				</div>
				
				<h3 class="accordion"><?php _e( 'Misc', 'lasso' );?></h3>
				<div class="lasso-editor-settings--option-wrap">
					<div class="lasso-editor-settings--option-inner" style="border:none">
						<input type="checkbox" class="checkbox" name="lasso_editor[disable_tour]" id="lasso_editor[disable_tour]" <?php echo checked( $disable_tour, 'on' );?> >
						<label for="lasso_editor[disable_tour]"> <?php _e( 'Do Not Show Tour Dialog', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'Check this box to disable the tour dialog box for all users.', 'lasso' );?></span>
					</div>
                    
                    <div class="lasso-editor-settings--option-inner" style="border:none;">
						<label><?php _e( 'Placeholder Text for New Post', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'Placeholder text to be displayed when a new post is created.', 'lasso' );?></span>
						<input type="text" name="lasso_editor[new_post_text]" id="lasso_editor[new_post_text]" value="<?php echo esc_attr( $new_post_text );?>" placeholder="<?php $def = wp_strip_all_tags(apply_filters( 'lasso_new_object_content', __( 'Once upon a time...','lasso')));echo $def;?>", true)>
					</div>
					
					<div class="lasso-editor-settings--option-inner" style="border:none">
						<input type="checkbox" class="checkbox" name="lasso_editor[disable_shortcode_editing]" id="lasso_editor[disable_shortcode_editing]" <?php echo checked( $disable_shortcode_editing, 'on' );?> >
						<label for="lasso_editor[disable_shortcode_editing]"> <?php _e( 'Do Not Allow Shortcode Editing', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'Check this box to disable frontend editing of shortcodes.', 'lasso' );?></span>
					</div>

					<div class="lasso-editor-settings--option-inner" style="border:none">
					    <label for="lasso_editor[bold_tag]"> <?php _e( '"Bold" Tag', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'Choose the HTML tag used for the "Bold" style.', 'lasso' );?></span>
					    <input type="radio" name="lasso_editor[bold_tag]" value='b' <?php echo checked( $bold_tag, 'b' );?>> b
						<input type="radio" name="lasso_editor[bold_tag]" value="strong" <?php echo checked( $bold_tag, 'strong' );?>> strong
					</div>
					<div class="lasso-editor-settings--option-inner" style="border:none">
					    <label for="lasso_editor[i_tag]"> <?php _e( '"Italic" Tag', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'Choose the HTML tag used for the "Italic" style.', 'lasso' );?></span>
					    <input type="radio" name="lasso_editor[i_tag]" value='i' <?php echo checked( $i_tag, 'i' );?>> i
						<input type="radio" name="lasso_editor[i_tag]" value="em" <?php echo checked( $i_tag, 'em' );?>> em
					</div>
                    <div class="lasso-editor-settings--option-inner" style="border:none" >
						<input type="checkbox" class="checkbox" name="lasso_editor[link_prefix_http]" id="lasso_editor[link_prefix_http]" <?php echo checked( $link_prefix_http, 'on' );?> >
						<label for="lasso_editor[link_prefix_http]"><?php _e( 'Auto Prefix HTTP to links', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'When user adds a hyperlink, automatically add http:// if the user does not specify it explicitly.', 'lasso' );?></span>
					</div>
					<div class="lasso-editor-settings--option-inner" >
						<input type="checkbox" class="checkbox" name="lasso_editor[inherit_categories]" id="lasso_editor[inherit_categories]" <?php echo checked( $inherit_categories, 'on' );?> >
						<label for="lasso_editor[inherit_categories]"><?php _e( 'Inherit Post Categories When Creating a New Post', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'When creating a new post, take the categories of the current post and apply to the new post.', 'lasso' );?></span>
					</div>
				</div>

				<h3 class="accordion"><?php _e( 'Advanced Options', 'lasso' );?></h3>
                
				<div class="lasso-editor-settings--option-wrap ">
					<span class="lasso--setting-description"><?php _e( 'Suggested not to turn these options on without consulting the developer.', 'lasso' );?></span>
					<span class="lasso--setting-description"> </span>		
					<div class="lasso-editor-settings--option-inner" style="border:none">
						<input type="checkbox" class="checkbox" name="lasso_editor[shortcodify_disabled]" id="lasso_editor[shortcodify_disabled]" <?php echo checked( $shortcodify_disabled, 'on' );?> >
						<label for="lasso_editor[shortcodify_disabled]"><?php _e( 'Disable Aesop Component Conversion', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'Check this box to disable the conversion process used on Aesop Story Engine components.', 'lasso' );?></span>
					</div>
				
					<div class="lasso-editor-settings--option-inner" style="border:none">
						<input type="checkbox" class="checkbox" name="lasso_editor[enable_autosave]" id="lasso_editor[enable_autosave]" <?php echo checked( $enable_autosave, 'on' );?> >
						<label for="lasso_editor[enable_autosave]"><?php _e( 'Enable Auto Save', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'Check this box to enable auto save.', 'lasso' );?></span>
					</div>
				
					<div class="lasso-editor-settings--option-inner" style="border:none">
						<input type="checkbox" class="checkbox" name="lasso_editor[post_save_disabled]" id="lasso_editor[post_save_disabled]" <?php echo checked( $save_to_post_disabled, 'on' );?> >
						<label for="lasso_editor[post_save_disabled]"><?php _e( 'Disable Post Saving', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'By default the editor will update the database with the post or page it is being used on. Check this box to disable this. If you check this box, it is assumed that you will be using the provided filters to save your own content.', 'lasso' );?></span>

					</div>
					
					<div class="lasso-editor-settings--option-inner" style="border:none">
						<input type="checkbox" class="checkbox" name="lasso_editor[post_edit_disabled]" id="lasso_editor[post_edit_disabled]" <?php echo checked( $edit_post_disabled, 'on' );?> >
						<label for="lasso_editor[post_edit_disabled]"><?php _e( 'Disable Post Editing', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'You may use this option if you only want to edit custom fields. Refer <a href="https://edituswp.com/editing-and-updating-custom-fields-from-frontend/">here</a> for more information. The custom fields you specify will be still editable under the editing mode.', 'lasso' );?></span>

					</div>
				
					<div class="lasso-editor-settings--option-inner" style="border:none">
						<input type="checkbox" class="checkbox" name="lasso_editor[save_using_rest_disabled]" id="lasso_editor[save_using_rest_disabled]" <?php echo checked( $save_using_rest_disabled, 'on' );?> >
						<label for="lasso_editor[save_using_rest_disabled]"><?php _e( "Don't Use REST API to Save", 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'By default the editor will use REST API to save posts. Check this box to use custom AJAX calls instead.', 'lasso' );?></span>

					</div>
                    
                    <div class="lasso-editor-settings--option-inner">
						<input type="checkbox" class="checkbox" name="lasso_editor[no_wrap_shortcode]" id="lasso_editor[no_wrap_shortcode]" <?php echo checked( $no_wrap_shortcode, 'on' );?> >
						<label for="lasso_editor[no_wrap_shortcode]"><?php _e( "Don't Wrap Shortcodes", 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'By default Editus wraps shortcodes so they can be preserved. Disable this behavior.', 'lasso' );?></span>

					</div>
				</div>
				
				


				<div class="lasso-editor-settings--submit">
				    <input type="hidden" name="action" value="lasso-editor-settings" />
				    <input type="submit" class="button-primary" value="<?php esc_attr_e( 'Save Settings', 'lasso' );?>" />
					<?php wp_nonce_field( 'nonce', 'lasso_editor_settings' ); ?>
				</div>
				
				<?php do_action('lasso_settings_after');?>
			</form>

		</div><?php

	}
}

