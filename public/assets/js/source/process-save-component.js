(function( $ ) {

	var form;

	$('#lasso--component-settings-form').live('submit', function(e) {

		e.preventDefault();

		// store some atts
		var $component 	= window.component
		,	cdata 		= $component.data()
		,	saveInsert 	= $('#lasso-generator-insert')
		,	form 		= $('#lasso--component-settings-form')
		,	$this 		= $(this);

		// let people know something is happening
		saveInsert.val(lasso_editor.strings.saving);

		// send the new settings to the component and update it's data attributes
	    $this.find('.lasso-generator-attr').each(function(){

	      	var optionName = $(this).closest('.lasso-option').data('option');

	      	// save even if the entry is blank
	      	//if ( '' !== $(this).val() ) {
	      	$component.attr( 'data-' + optionName, $(this).val() );
	      	$component.data(optionName, $(this).val() );
			//}

	    });

	    // return the data attributes as field for the sortable item
	    var cleanFields = function( cdata ){
	    	delete cdata['sortableItem'];
	    	return cdata;
	    }

	    /**
	    *
	    *	Build a sequence that saves, adds a class, and removs the sidebar
	    *	@param stall bool should we stall on save? typically used for all but the gallery component which runs an ajax call
	    *	@param timeout int how long should we timeout before removing the settings sidebar
	    *	@param gallery bool is this a gallery creation? otherwise let's mod the label
	    */
	    var saveSequence = function( stall, timeout, gallery ){

	    	// add a saved class then change the save label to saved
	    	var saveActions = function(gallery){

	    		saveInsert.addClass('saved');

	    		if ( true == gallery ) {

					saveInsert.val(lasso_editor.strings.galleryCreated);

	    		} else {

					saveInsert.val(lasso_editor.strings.saved);
				}
	    	}

	    	if ( true == stall ) {

				setTimeout( function(){ saveActions(); }, 500 );

			} else if ( true == gallery ) {

				form.addClass('hide-all-fields').prepend('<div id="lasso--pagerefresh">Gallery Created! Save your post and refresh the page to access this new gallery.</div>')

				setTimeout( function(){ saveActions(true); }, 500 );

	    	} else {

		    	saveActions();

	    	}

			setTimeout( function(){ $('body').removeClass('lasso-sidebar-open'); }, timeout );

	    }

		// make an ajax call to deal with gallery saving or creating only if it's a gallery
		if ( 'gallery' == cdata['componentType'] ) {

			var data = {
				action: 		form.hasClass('creating-gallery') ? 'process_gallery_create' : 'process_gallery_update',
				postid: 		cdata['id'],
				unique: 		cdata['unique'],
				fields: 		cleanFields(cdata),
				gallery_type:   $('#ase_gallery_type').val(),
				gallery_ids: 	$('#ase_gallery_ids').val(),
				nonce: 			$('#lasso-generator-nonce').val()
			}

			$.post( lasso_editor.ajaxurl, data, function(response) {

				if ( 'gallery-created' == response.data.message ) {

					saveSequence( false, 1000, true );

				} else if ( 'gallery-updated' == response.data.message ) {

					saveSequence( false, 1000 );
					form.before(lasso_editor.refreshRequired);

				} else {

					alert( 'error' );

				}

			});

		} else {

			saveSequence( true, 1200 );

		}

	});

})( jQuery );
