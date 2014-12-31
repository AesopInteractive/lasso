<?php

/**
*
*	Build the gallery creation and management area shown in panel
*
*/
function aesop_gallery_editor_module(){

	ob_start();

	?>

	<a id="aesop-editor--gallery__create" href="#">New Gallery</a>

	<!-- Show this when Create New Gallery clicked above -->
	<div style="display:none;" id="aesop-editor--gallery__upload">

		<a href="#">Select Images</a>

		<a style="display:none;" id="aesop-editor--gallery__save" href="#">Save Gallery</a>
	

	</div>

	<div id="aesop-editor--gallery__edit">
		<!-- Get the current galelry thumbs from the selected gallery (on settings click) -->
		<a href="#" id="ase-gallery-add-image" class="ase-gallery-image-placeholder button-primary">Add Images</a>
		<div id="aesop-editor--gallery__images"><span class="aesop-icon-spinner6"></div></div>
	</div>

	<!-- Push gallery id's here -->
	<input type="hidden" id="ase_gallery_ids" name="ase_gallery_ids" value="">

	<?php

	return ob_get_clean();
}