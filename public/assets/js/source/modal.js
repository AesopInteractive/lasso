(function( $ ) {
	'use strict';

	$(document).ready(function(){

		// modal click
		$('#aesop-toolbar--modal').live('click',function(){

			// add a body class
			$('body').toggleClass('aesop-modal-open');

			// append teh modal markup ( aesop_editor_component_modal() )
			$('body').append(aesop_editor.component_modal);

		});

	});

})( jQuery );