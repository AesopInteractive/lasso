(function( $ ) {

	var form;

	//$('#lasso--component-settings-form').live('submit', function(e) {
	jQuery(document).on('submit', '#lasso--component-settings-form', function(e){

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
		
		
		// get updated aesop componets through ajax calls
		var get_aesop_component_ajax = function(cdata)
		{
			var data = {
				action: 'get_aesop_component',
				code: 'aesop_'+cdata['componentType']
			};
			for ( var index in cdata ) {
				// Don't accept componentType as a param
				if ( !cdata.hasOwnProperty(index) || index == 'componentType'  || index =='sortableItem') {
					continue;
				}
				data[index] = cdata[index];
			}
						
			jQuery.post(lasso_editor.ajaxurl2, data, function(response) {
				if( response ){
					debugger;
					$component.replaceWith(response);
					$('.aesop-component').each(function(){

						// if there's no toolbar present
						if ( !$('.lasso-component--toolbar').length > 0 ) {

							// if this is a map then we need to first wrap it so that we can drag the  map around
							if ( $(this).hasClass('aesop-map-component') ) {

								var $this = $(this)

								// so wrap it with a aesop-compoentn aesop-map-component div
								// @todo - note once a map is inserted it can't be edited after saving again. a user has to delete the existin map and add a new map
								// to
								//$this.wrap('<form id="lasso--map-form" class="aesop-component aesop-map-component lasso--map-drag-holder" data-component-type="map" >').before( lassoDragHandle ).after( lassoMapForm );
								$this.wrap('<div id="lasso--map-form" class="aesop-component aesop-map-component lasso--map-drag-holder" data-component-type="map" >').before( lassoDragHandle );

							} else {

								$(this).append( lasso_editor.handle );
							}
						}
					});
				} else {
					alert("error");
				}
			});
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
			lasso_editor.dirtyByComponent = true;

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
			if (form.hasClass('creating-gallery')) {
				data['edgallerytitle'] = document.getElementById("lasso--gallery__galleryname").value;
			}

			$.post( lasso_editor.ajaxurl, data, function(response) {

				if ( 'gallery-created' == response.data.message ) {

					saveSequence( false, 1000, true );
					editus_gallery_swap(response.data.id);

				} else if ( 'gallery-updated' == response.data.message ) {

					saveSequence( false, 1000 );
					form.before(lasso_editor.refreshRequired);

				} else {

					alert( 'error' );

				}

			}).fail(function(xhr, err) { 
				var responseTitle= $(xhr.responseText).filter('title').get(0);
				alert($(responseTitle).text() + "\n" + EditusFormatAJAXErrorMessage(xhr, err) );
			});

		} else {

			saveSequence( true, 1200 );

		}
		
		if ( 'image' == cdata['componentType'] || 'quote' == cdata['componentType'] || 'parallax' == cdata['componentType'] || 'chapter' == cdata['componentType'] ||
		      'character' == cdata['componentType']) {
			get_aesop_component_ajax(cdata);
		}

	});
	function editus_gallery_swap(galleryID){
		var data = {
			action: 		'process_gallery_swap',
			gallery_id: 	galleryID,
			nonce: 			lasso_editor.swapGallNonce
		}

		$.post( lasso_editor.ajaxurl, data, function(response) {
			if( true == response.success ) {
				// window.component is the current component being edited
				window.component.replaceWith( response.data.gallery );
			}
		});
	}

})( jQuery );
