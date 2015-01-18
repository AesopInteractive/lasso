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
			<a href="#" id="ase-gallery-add-image" class="aesop-editor-tiny-btn" title="Add Images"><i class="aesop-icon-pencil"></i></a>
			<a href="#" id="aesop-editor--gallery__create" class="aesop-editor-tiny-btn" title="Create Gallery"><i class="aesop-icon-plus"></i></a>
		</label>
		<small class="aesop-option-desc">Rearrange or edit the images in this gallery.</small>
		<div id="aesop-editor--gallery__images"><span class="aesop-icon-spinner6"></span></div>

	</div>

	<!-- Show this when Create New Gallery clicked above -->
	<div style="display:none;" id="aesop-editor--gallery__upload">

		<a href="#" id="aesop-editor--gallery__selectImages">Select Images</a>

		<a style="display:none;" data-post-title="<?php echo esc_attr( strtolower( get_the_title() ) );?>" id="aesop-editor--gallery__save" href="#">Save Gallery</a>

	</div>

	<!-- Gallery Layout/Type Chooser -->
	<div class="ase-gallery-opts ase-gallery-opts--type" >
		<div data-option="type" class="ase-gallery-opts--single aesop-option">
			<h3><?php _e('Gallery Type','aesop-core');?></h3>
			<small class="aesop-option-desc"><?php _e('Select the type of gallery.','aesop-core');?></small>
	      		<label class="ase-gallery-layout-label"><input class="aesop-generator-attr ase-gallery-type-radio" type="radio" name="aesop_gallery_type" value="grid"><?php _e('Grid','aesop-core');?></label>
	        	<label class="ase-gallery-layout-label"><input class="aesop-generator-attr ase-gallery-type-radio" type="radio" name="aesop_gallery_type" value="thumbnail"><?php _e('Thumbnail','aesop-core');?></label>
				<label class="ase-gallery-layout-label"><input class="aesop-generator-attr ase-gallery-type-radio" type="radio" name="aesop_gallery_type" value="sequence">Sequence</label>
				<label class="ase-gallery-layout-label"><input class="aesop-generator-attr ase-gallery-type-radio" type="radio" name="aesop_gallery_type" value="photoset"><?php _e('Photoset','aesop-core');?></label>
				<label class="ase-gallery-layout-label"><input class="aesop-generator-attr ase-gallery-type-radio" type="radio" name="aesop_gallery_type" value="stacked"><?php _e('Parallax','aesop-core');?></label>
		</div>
	</div>

	<!-- Conditionally Loaded Gallery Option - Grid Options -->
	<div class="ase-gallery-opts ase-gallery-opts--grid" style="display:none;">

		<div data-option="width" class="ase-gallery-opts--single aesop-option">
			<label for="aesop_grid_gallery_width"><?php _e('Grid Item Width','aesop-core');?></label>
			<small class="aesop-option-desc"><?php _e('Adjust the width of the individual grid items, only if using Grid gallery style. Default is 400.','aesop-core');?></small>
			<input type="text_small" class="aesop-generator-attr" name="aesop_grid_gallery_width" value="">
		</div>

	</div>

	<!-- Conditionally Loaded Gallery Option - Thumb Options -->
	<div class="ase-gallery-opts ase-gallery-opts--thumb" style="display:none;">

		<div data-option="transition" class="ase-gallery-opts--single aesop-option">
			<label for="aesop_thumb_gallery_transition"><?php _e('Gallery Transition','aesop-core');?></label>
			<small class="aesop-option-desc"><?php _e('Adjust the transition effect for the Thumbnail gallery. Default is slide.','aesop-core');?></small>
		   	<select name="aesop_thumb_gallery_transition" class="aesop-generator-attr">
		      <option value="crossfade"><?php _e('Fade','aesop-core');?></option>
		      <option value="slide"><?php _e('Slide','aesop-core');?></option>
		      <option value="dissolve"><?php _e('Dissolve','aesop-core');?></option>
		    </select>
		</div>

		<div data-option="transition-speed" class="ase-gallery-opts--single aesop-option">
			<label for="aesop_thumb_gallery_transition_speed"><?php _e('Gallery Transition Speed','aesop-core');?></label>
			<small class="aesop-option-desc"><?php _e('Activate slideshow by setting a speed for the transition.5000 = 5 seconds.','aesop-core');?></small>
			<input type="text" class="aesop-generator-attr" name="aesop_thumb_gallery_transition_speed" value="">
		</div>

		<div data-option="hide-thumbs" class="ase-gallery-opts--single aesop-option">
			<input class="aesop-generator-attr" type="checkbox" name="aesop_thumb_gallery_hide_thumbs">
			<label for="aesop_thumb_gallery_hide_thumbs"><?php _e('Hide Gallery Thumbnails','aesop-core');?></label>
		</div>

	</div>

	<!-- Conditionally Loaded Gallery Option - Photoset Options -->
	<div class="ase-gallery-opts ase-gallery-opts--photoset" style="display:none;">

		<div data-option="ps-layout" class="ase-gallery-opts--single aesop-option">
			<label for="aesop-photoset-gallery-layout"><?php _e('Gallery Layout','aesop-core');?></label>
			<small class="aesop-option-desc"><?php _e('Let\'s say you have 4 images in this gallery. If you enter 121 you will have one image on the top row, two images on the second row, and one image on the third row.','aesop-core');?></small>
			<input type="text" class="aesop-generator-attr" name="aesop_photoset_gallery_layout" value="">
		</div>

		<div data-option="ps-lightbox" class="ase-gallery-opts--single aesop-option">
			<input type="checkbox" class="aesop-generator-attr" name="aesop_photoset_gallery_lightbox">
			<label for="aesop_photoset_gallery_lightbox"><?php _e('Enable Lightbox','aesop-core');?></label>
		</div>

	</div>

	<!-- Global Gallery Options -->
	<div class="ase-gallery-opts ase-gallery-opts--global">

		<div data-option="width" class="ase-gallery-opts--single aesop-option">
			<label for="aesop_gallery_width"><?php _e('Main Gallery Width','aesop-core');?></label>
			<small class="aesop-option-desc"><?php _e('Adjust the overall width of the grid/thumbnail gallery. Acceptable values include 500px or 50%.','aesop-core');?></small>
			<input type="text_small" class="aesop-generator-attr" name="aesop_gallery_width" value="">
		</div>
		<div data-option="caption" class="ase-gallery-opts--single aesop-option">
			<label for="aesop_gallery_caption"><?php _e('Gallery Caption','aesop-core');?></label>
			<small class="aesop-option-desc"><?php _e('Add an optional caption for the gallery.','aesop-core');?></small>
			<textarea name="aesop_gallery_caption" class="aesop-generator-attr"><?php echo esc_html($caption);?></textarea>
		</div>

	</div>


	<input type="hidden" id="ase_gallery_ids" name="ase_gallery_ids" value="">

	<?php

	return ob_get_clean();
}