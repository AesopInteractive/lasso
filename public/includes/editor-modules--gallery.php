<?php

/**
*
*	Build the gallery creation and management area shown in panel
*
*/
function aesop_gallery_editor_module(){

	ob_start();

	?>

	<div class="aesop-editor--gallery-create">
		<a href="#">New Gallery</a>
	</div>

	<!-- Show this when Create New Gallery clicked above -->
	<div style="display:none;" id="aesop-editor--gallery__create">

		<a id="aesop-editor--gallery__upload" href="#">Select Images</a>

	</div>

	<div class="aesop-editor--gallery-edit">
		<!-- Get the current galelry thumbs from the selected gallery (on settings click) -->
		<a href="#" id="ase-gallery-add-image" class="ase-gallery-image-placeholder button-primary">Add Images</a>
		<div id="aesop-editor--gallery__images"><span class="aesop-icon-spinner6"></div></div>
	</div>

	<!-- Push gallery id's here -->
	<input type="hidden" id="ase_gallery_ids" name="ase_gallery_ids" value="">

	<?php

	return ob_get_clean();
}