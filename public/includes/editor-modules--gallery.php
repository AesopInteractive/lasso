<?php

/**
*
*	Build the gallery creation and management area shown in panel
*
*/
function aesop_gallery_editor_module(){

	ob_start();

	?><a href="#">Create New Gallery</a>

	<!-- Show this when Create New Gallery clicked above -->
	<div style="display:none;" id="aesop-editor--gallery__create">

		<a id="aesop-editor--gallery__upload" href="#">Select Images</a>

		<div id="aesop-editor--gallery__images-new">

			newly uploaded gallery iamges

		</div>

	</div>

	<!-- Get the current galelry thumbs from the selected gallery (on settings click) -->
	<div id="aesop-editor--gallery__images">

		existing gallery images

	</div>

	<!-- Push gallery id's here -->
	<input type="hidden" name="aesop-gallery-ids">

	<?php

	return ob_get_clean();
}