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
			    <ul id="aesop-toolbar--components__list">
					<li data-type="image" class="image"></li>
					<li data-type="character" class="character"></li>
					<li data-type="quote" class="quote"></li>
					<li data-type="content" class="content"></li>
					<li data-type="chapter" class="chapter"></li>
					<li data-type="parallax" class="parallax"></li>
					<li data-type="audio" class="audio"></li>
					<li data-type="video" class="video"></li>
					<li data-type="map" class="map"></li>
					<li data-type="timeline" class="timeline"></li>
					<li data-type="document" class="document"></li>
					<li data-type="collection" class="collection"></li>
					<li data-type="gallery" class="gallery"></li>
			    </ul>
			</li>
		</ul>
	</div>
	<?php return ob_get_clean();
}

/*
*
*	Drag handle
*/
function aesop_editor_handle(){

	ob_start();

	if ( !is_user_logged_in() || !current_user_can('edit_posts') )
		return;

	?><ul class="aesop-component--controls">
				<li class="aesop-drag"></li>
				<li id="aesop-component--settings__trigger" class="aesop-settings"></li>
			</ul>

	<?php return ob_get_clean();
}