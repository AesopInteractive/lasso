<?php

/**
*
*	Draw teh component modal
*
*
*/
function aesop_editor_component_modal(){

	ob_start();

	?>
	<div id="aesop-editor--modal">
		<div class="aesop-editor--modal__inner">

			<span id="aesop-editor--modal__close" >x</span>

			<div id="aesop-editor--modal__left">
				<ul>
					<li class="image">Image</li>
					<li class="character">Character</li>
					<li class="quote">Quote</li>
					<li class="content">Content</li>
					<li class="chapter">Chapter</li>
					<li class="parallax">Parallax</li>
					<li class="audio">Audio</li>
					<li class="video">Video</li>
					<li class="map">Map</li>
					<li class="timeline">Timeline</li>
					<li class="document">Document</li>
					<li class="collection">Collection</li>
					<li class="gallery">Gallery</li>
				</ul>
			</div>

			<div id="aesop-editor--modal__right">
				<p>Component Settings</p>
			</div>

		</div>
	</div>
	<div id="aesop-editor--modal__overlay"></div>
	<?php

	return ob_get_clean();
}