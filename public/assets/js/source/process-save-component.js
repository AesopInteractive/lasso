(function( $ ) {

	var form;
    // get updated aesop componets through ajax calls (global function)
	window.get_aesop_component_ajax = function(cdata)
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
					response = response.replace(/\\'/g, "'");
					var $a = $(response);
					window.component.replaceWith($a);
					window.component = $a;
					if ($a.find('.fotorama')){
						$('.fotorama').fotorama();
					}
					if ($a.find('.aesop-gallery-photoset')){
						$(window).trigger( 'load' ); 
					}
					$('.aesop-component').each(function(){
						if ($(this).css("height")=="0px") {
							$(this).css("height","auto");
						}

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
					if ('video' == cdata['componentType']) {
						$('.aesop-video-component').fitVids();			
					}
					if ('gallery' == cdata['componentType']) {
						get_aesop_options('gallery');
					}
					if ('gallery_pop' == cdata['componentType']) {
						get_aesop_options('gallery_pop');
					}
					lasso_editor.dirtyByComponent = true;
				} else {
					alert("error");
			}
		});
	}
	
	//reload aesop component options
	function get_aesop_options(comp)
	{
		var data = {
				action: 'editus_get_ase_options',
				component: comp
		};
						
		jQuery.post(lasso_editor.ajaxurl2, data, function(response) {
				if( response ){				
					lasso_editor.component_options[comp] = response;
				} else {
					alert("error");
			}
		});
	}

	//$('#lasso--component-settings-form').live('submit', function(e) {
	//jQuery(document).on('submit', '#lasso--component-settings-form', function(e){
    jQuery(document).on('submit', '#aesop-generator-settings', function(e){

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

				//form.addClass('hide-all-fields').prepend('<div id="lasso--pagerefresh">Gallery Created! Save your post and refresh the page to access this new gallery.</div>')

				setTimeout( function(){ saveActions(true); }, 500 );

	    	} else {

		    	saveActions();

	    	}

			setTimeout( function(){ $('body').removeClass('lasso-sidebar-open'); }, timeout );
			articleMedium.makeUndoable();
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
					// load the new gallery
					cdata['id'] = response.data.id;

				} else if ( 'gallery-updated' == response.data.message ) {

					saveSequence( false, 1000 );
					form.before(lasso_editor.refreshRequired);

				} else {

					alert( 'error' );

				}
				window.get_aesop_component_ajax(cdata);

			}).fail(function(xhr, err) { 
				var responseTitle= $(xhr.responseText).filter('title').get(0);
				alert($(responseTitle).text() + "\n" + EditusFormatAJAXErrorMessage(xhr, err) );
			});

		} else {

			saveSequence( true, 1200 );

		}
		
		if ( 'image' == cdata['componentType'] || 'quote' == cdata['componentType'] || 'parallax' == cdata['componentType'] || 'chapter' == cdata['componentType'] || 'video' == cdata['componentType'] ||
		      'character' == cdata['componentType'] || 'collection' == cdata['componentType'] || 'audio' == cdata['componentType']) {
			window.get_aesop_component_ajax(cdata);
		} else if ('content' == cdata['componentType']) {
			var inner = component.find('.aesop-component-content-data');

			if ( inner.length != 0 ) {
				cdata['content_data'] = inner[0].innerHTML;
			}
			window.get_aesop_component_ajax(cdata);
		} /*else if ('events' == cdata['componentType']) {
			//aesop events
			alert("Save and Reload the page to see the update.");
		}*/
	});

})( jQuery );
