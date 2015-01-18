(function( $ ) {

	var form;

	$('#aesop--component-settings-form').live('submit', function(e) {

		e.preventDefault();

		var $component = window.component;
		var cdata = $component.data();
		var saveInsert = $('#aesop-generator-insert');

		form = $('#aesop--component-settings-form');

		var $this = $(this);

		// let people know something is happening
		saveInsert.val('Saving...');

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

	    /**
	    *
	    *	Build a sequence that saves, adds a class, and removs the sidebar
	    *	@param stall bool should we stall on save? typically used for all but the gallery component which runs an ajax call
	    *	@param timeout int how long should we timeout before removing the settings sidebar
	    */
	    var saveSequence = function( stall, timeout ){

	    	// add a saved class then change the save label to saved
	    	var saveActions = function(){
	    		saveInsert.addClass('saved');
				saveInsert.val('Saved!');
	    	}

	    	if ( true == stall ) {

				setTimeout(function(){
					saveActions();
				}, 500 );

	    	} else {

		    	saveActions();

	    	}

			setTimeout(function(){
				$('body').removeClass('aesop-sidebar-open');
			}, timeout );

	    }

		// make an ajax call to deal with gallery saving only if it's a gallery
		if ( 'gallery' == cdata['componentType'] ) {

			var data = {
				action: 		'process_update_gallery',
				postid: 		aesop_editor.postid,
				unique: 		cdata['unique'],
				fields: 		cleanFields(cdata),
				gallery_ids: 	$('#ase_gallery_ids').val(),
				//type: 			cdata['componentType'],
				nonce: 			$('#aesop-generator-nonce').val()
			}

			$.post( aesop_editor.ajaxurl, data, function(response) {

				console.log(response);

				if( true == response.success ) {

					saveSequence(false,800);

				} else {

					alert('error');

				}


			});

		} else {

			saveSequence(true,1200);

		}

	});

})( jQuery );