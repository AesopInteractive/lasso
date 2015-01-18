(function( $ ) {

	$(document).ready(function(){

		/////////////////
		/// MODAL LOGIC
		///////////////////

		// method to destroy the modal
		var destroyModal = function(){
			$('body').removeClass('aesop-modal-open');
			$('#aesop-editor--post-settings__modal, #aesop-editor--modal__overlay').remove();
		}

		// modal click
		$('#aesop-editor--post-settings').live('click',function(e){

			e.preventDefault();

			// add a body class
			$('body').toggleClass('aesop-modal-open');

			// append teh modal markup ( aesop_editor_component_modal() )
			$('body').append(aesop_editor.component_modal);

			////////////
			// RESIZE THE URL HELPER FIELD
			////////////
			var mask 		= $('.url-helper')
			,	mWidth 		= mask.outerWidth()
			,	field  		= $('input[name="story_slug"]')
			,	maxLength   = 342

			field.css({'width':maxLength - mWidth + 2});

			/////////////////
			/// UI SLIDER INIT AND METHODS
			///////////////////

			// return the right value
			var statusReturn = function( value ) {

				var out;

				if ( 100 == value ) {
					out = 'draft';
				} else if ( 200 == value ) {
					out = 'publish';
				} else if ( 'draft' == value ) {
					out = 100;
				} else if ( 'publish' == value ) {
					out = 200;
				}
				return out;
			}

			// init slider
		    $('#aesop-editor--slider').slider({
		      	value:statusReturn(aesop_editor.post_status),
		      	min: 100,
		      	max: 200,
		      	step: 100,
		      	animate:'fast',
		      	slide: function( event, ui ) {
		        	$('input[name="status"]').val( statusReturn(ui.value) );

		        	$('.aesop-editor--postsettings__footer').slideDown()

		        	if ( 100 == ui.value ) {
		        		$('.story-status').removeClass('story-status-publish').addClass('story-status-draft')
		        	} else if ( 200 == ui.value ) {
		        		$('.story-status').removeClass('story-status-draft').addClass('story-status-publish')
		        	}
		      	}
		    });
		    $('input[name="status"]').val( statusReturn( $( "#aesop-editor--slider" ).slider('value') ) );

		    // if any changes happen then show the footer
		    $('input[name="story_slug"]').on('keyup',function(){
			  	$('.aesop-editor--postsettings__footer').slideDown()
			});

		});

		// destroy modal if clicking close or overlay
		$('#aesop-editor--modal__close, #aesop-editor--modal__overlay, .aesop-editor--postsettings-cancel').live('click',function(e){
			e.preventDefault();
			destroyModal();
		});

		/////////////////
		/// EXIT SETTINGS
		///////////////////
		$(document).keyup(function(e) {

			if ( 27 == e.keyCode ) {

				destroyModal();
			}

		});

		/////////////
		// SAVE SETTINGS
		//////////////
		var form;

		$('#aesop-editor--postsettings__form').live('submit', function(e) {

			e.preventDefault();

			var $this = $(this);

			$(this).find('input[type="submit"]').val('Saving...');

			var data = $this.serialize();

			/////////////
			//	DO TEH SAVE
			/////////////
			$.post( aesop_editor.ajaxurl, data, function(response) {

				//console.log(response);

				if( true == response.success ) {

					$('input[type="submit"]').addClass('saved');
					$('input[type="submit"]').val('Saved!');
					location.reload();

					window.location.replace(aesop_editor.permalink);

				} else {

					alert('error');

				}


			});

		});

	});

})( jQuery );