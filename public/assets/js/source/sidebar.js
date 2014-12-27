(function( $ ) {
	'use strict';

	$(document).ready(function(){

		// helper to dstry the sidebar
		var destroySidebar = function(){
			$('body').removeClass('aesop-sidebar-open');
		}

		// helper to set the height of the settings panel
		var settingsHeight = function(){

			$('#aesop-editor--component__settings').height( $(window).height() );

			$(window).resize(function(){
				settingsHeight();
				$('#aesop-editor--component__settings').perfectScrollbar('update');
			});
		}

		/////////////
		// OPEN COMPONENT SETTINGS
		////////////
		$('#aesop-component--settings__trigger').live('click',function(){

			// add a body class
			$('body').toggleClass('aesop-sidebar-open');

			// get the component type
			var type = $(this).closest('.aesop-component').attr('data-component-type'),
				unique = $(this).closest('.aesop-component').attr('data-unique');

			// set the height on settings div
			settingsHeight();

			// add the options to the settings div
			$('#aesop-editor--component__settings').html( aesop_editor.component_options[type] );

			// fade in save controls
			$('.aesop-buttoninsert-wrap').fadeIn(600);

			// add the type as a value in ahidden field in settings
			$('#aesop--component-settings-form .component_type').val( type );

			// and also add the type and unique as data atts to the form field
			$('#aesop--component-settings-form').attr({
				'data-type': type,
				'data-unique': unique
			}).addClass(type);

			// add the unique as a value
			$('#aesop--component-settings-form input[name="unique"]').val( unique );

			// initialize scrolbar
			$('#aesop-editor--component__settings').perfectScrollbar('destroy');
			$('#aesop-editor--component__settings').perfectScrollbar();

			/////////////
			//	ADD COMPONENT SETTINGS AS DATA ATTS
			//  @TODO - Move this to teh recieve method when the item gets dragged onto the page
			/////////////
			$('#aesop--component-settings-form.'+type+' .aesop-generator-attr').each(function(){

				var $this = 	$(this),
					optionName = $(this).closest('.aesop-option').data('option');

				// 1. add shortcode attributes as data atts to teh component
				if ( '' !== $this.val() ) {
					$('#aesop-'+type+'-component-'+unique+' ').attr('data-'+optionName+'', $this.val() );
				}

			});

			/////////////
			// LIVE EDITING OF COMPONENTS
			////////////

			// let's start with a simple test editing of quote component
			/*
			$('#aesop--component-settings-form.quote #aesop-generator-attr-background').live('change',function(){

				var $this =  $(this),
				optionName = $(this).closest('.aesop-option').data('option');

			  	$('#aesop-quote-component-'+unique+' ').css({
			  		'background-color': $(this).val()
			  	});
			  	$('#aesop-quote-component-'+unique+' ').attr('data-'+optionName+'', $(this).val() );
			});
			*/

		});

		// destroy modal if clicking close or overlay
		$('#aesop-editor--sidebar__close').live('click',function(e){
			e.preventDefault();
			destroySidebar();
			$('#aesop-editor--component__settings').perfectScrollbar('destroy');
		});
	});

	/////////////
	// FILE UPLOAD
	////////////
	var file_frame;
	var className;

	$(document).on('click', '#aesop-upload-img', function( e ){

	    e.preventDefault();

	    className = e.currentTarget.parentElement.className;

	    // If the media frame already exists, reopen it.
	    if ( file_frame ) {
	      	file_frame.open();
	      	return;
	    }

	    // Create the media frame.
	    file_frame = wp.media.frames.file_frame = wp.media({
	      	title: $( this ).data( 'uploader_title' ),
	      	button: {
	        	text: $( this ).data( 'uploader_button_text' ),
	      	},
	      	multiple: false  // Set to true to allow multiple files to be selected
	    });

	    // When an image is selected, run a callback.
	    file_frame.on( 'select', function() {

	      var attachment = file_frame.state().get('selection').first().toJSON();

	      $('.aesop-generator-attr-media_upload').val(attachment.url);
	    });

	    // Finally, open the modal
	    file_frame.open();
	});

})( jQuery );