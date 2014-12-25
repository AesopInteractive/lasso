(function( $ ) {
	'use strict';

	$(document).ready(function(){

		/////////////
		/// DROP UP
		/////////////
		$('#aesop-toolbar--components').live('click',function(){

			$(this).toggleClass('toolbar--drop-up');

		});

		/////////////
		/// DELETING
		/////////////
		var ajaxurl =  aesop_editor.ajaxurl;

		$('.aesop-delete').live('click',function(e) {

			// sore reference to this
			var $this = $(this);

			e.preventDefault();

			var data = {
				action: 'process_delete_component',
				nonce: $this.data('nonce')
			}

			var deleteComponent = function() {
			    if ( confirm('Delete this component?') ) {
			        $this.closest('.aesop-component').remove();
			    }
			    return false;
			}

			$.post( ajaxurl, data, function(response) {

				console.log(response);

				if( response == 'success' ) {

					console.log('success');

					deleteComponent();

				} else if( 'error' == response ) {

					alert('error');
					console.log('error');

				}


			});


		});

		/////////////
		/// CLONING
		/////////////
		$('.aesop-clone').live('click',function(e) {

			// sore reference to this
			var $this = $(this);

			e.preventDefault();

			$this.closest('.aesop-component').clone().insertAfter('.aesop-component');

		});

	});

})( jQuery );