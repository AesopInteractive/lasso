<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

function aesop_editor_settings_form(){

		if ( !is_user_logged_in() )
			return;

		$article_object = aesop_editor_get_option('article_class','aesop_editor');
		$featImgClass = aesop_editor_get_option('featimg_class','aesop_editor');
		$titleClass = aesop_editor_get_option('title_class','aesop_editor');

		$post_new_disabled 		= aesop_editor_get_option('post_adding_disabled','aesop_editor');
		$save_to_post_disabled = aesop_editor_get_option('post_save_disabled','aesop_editor');
		$post_settings_disabled = aesop_editor_get_option('post_settings_disabled','aesop_editor');
		$shortcodify_disabled = aesop_editor_get_option('shortcodify_disabled','aesop_editor');

		?><div class="wrap">

	    	<h2>Aesop Editor Settings</h2>

			<form method="post">

				<p>
					<label>Article Class</label>
					<input type="text" name="aesop_editor[article_class]" id="aesop_editor[article_class]" value="<?php echo esc_attr( $article_object );?>" placeholder=".entry-content">
					<span class="description"> Provide the CSS class of container that holds the post. This should be the first parent container class that holds the_content.</span>
				</p>

				<p>
					<label>Featured Image Class</label>
					<input type="text" name="aesop_editor[featimg_class]" id="aesop_editor[featimg_class]" value="<?php echo esc_attr( $featImgClass );?>" placeholder=".entry-content">
					<span class="description"> Provide the CSS class that uses a featured image as a background image. This currently only supports themes that have the featured image set as background image.</span>
				</p>

				<p>
					<label>Article Title Class</label>
					<input type="text" name="aesop_editor[title_class]" id="aesop_editor[title_class]" value="<?php echo esc_attr( $titleClass );?>" placeholder=".entry-content">
					<span class="description"> Provide the CSS class for the post title. This will enable you to update the title of the post by clicking and typing.</span>
				</p>

				<!-- Advanced -->

				<p>
					<input type="checkbox" class="checkbox" name="aesop_editor[post_save_disabled]" id="aesop_editor[post_save_disabled]" <?php echo checked( $save_to_post_disabled, 'on' );?> >
					<label for="aesop_editor[post_save_disabled]"> By default the editor will update the database with the post or page it is being used on. Check this box to disable this. If you check this box, it is assumed that you will be using the provided filters to save your own content.</label>
				</p>

				<p>
					<input type="checkbox" class="checkbox" name="aesop_editor[post_settings_disabled]" id="aesop_editor[post_settings_disabled]" <?php echo checked( $post_settings_disabled, 'on' );?> >
					<label for="aesop_editor[post_settings_disabled]"> Check this to disable users from being able to edit post settings from the front-end.</label>
				</p>

				<p>
					<input type="checkbox" class="checkbox" name="aesop_editor[post_adding_disabled]" id="aesop_editor[post_adding_disabled]" <?php echo checked( $post_new_disabled, 'on' );?> >
					<label for="aesop_editor[post_adding_disabled]"> By default the editor will update the database with the post or page it is being used on. Check this box to disable this. If you check this box, it is assumed that you will be using the provided filters to save your own content.</label>
				</p>

				<p>
					<input type="checkbox" class="checkbox" name="aesop_editor[shortcodify_disabled]" id="aesop_editor[shortcodify_disabled]" <?php echo checked( $shortcodify_disabled, 'on' );?> >
					<label for="aesop_editor[shortcodify_disabled]"> Check this box to disable the conversion process used on Aesop Story Engine components.</label>
				</p>

				<p class="submit">

				    <input type="hidden" name="action" value="aesop-editor-settings" />
				    <input type="submit" class="button-primary" value="Save Settings" />
					<?php wp_nonce_field( 'nonce','aesop_editor_settings' ); ?>
				</p>
			</form>


		</div><?php

	}