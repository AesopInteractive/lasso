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

function aesop_editor_toolbar(){

	ob_start();

	?>
	<div class="aesop-editor--toolbar_wrap">
		<ul class="aesop-editor--toolbar__inner">
		    <li id="aesop-toolbar--bold"></li>
		    <li id="aesop-toolbar--underline" ></li>
		    <li id="aesop-toolbar--italic"></li>
		    <li id="aesop-toolbar--strike"></li>
		    <li id="aesop-toolbar--components">
			    <ul>
					<li class="image"></li>
					<li class="character"></li>
					<li class="quote"></li>
					<li class="content"></li>
					<li class="chapter"></li>
					<li class="parallax"></li>
					<li class="audio"></li>
					<li class="video"></li>
					<li class="map"></li>
					<li class="timeline"></li>
					<li class="document"></li>
					<li class="collection"></li>
					<li class="gallery"></li>
			    </ul>
			</li>
		</ul>
	</div>
	<?php return ob_get_clean();
}