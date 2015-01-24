<?php

/**
*
*	Build the gallery creation and management area shown in panel
*
*/
function lasso_gallery_editor_module(){

	$galleries = lasso_editor_galleries_exist();

	ob_start();

	if ( $galleries ) { ?>

		<div class="ase-gallery-opts ase-gallery-opts--edit-gallery" >
			<div class="ase-gallery-opts--single lasso-option">

				<label>Manage Images
					<a href="#" id="ase-gallery-add-image" class="lasso-editor-tiny-btn" title="Add Images"><i class="lasso-icon-pencil"></i></a>
					<a href="#" id="lasso--gallery__create" class="lasso-editor-tiny-btn" title="Create Gallery"><i class="lasso-icon-plus"></i></a>
				</label>
				<small class="lasso-option-desc">Rearrange or edit the images in this gallery.</small>

				<div id="lasso--gallery__images"><span class="lasso-icon-spinner6"></span></div>

			</div>

		</div>

	<?php } ?>

	<div class="ase-gallery-opts ase-gallery-opts--create-gallery" >

		<div class="ase-gallery-opts--single lasso-option">

			<label>Create a Gallery</label>
			<small class="lasso-option-desc">Select images to create a gallery.</small>

			<a href="#" class="editor-btn-secondary" id="lasso--gallery__selectImages">Select Images</a>

			<div id="ase-gallery-images"></div>

			<a style="display:none;" class="editor-btn-secondary" data-post-title="<?php echo esc_attr( strtolower( get_the_title() ) );?>" id="lasso--gallery__save" href="#">Create Gallery</a>

		</div>

	</div>

	<!-- Gallery Layout/Type Chooser -->
	<div class="ase-gallery-opts ase-gallery-opts--type" >
		<div data-option="gallery-type" class="ase-gallery-opts--single lasso-option">
			<h3><?php _e('Gallery Type','lasso-core');?></h3>
			<small class="lasso-option-desc"><?php _e('Select the type of gallery.','lasso-core');?></small>
	      		<label class="ase-gallery-layout-label"><input class="lasso-generator-attr ase-gallery-type-radio" type="radio" name="lasso_gallery_type" value="grid"><?php _e('Grid','lasso-core');?></label>
	        	<label class="ase-gallery-layout-label"><input class="lasso-generator-attr ase-gallery-type-radio" type="radio" name="lasso_gallery_type" value="thumbnail"><?php _e('Thumbnail','lasso-core');?></label>
				<label class="ase-gallery-layout-label"><input class="lasso-generator-attr ase-gallery-type-radio" type="radio" name="lasso_gallery_type" value="sequence">Sequence</label>
				<label class="ase-gallery-layout-label"><input class="lasso-generator-attr ase-gallery-type-radio" type="radio" name="lasso_gallery_type" value="photoset"><?php _e('Photoset','lasso-core');?></label>
				<label class="ase-gallery-layout-label"><input class="lasso-generator-attr ase-gallery-type-radio" type="radio" name="lasso_gallery_type" value="stacked"><?php _e('Parallax','lasso-core');?></label>
		</div>
	</div>

	<!-- Conditionally Loaded Gallery Option - Grid Options -->
	<div class="ase-gallery-opts ase-gallery-opts--grid" style="display:none;">

		<div data-option="width" class="ase-gallery-opts--single lasso-option">
			<label for="lasso_grid_gallery_width"><?php _e('Grid Item Width','lasso-core');?></label>
			<small class="lasso-option-desc"><?php _e('Adjust the width of the individual grid items, only if using Grid gallery style. Default is 400.','lasso-core');?></small>
			<input type="text_small" class="lasso-generator-attr" name="lasso_grid_gallery_width" value="">
		</div>

	</div>

	<!-- Conditionally Loaded Gallery Option - Thumb Options -->
	<div class="ase-gallery-opts ase-gallery-opts--thumb" style="display:none;">

		<div data-option="transition" class="ase-gallery-opts--single lasso-option">
			<label for="lasso_thumb_gallery_transition"><?php _e('Gallery Transition','lasso-core');?></label>
			<small class="lasso-option-desc"><?php _e('Adjust the transition effect for the Thumbnail gallery. Default is slide.','lasso-core');?></small>
		   	<select name="lasso_thumb_gallery_transition" class="lasso-generator-attr">
		      <option value="crossfade"><?php _e('Fade','lasso-core');?></option>
		      <option value="slide"><?php _e('Slide','lasso-core');?></option>
		      <option value="dissolve"><?php _e('Dissolve','lasso-core');?></option>
		    </select>
		</div>

		<div data-option="transition-speed" class="ase-gallery-opts--single lasso-option">
			<label for="lasso_thumb_gallery_transition_speed"><?php _e('Gallery Transition Speed','lasso-core');?></label>
			<small class="lasso-option-desc"><?php _e('Activate slideshow by setting a speed for the transition.5000 = 5 seconds.','lasso-core');?></small>
			<input type="text" class="lasso-generator-attr" name="lasso_thumb_gallery_transition_speed" value="">
		</div>

		<div data-option="hide-thumbs" class="ase-gallery-opts--single lasso-option">
			<input class="lasso-generator-attr" type="checkbox" name="lasso_thumb_gallery_hide_thumbs">
			<label for="lasso_thumb_gallery_hide_thumbs"><?php _e('Hide Gallery Thumbnails','lasso-core');?></label>
		</div>

	</div>

	<!-- Conditionally Loaded Gallery Option - Photoset Options -->
	<div class="ase-gallery-opts ase-gallery-opts--photoset" style="display:none;">

		<div data-option="ps-layout" class="ase-gallery-opts--single lasso-option">
			<label for="lasso-photoset-gallery-layout"><?php _e('Gallery Layout','lasso-core');?></label>
			<small class="lasso-option-desc"><?php _e('Let\'s say you have 4 images in this gallery. If you enter 121 you will have one image on the top row, two images on the second row, and one image on the third row.','lasso-core');?></small>
			<input type="text" class="lasso-generator-attr" name="lasso_photoset_gallery_layout" value="">
		</div>

		<div data-option="ps-lightbox" class="ase-gallery-opts--single lasso-option">
			<input type="checkbox" class="lasso-generator-attr" name="lasso_photoset_gallery_lightbox">
			<label for="lasso_photoset_gallery_lightbox"><?php _e('Enable Lightbox','lasso-core');?></label>
		</div>

	</div>

	<!-- Global Gallery Options -->
	<div class="ase-gallery-opts ase-gallery-opts--global">

		<div data-option="width" class="ase-gallery-opts--single lasso-option">
			<label for="lasso_gallery_width"><?php _e('Main Gallery Width','lasso-core');?></label>
			<small class="lasso-option-desc"><?php _e('Adjust the overall width of the grid/thumbnail gallery. Acceptable values include 500px or 50%.','lasso-core');?></small>
			<input type="text_small" class="lasso-generator-attr" name="lasso_gallery_width" value="">
		</div>
		<div data-option="caption" class="ase-gallery-opts--single lasso-option">
			<label for="lasso_gallery_caption"><?php _e('Gallery Caption','lasso-core');?></label>
			<small class="lasso-option-desc"><?php _e('Add an optional caption for the gallery.','lasso-core');?></small>
			<textarea name="lasso_gallery_caption" class="lasso-generator-attr"><?php echo esc_html($caption);?></textarea>
		</div>

	</div>


	<input type="hidden" id="ase_gallery_ids" name="ase_gallery_ids" value="">

	<?php

	return ob_get_clean();
}