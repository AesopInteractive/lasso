<?php

/**
*
*	Build the gallery creation and management area shown in panel
*
*/
function aesop_gallery_editor_module(){

	ob_start();

	?>

	<div id="aesop-editor--gallery__edit">

		<label>Manage Images
			<a href="#" id="ase-gallery-add-image" class="aesop-editor-tiny-btn" title="Add Images"><span class="aesop-icon-pencil"></span></a>
			<a href="#" id="aesop-editor--gallery__create" class="aesop-editor-tiny-btn" title="Create Gallery"><span class="aesop-icon-plus"></span></a>
		</label>
		<small class="aesop-option-desc">Rearrange or edit the images in this gallery.</small>
		<div id="aesop-editor--gallery__images"><span class="aesop-icon-spinner6"></span></div>

	</div>

	<!-- Show this when Create New Gallery clicked above -->
	<div style="display:none;" id="aesop-editor--gallery__upload">

		<a href="#" id="aesop-editor--gallery__selectImages">Select Images</a>

		<a style="display:none;" data-post-title="<?php echo esc_attr( strtolower( get_the_title() ) );?>" id="aesop-editor--gallery__save" href="#">Save Gallery</a>

	</div>

	<?php
		$id 			= get_the_ID();

		// global
		$width 			= get_post_meta( $id, 'aesop_gallery_width', true );
		$caption 		= get_post_meta( $id, 'aesop_gallery_caption', true );

		// grid
		$grid_item_width = get_post_meta( $id, 'aesop_grid_gallery_width', true );

		// thumbnail
		$thumb_trans 	= get_post_meta( $id, 'aesop_thumb_gallery_transition', true );
		$thumb_speed 	= get_post_meta( $id, 'aesop_thumb_gallery_transition_speed', true );
		$thumb_hide 	= get_post_meta( $id, 'aesop_thumb_gallery_hide_thumbs', true );

		// photoset
		$photoset_layout = get_post_meta( $id, 'aesop_photoset_gallery_layout', true );
		$photoset_lb 	 = get_post_meta( $id, 'aesop_photoset_gallery_lightbox', true );

		?>
		<div class="ase-gallery-opts ase-gallery-opts--global">

			<div class="ase-gallery-opts--single aesop-option">
				<label for="aesop_gallery_width"><?php _e('Main Gallery Width','aesop-core');?></label>
				<small class="aesop-option-desc"><?php _e('Adjust the overall width of the grid/thumbnail gallery. Acceptable values include 500px or 50%.','aesop-core');?></small>
				<input type="text_small" name="aesop_gallery_width" value="<?php echo esc_html($width);?>">
			</div>
			<div class="ase-gallery-opts--single aesop-option">
				<label for="aesop_gallery_caption"><?php _e('Gallery Caption','aesop-core');?></label>
				<small class="aesop-option-desc"><?php _e('Add an optional caption for the gallery.','aesop-core');?></small>
				<textarea name="aesop_gallery_caption"><?php echo esc_html($caption);?></textarea>
			</div>

		</div>
		<div class="ase-gallery-opts ase-gallery-opts--grid" style="display:none;">
			<h3><?php _e('Grid Options','aesop-core');?></h3>

			<div class="ase-gallery-opts--single aesop-option">
				<label for="aesop_grid_gallery_width"><?php _e('Grid Gallery Width','aesop-core');?></label>
				<small class="aesop-option-desc"><?php _e('Adjust the width of the individual grid items, only if using Grid gallery style. Default is 400.','aesop-core');?></small>
				<input type="text_small" name="aesop_grid_gallery_width" value="<?php echo (int) $grid_item_width;?>">
			</div>

		</div>
		<div class="ase-gallery-opts ase-gallery-opts--thumb" style="display:none;">
			<h3><?php _e('Thumbnail Options','aesop-core');?></h3>

			<div class="ase-gallery-opts--single aesop-option">
				<label for="aesop_thumb_gallery_transition"><?php _e('Gallery Transition','aesop-core');?></label>
				<small class="aesop-option-desc"><?php _e('Adjust the transition effect for the Thumbnail gallery. Default is slide.','aesop-core');?></small>
			   	<select name="aesop_thumb_gallery_transition">
			      <option value="crossfade" <?php selected( $thumb_trans, 'fade' ); ?>><?php _e('Fade','aesop-core');?></option>
			      <option value="slide" <?php selected( $thumb_trans, 'slide' ); ?>><?php _e('Slide','aesop-core');?></option>
			      <option value="dissolve" <?php selected( $thumb_trans, 'dissolve' ); ?>><?php _e('Dissolve','aesop-core');?></option>
			    </select>
			</div>

			<div class="ase-gallery-opts--single aesop-option">
				<label for="aesop_thumb_gallery_transition_speed"><?php _e('Gallery Transition Speed','aesop-core');?></label>
				<small class="aesop-option-desc"><?php _e('Activate slideshow by setting a speed for the transition.5000 = 5 seconds.','aesop-core');?></small>
				<input type="text" name="aesop_thumb_gallery_transition_speed" value="<?php echo (int) $thumb_speed;?>">
			</div>

			<div class="ase-gallery-opts--single aesop-option">
				<input type="checkbox" name="aesop_thumb_gallery_hide_thumbs" <?php if( $thumb_hide == true ) { ?>checked="checked"<?php } ?>>
				<label for="aesop_thumb_gallery_hide_thumbs"><?php _e('Hide Gallery Thumbnails','aesop-core');?></label>
			</div>

		</div>
		<div class="ase-gallery-opts ase-gallery-opts--photoset" style="display:none;">
			<h3><?php _e('Photoset Options','aesop-core');?></h3>

			<div class="ase-gallery-opts--single aesop-option">
				<label for="aesop-photoset-gallery-layout"><?php _e('Gallery Layout','aesop-core');?></label>
				<small class="aesop-option-desc"><?php _e('Let\'s say you have 4 images in this gallery. If you enter 121 you will have one image on the top row, two images on the second row, and one image on the third row.','aesop-core');?></small>
				<input type="text" name="aesop_photoset_gallery_layout" value="<?php echo (int) $photoset_layout;?>">
			</div>

			<div class="ase-gallery-opts--single aesop-option">
				<input type="checkbox" name="aesop_photoset_gallery_lightbox" <?php if( $photoset_lb == true ) { ?>checked="checked"<?php } ?>>
				<label for="aesop_photoset_gallery_lightbox"><?php _e('Enable Lightbox','aesop-core');?></label>
			</div>

		</div>


	<!-- Push gallery id's here -->
	<input type="hidden" id="ase_gallery_ids" name="ase_gallery_ids" value="">

	<?php

	return ob_get_clean();
}