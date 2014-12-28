(function( $ ) {
	'use strict';

	$( '#aesop--component-settings-form' ).live('submit', function(e) {

		e.preventDefault();

		var $this = $(this);

		var unique = $(this).find('input[name="unique"]').val(),
			type   = $(this).find('input[name="component_type"]').val();

		/////////////
		//	ADD COMPONENT SETTINGS AS DATA ATTS
		// 	- this is run when the user saves teh component which then let's us use these to map back to the original shortcode on post save
		/////////////

		$('#aesop--component-settings-form.'+type+'[data-unique="'+unique+'"] .aesop-generator-attr').each(function(){

			var $this = 	$(this),
				optionName = $(this).closest('.aesop-option').data('option');

			if ( '' !== $this.val() ) {
				$('#aesop-'+type+'-component-'+unique+' ').attr('data-'+optionName+'', $this.val() );
			}

		});

		/////////////
		//	PUSH SETTINGS INTO AN ARRAY AND STORY INTO POST META FOR SAFE KEEPING
		//	- at the moment this isn't being used anywhere but I've had the need to access settings like this before
		// 	- it stores as post meta then when the component is deleted teh post meta is purged
		/////////////
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
			unique: unique,
			fields: JSON.stringify( optionArray ),
			type: 	type,
			nonce: 	$('#aesop-generator-nonce').val()
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