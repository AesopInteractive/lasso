(function( $ ) {

	var form;

	$('#aesop--component-settings-form').live('submit', function(e) {

		e.preventDefault();

		var $component = window.component;
		var cdata = $component.data();

		form = $('#aesop--component-settings-form');

		var $this = $(this);

		/////////////
		//	UPDATE COMPONENT SETTINGS DATA ATTS
		// 	- this is run when the user saves teh component which then let's us use these to map back to the original shortcode on post save
		/////////////

	    $this.find('.aesop-generator-attr').each(function(){

	      var optionName = $(this).closest('.aesop-option').data('option');
	      if ( '' !== $(this).val() ) {
	      	$component.attr( 'data-' + optionName, $(this).val() );
	      	$component.data(optionName, $(this).val() );
				}

	    });

	    var cleanFields = function( cdata ){
	    	delete cdata['sortableItem'];
	    	return cdata;
	    }

		$('#aesop-generator-insert').val('Saving...');

		var data = {
			action: 		'process_update_component',
			postid: 		aesop_editor.postid,
			unique: 		cdata['unique'],
			fields: 		cleanFields(cdata),
			gallery_ids: 	$('#ase_gallery_ids').val(),
			type: 			cdata['componentType'],
			nonce: 			$('#aesop-generator-nonce').val()
		}

		/////////////
		//	DO TEH SAVE
		/////////////
		$.post( aesop_editor.ajaxurl, data, function(response) {

			console.log(response);

			if( response == 'success' ) {

				$('#aesop-generator-insert').addClass('saved');
				$('#aesop-generator-insert').val('Saved!');

				setTimeout(function(){
					$('body').removeClass('aesop-sidebar-open');
				},800);

			} else if( 'error' == response ) {

				alert('error');

			}


		});

	});

})( jQuery );