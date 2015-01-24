<?php

/**
*
*	Process various gallery fucntions like fetching and saving images
*
*/
class lassoEditorProcessGallery {

	function __construct(){

		add_action( 'wp_ajax_process_get_images', 				array($this, 'process_get_images' ));
		add_action( 'wp_ajax_process_create_gallery', 			array($this, 'process_create_gallery' ));
		add_action( 'wp_ajax_process_swap_gallery', 			array($this, 'process_swap_gallery' ));
		add_action( 'wp_ajax_process_update_gallery', 			array($this, 'process_update_gallery' ));

	}

	/**
	*
	*	Swaps a gallery during live editing
	*
	*/
	function process_swap_gallery(){

		check_ajax_referer('lasso_swap_gallery','nonce');

		// only run for logged in users and check caps
		if( !lasso_editor_user_can_edit() )
			return;

		$id = isset( $_POST['gallery_id'] ) ? $_POST['gallery_id'] : false;

		echo do_shortcode('[aesop_gallery id="'.(int) $id.'"]');

		die();
	}

	/**
	*
	*	Creates a gallery
	*
	*/
	function process_create_gallery(){

		if ( isset( $_POST['action'] ) && $_POST['action'] == 'process_create_gallery' ) {

			// only run for logged in users and check caps
			if( !is_user_logged_in() || !current_user_can('edit_posts') )
				return;

			// ok security passes so let's process some data
			if ( wp_verify_nonce( $_POST['nonce'], 'lasso-generator-settings' ) ) {

				$gallery_ids = isset( $_POST['gallery_ids']) ? $_POST['gallery_ids'] : false;

				// bail if no gallery ids
				if ( empty( $gallery_ids ) )
					return;

				$curr_post_title = isset( $_POST['curr_title'] ) ? $_POST['curr_title'] : rand();

				$postid 	= isset( $_POST['postid'] ) ? (int) $_POST['postid'] : false;
				$options 	= isset( $_POST['fields'] ) ? $_POST['fields'] : false;

				$type = $options ? $options['galleryType'] : false;

				// insert a new gallery
				$post_args = array(
				  	'post_title'    => $postid.'-'.rand(),
				  	'post_status'   => 'publish',
				  	'post_type'	  	=> 'ai_galleries'
				);

				$postid = wp_insert_post( $post_args );

				// update gallery ids
				if ( $gallery_ids ) {

					update_post_meta( $postid, '_ase_gallery_images', $gallery_ids );

				}

				// update the gallery type
				if ( $type ) {

					update_post_meta( $postid, 'aesop_gallery_type', $type );

				}

				do_action( 'lasso_editor_gallery_published', $postid, $gallery_ids, get_current_user_ID() );

				wp_send_json_success(array('message' => 'gallery-created') );

			} else {
				wp_send_json_error();
			}
		}

		die();
	}
	/**
	*
	*	Update an existing gallery
	*
	*/
	function process_update_gallery(){

		if ( isset( $_POST['action'] ) && $_POST['action'] == 'process_update_gallery' ) {

			// only run for logged in users and check caps
			if( !lasso_editor_user_can_edit() )
				return;

			// ok security passes so let's process some data
			if ( wp_verify_nonce( $_POST['nonce'], 'lasso-generator-settings' ) ) {

				$options 	= isset( $_POST['fields'] ) ? $_POST['fields'] : false;

				$type = $options ? $options['galleryType'] : false;
				$postid = $options ? (int) $options['id'] : false;

				$gallery_ids = isset( $_POST['gallery_ids']) ? $_POST['gallery_ids'] : false;

				// update gallery ids
				if ( !empty( $gallery_ids ) ) {

					update_post_meta( $postid, '_ase_gallery_images', $gallery_ids );

				}

				// update the gallery type
				if ( $type ) {

					update_post_meta( $postid, 'aesop_gallery_type', $type );

				}

				// run an action
				do_action( 'lasso_editor_gallery_saved', $postid, $gallery_ids, get_current_user_ID() );

				// send back success
				wp_send_json_success(array('message' => 'gallery-updated') );

			} else {

				// aww snap something went wrong so say something
				wp_send_json_error();
			}
		}

		die();
	}

	/**
	*
	*	When the user clicks the settings icon in the gallery component it 
	*	opens the panel, gets the gallery unique, then makes a call to get the gallery images
	*	@since 0.12
	*/
	function process_get_images(){

		if ( isset( $_POST['action'] ) && $_POST['action'] == 'process_get_images' ) {

			// only run for logged in users and check caps
			if( !is_user_logged_in() || !current_user_can('edit_posts') )
				return;

			// bail if no id specified like on new galleries
			if ( empty( $_POST['post_id'] ) )
				return;

			// ok security passes so let's process some data
			if ( wp_verify_nonce( $_POST['nonce'], 'lasso_get_gallery_images' ) ) {

				$postid 	= isset( $_POST['post_id'] ) ? $_POST['post_id'] : false;

				// fetch image ids from cache
				$image_ids 	= get_post_meta($postid,'_ase_gallery_images', true);

				// send ids to return images
				self::get_images( $image_ids );

			} else {

				echo 'error';
			}
		}

		die();
	}

	function get_images( $image_ids = '' ) {

		if ( empty( $image_ids ) )
			return;

		$image_ids 	= array_map('intval', explode(',', $image_ids));

		echo '<ul id="ase-gallery-images">';

			if ( !empty( $image_ids ) ):
				foreach ($image_ids as $image_id):

		            $image    =  wp_get_attachment_image_src($image_id, 'thumbnail', false);

		        	?>
		        	<li id="<?php echo $image_id;?>" class="ase-gallery-image">
		        		<i class="dashicons dashicons-no-alt" title="Delete From Gallery"></i>
		        		<i class='dashicons dashicons-edit' title="Edit Image Caption"></i>
		           	<img src="<?php echo $image[0];?>">
		          </li>
		          <?php

				endforeach;

			endif;

		echo '</ul>';

	}


}
new lassoEditorProcessGallery;



