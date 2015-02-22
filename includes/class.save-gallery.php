<?php

/**
*
*	Process various gallery fucntions like fetching and saving images
*
*	@since 1.0
*/
class lassoSaveGallery {

	function __construct(){

		add_action( 'lasso_gallery_saved', 				array($this, 'save_gallery_options' ), 10, 3);
	}

	/**
	*
	*	Update an existing galleries options
	* 	@todo this needs to be cleaned up
	*/
	function save_gallery_options($postid, $gallery_ids, $options){

		$type = isset( $_POST['gallery_type'] ) ? $_POST['gallery_type'] : false;

		// gallery width
		$gallery_width = isset( $options['width'] ) ? $options['width'] : false;

		// gallery grid item width
		$item_width = isset( $options['itemwidth'] ) ? $options['itemwidth'] : false;

		// caption
		$caption = isset( $options['caption'] ) ? $options['caption'] : false;

		// gallery transition
		$transition = isset( $options['transition'] ) ? $options['transition'] : false;

		// gallery transition speed
		$transitionSpeed = isset( $options['speed'] ) ? $options['speed'] : false;

		// gallery hide thumbs
		$hideThumbs = isset( $options['hideThumbs'] ) ? $options['hideThumbs'] : false;

		// photoset layout
		$psLayout = isset( $options['pslayout'] ) ? $options['pslayout'] : false;

		// photoset layout
		$psLightbox = isset( $options['pslightbox'] ) ? $options['pslightbox'] : false;

		// update gallery ids
		if ( !empty( $gallery_ids ) ) {

			update_post_meta( $postid, '_ase_gallery_images', $gallery_ids );

		}

		update_post_meta( $postid, 'aesop_gallery_type', sanitize_text_field( trim( $type ) ) );

		update_post_meta( $postid, 'aesop_gallery_width', sanitize_text_field( trim( $gallery_width ) ) );

		update_post_meta( $postid, 'aesop_grid_gallery_width', sanitize_text_field( trim( $item_width ) ) );

		update_post_meta( $postid, 'aesop_gallery_caption', sanitize_text_field( trim( $caption ) ) );

		update_post_meta( $postid, 'aesop_thumb_gallery_transition', sanitize_text_field( trim( $transition ) ) );

		update_post_meta( $postid, 'aesop_thumb_gallery_transition_speed', absint( trim( $transitionSpeed ) ) );

		update_post_meta( $postid, 'aesop_thumb_gallery_hide_thumbs', sanitize_text_field( trim( $hideThumbs ) ) );

		update_post_meta( $postid, 'aesop_photoset_gallery_layout', sanitize_text_field( trim( $psLayout ) ) );

		update_post_meta( $postid, 'aesop_photoset_gallery_lightbox', sanitize_text_field( trim( $psLightbox ) ) );

	}

}
new lassoSaveGallery;































