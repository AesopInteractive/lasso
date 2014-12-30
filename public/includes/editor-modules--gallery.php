<?php

/**
*
*	Build the gallery creation and management area shown in panel
*
*/
function aesop_gallery_editor_module(){

	ob_start();

	?><a href="#">Create New Gallery</a>

	<div id="aesop-editor--gallery-create">

		<a id="aesop-editor--gallery-upload" href="#">Select Images</a>

		<div id="aesop-editor--gallery-images">

		</div>

	</div>

	<!-- GALLERY THUMBS GET WITH JS -->
	<div>
	</div>


	<input type="hidden" name="aesop-gallery-ids">

	<?php

	return ob_get_clean();
}