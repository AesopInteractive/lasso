(function( $ ) {
	'use strict';

	$( '#aesop--component-settings-form' ).live('submit', function(e) {

		e.preventDefault();

		var $this = $(this);

		var optionArray = [];
	    $('.aesop-generator-attr').each(function() {

	        var name 	= $(this).attr('name'),
	        	value 	= $(this).val();

	        var item 	= {};
	        item['name'] = name;
	        item['value'] = value;

	        optionArray.push(item);

	    });

	    $('#aesop-generator-insert').val('Saving...');

		var data = {
			action: 'process_update_component',
			postid: $('input[name="postid"]').val(),
			unique: $('input[name="unique"]').val(),
			fields: JSON.stringify( optionArray ),
			type: 	$('input[name="component_type"]').val(),
			nonce: 	$('#aesop-generator-nonce').val()
		}

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