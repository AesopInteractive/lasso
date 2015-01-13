(function( $ ) {

	$(document).ready(function(){

		/////////////
		// SAVE TITLE
		//////////////
		var form;

		$(aesop_editor.titleClass).on('blur', function() {

			var $this = $(this);

			var data = {
				action: 		'process_update_title',
				postid: 		aesop_editor.postid,
				title:          $this.text(),
				nonce: 			aesop_editor.titleNonce
			}

			/////////////
			//	UPDATE THE TITLE
			/////////////
			$.post( aesop_editor.ajaxurl, data, function(response) {

				console.log(response);

			});

		});

	});

})( jQuery );