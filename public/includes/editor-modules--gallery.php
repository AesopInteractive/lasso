<?php

/**
*
*	Build the gallery creation and management area shown in panel
*
*	@since 1.0
*/
function lasso_gallery_editor_module(){

	$galleries = lasso_editor_galleries_exist();

	ob_start();

	if ( $galleries ) { ?>

		<div class="ase-gallery-opts ase-gallery-opts--edit-gallery" >
			<div class="ase-gallery-opts--single lasso-option">

				<label><?php _e('Manage Images','lasso');?>
					<a href="#" id="ase-gallery-add-image" class="lasso-editor-tiny-btn" title="<?php esc_attr_e('Add Images','lasso');?>"><i class="lasso-icon-pencil"></i></a>

					<?php if ( lasso_user_can('publish_posts') ): ?>
						<a href="#" id="lasso--gallery__create" class="lasso-editor-tiny-btn" title="<?php esc_attr_e('Create Gallery','lasso');?>"><i class="lasso-icon-plus"></i></a>
					<?php endif; ?>

				</label>
				<small class="lasso-option-desc"><?php _e('Rearrange or edit the images in this gallery.','lasso');?></small>

				<div id="lasso--gallery__images"><span class="lasso-icon-spinner6"></span></div>

			</div>

		</div>

	<?php }

	if ( lasso_user_can('publish_posts') ): ?>

		<div class="ase-gallery-opts ase-gallery-opts--create-gallery" >

			<div class="ase-gallery-opts--single lasso-option">

				<label><?php _e('Create a Gallery','lasso');?></label>
				<small class="lasso-option-desc"><?php _e('Select images to create a gallery.','lasso');?></small>

				<a href="#" class="editor-btn-secondary" id="lasso--gallery__selectImages"><?php _e('Select Images','lasso');?></a>

				<div id="ase-gallery-images"></div>

				<a style="display:none;" class="editor-btn-secondary" data-post-title="<?php echo esc_attr( strtolower( the_title_attribute() ) );?>" id="lasso--gallery__save" href="#"><?php _e('Create Gallery','lasso');?></a>

			</div>

		</div>

	<?php endif; ?>

	<!-- Gallery Layout/Type Chooser -->
	<div class="ase-gallery-opts ase-gallery-opts--type" >
		<div data-option="gallery-type" class="ase-gallery-opts--single lasso-option">
			<h3><?php _e('Gallery Type','lasso');?></h3>
			<small class="lasso-option-desc"><?php _e('Select the type of gallery.','lasso');?></small>
			<fieldset>
	      		<label class="ase-gallery-layout-label"><input class="lasso-generator-attr ase-gallery-type-radio" type="radio" name="lasso_gallery_type" value="grid"><?php _e('Grid','lasso');?></label>
	        	<label class="ase-gallery-layout-label"><input class="lasso-generator-attr ase-gallery-type-radio" type="radio" name="lasso_gallery_type" value="thumbnail"><?php _e('Thumbnail','lasso');?></label>
				<label class="ase-gallery-layout-label"><input class="lasso-generator-attr ase-gallery-type-radio" type="radio" name="lasso_gallery_type" value="sequence">Sequence</label>
				<label class="ase-gallery-layout-label"><input class="lasso-generator-attr ase-gallery-type-radio" type="radio" name="lasso_gallery_type" value="photoset"><?php _e('Photoset','lasso');?></label>
				<label class="ase-gallery-layout-label"><input class="lasso-generator-attr ase-gallery-type-radio" type="radio" name="lasso_gallery_type" value="stacked"><?php _e('Parallax','lasso');?></label>
			</fieldset>
		</div>
	</div>

	<!-- Conditionally Loaded Gallery Option - Grid Options -->
	<div class="ase-gallery-opts ase-gallery-opts--grid" style="display:none;">

		<div data-option="itemwidth" class="ase-gallery-opts--single lasso-option">
			<label for="lasso_grid_gallery_width"><?php _e('Grid Item Width','lasso');?></label>
			<small class="lasso-option-desc"><?php _e('Adjust the width of the individual grid items, only if using Grid gallery style. Default is 400.','lasso');?></small>
			<input type="text_small" class="lasso-generator-attr" name="lasso_grid_gallery_width" value="">
		</div>

	</div>

	<!-- Conditionally Loaded Gallery Option - Thumb Options -->
	<div class="ase-gallery-opts ase-gallery-opts--thumb" style="display:none;">

		<div data-option="transition" class="ase-gallery-opts--single lasso-option">
			<label for="lasso_thumb_gallery_transition"><?php _e('Gallery Transition','lasso');?></label>
			<small class="lasso-option-desc"><?php _e('Adjust the transition effect for the Thumbnail gallery. Default is slide.','lasso');?></small>
		   	<select name="lasso_thumb_gallery_transition" class="lasso-generator-attr">
		      <option value="crossfade"><?php _e('Fade','lasso');?></option>
		      <option value="slide"><?php _e('Slide','lasso');?></option>
		      <option value="dissolve"><?php _e('Dissolve','lasso');?></option>
		    </select>
		</div>

		<div data-option="speed" class="ase-gallery-opts--single lasso-option">
			<label for="lasso_thumb_gallery_transition_speed"><?php _e('Gallery Transition Speed','lasso');?></label>
			<small class="lasso-option-desc"><?php _e('Activate slideshow by setting a speed for the transition.5000 = 5 seconds.','lasso');?></small>
			<input type="text" class="lasso-generator-attr" name="lasso_thumb_gallery_transition_speed" value="">
		</div>

		<div data-option="hide-thumbs" class="ase-gallery-opts--single lasso-option">
			<input class="lasso-generator-attr" type="checkbox" name="lasso_thumb_gallery_hide_thumbs">
			<label for="lasso_thumb_gallery_hide_thumbs"><?php _e('Hide Gallery Thumbnails','lasso');?></label>
		</div>

	</div>

	<!-- Conditionally Loaded Gallery Option - Photoset Options -->
	<div class="ase-gallery-opts ase-gallery-opts--photoset" style="display:none;">

		<div data-option="pslayout" class="ase-gallery-opts--single lasso-option">
			<label for="lasso-photoset-gallery-layout"><?php _e('Gallery Layout','lasso');?></label>
			<small class="lasso-option-desc"><?php _e('Let\'s say you have 4 images in this gallery. If you enter 121 you will have one image on the top row, two images on the second row, and one image on the third row.','lasso');?></small>
			<input type="text" class="lasso-generator-attr" name="lasso_photoset_gallery_layout" value="">
		</div>

		<div data-option="pslightbox" class="ase-gallery-opts--single lasso-option">
			<input type="checkbox" class="lasso-generator-attr" name="lasso_photoset_gallery_lightbox">
			<label for="lasso_photoset_gallery_lightbox"><?php _e('Enable Lightbox','lasso');?></label>
		</div>

	</div>

	<!-- Global Gallery Options -->
	<div class="ase-gallery-opts ase-gallery-opts--global">

		<div data-option="width" class="ase-gallery-opts--single lasso-option">
			<label for="lasso_gallery_width"><?php _e('Main Gallery Width','lasso');?></label>
			<small class="lasso-option-desc"><?php _e('Adjust the overall width of the grid/thumbnail gallery. Acceptable values include 500px or 50%.','lasso');?></small>
			<input type="text_small" class="lasso-generator-attr" name="lasso_gallery_width" value="">
		</div>
		<div data-option="caption" class="ase-gallery-opts--single lasso-option">
			<label for="lasso_gallery_caption"><?php _e('Gallery Caption','lasso');?></label>
			<small class="lasso-option-desc"><?php _e('Add an optional caption for the gallery.','lasso');?></small>
			<textarea name="lasso_gallery_caption" class="lasso-generator-attr"></textarea>
		</div>

	</div>


	<input type="hidden" id="ase_gallery_ids" name="ase_gallery_ids" value="">
	<input type="hidden" id="ase_gallery_type" name="ase_gallery_type" value="">
	<?php

	return ob_get_clean();
}