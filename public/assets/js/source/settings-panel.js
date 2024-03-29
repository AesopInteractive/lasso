(function( $ ) {

	$(document).ready(function(){

		// helper to dstry the sidebar
		var destroySidebar = function(){
			$('body').removeClass('lasso-sidebar-open');
		}

		// close the sidebar when clicking outside of it
		$('body').on('click', '#'+lasso_editor.editor, function(){
             //lets not for now
			//destroySidebar()
		});

		// helper to set the height of the settings panel
		var settingsHeight = function(){

			var settings = $('#lasso--component__settings');

			settings.height( $(window).height() );

			$(window).resize(function(){
				settings.height( $(window).height() );
				//$('#lasso--component__settings').perfectScrollbar('update');
			});
		}

		var component, data;

		/////////////
		// OPEN COMPONENT SETTINGS
		////////////
		$(document).on('click','.lasso-component--settings__trigger',function(){

			var settings 	= $('#lasso--component__settings')
			var click       = $(this)

			// let's set our globals
			if ( $(this).parent().parent().hasClass('aesop-map-component') ) {
				component = $(this).parent().parent().find('.aesop-component');
			} else {
				component = $(this).closest('.aesop-component,.lasso-component,.wp-block-image,.wp-block-cover');
			}
            
            data = component.data();
            if (!data) { return;}

			// let's force globalize this until we refactor the js
			window.component = component;
			window.componentClone = component.clone();
			
            if (data['componentType'] == 'wpimg') {
                if ($(component).find('figure.lasso-component').length) {
                    data = $(component).find('figure.lasso-component').data();//'.wp-image.lasso-component').data();
                } else if ($(component).find('img').length) {
                    data['img'] =$(component).find('img').attr('src');
                }
            }
            
            if (data['componentType'] == 'wpimg-block') {
				if ($(component).find('img').length) {
					var $img = $(component).find('img');
                    data['img'] =$img.attr('src');
					data['alt'] =$img.attr('alt');
					var c = $img.attr('class');
                    
                    var $fig = $(component).find('figure');
                    if ($fig.hasClass('alignright')) {
                        data['align']='right';
                    } else if ($fig.hasClass('aligncenter')) {
                        data['align']='center';
                    } else if ($fig.hasClass('alignleft')) {
                        data['align']='left';
                    }
				
					if (c && c.indexOf('wp-image-') == 0) {
						data['id'] = c.substr(9);
					}
                    if ($(component).find('figcaption').length) {
                        data['caption'] = $(component).find('figcaption').text();
                    }
                    if ($(component).find('a').length) {
                        data['link'] = $(component).find('a').attr("href");
                    }
                }
			}
            
            if (data['componentType'] == 'wpcover-block') {
				if ($(component).find('img').length) {
					var $img = $(component).find('img');
                    data['img'] =$img.attr('src');
                }
			}
            
            if (data['componentType'] =='wpquote') { return;}
            
            if (!lasso_editor.component_options) return;
			// special case for hero gallery
			if ( $(this).parent().parent().hasClass('aesop-hero-gallery-wrapper') ) {
			    jQuery.extend(data, $(component).find(".fotorama").data());
			}

			// add a body class
			$('body').toggleClass('lasso-sidebar-open');

			settings.find('input[name="unique"]').val( data['unique'] );

			// set up settings panel
			settingsHeight();
			settings.html( lasso_editor.component_options[data.componentType] );

			// add the type as a value in a hidden field in settings
			settings.find('.component_type').val( data.componentType );

			// fade in save controls
			$('.lasso-buttoninsert-wrap').fadeIn(600);

			// initialize scrolbar
			settings.perfectScrollbar('destroy');
			settings.perfectScrollbar();

			// map the settings from the data attributes on components into appropriate settings in settings panel
			settings.find('.lasso-option').each(function(){

				var option = $(this).data('option');
				var field = $(this).find('.lasso-generator-attr');

				// if it's a gallery data attribute map the cehcekd attribute to the right place
				// @todo - account for map stuff
				if ( 'gallery-type' == option ) {

					// this function is repeated on process-gallery-opts line 4
					var value_check = function( value ){

						if ( 'grid' == value ) {
							$('.ase-gallery-opts--thumb').fadeOut();
							$('.ase-gallery-opts--photoset').fadeOut();
							$('.ase-gallery-opts--hero').fadeOut();
							$('.ase-gallery-opts--grid').fadeIn();
						} else {
							$('.ase-gallery-opts--grid').fadeOut();
						}

						if ( 'thumbnail' == value ) {
							$('.ase-gallery-opts--grid').fadeOut();
							$('.ase-gallery-opts--photoset').fadeOut();
							$('.ase-gallery-opts--hero').fadeOut();
							$('.ase-gallery-opts--thumb').fadeIn();
						} else {
							$('.ase-gallery-opts--thumb').fadeOut();
						}

						if ( 'photoset' == value ) {
							$('.ase-gallery-opts--grid').fadeOut();
							$('.ase-gallery-opts--thumb').fadeOut();
							$('.ase-gallery-opts--hero').fadeOut();
							$('.ase-gallery-opts--photoset').fadeIn();
						} else {
							$('.ase-gallery-opts--photoset').fadeOut();
						}
						
						if ( 'hero' == value ) {
							$('.ase-gallery-opts--grid').fadeOut();
							$('.ase-gallery-opts--thumb').fadeOut();
							$('.ase-gallery-opts--photoset').fadeOut();
							$('.ase-gallery-opts--hero').fadeIn();
						} else {
							$('.ase-gallery-opts--hero').fadeOut();
						}
					}

					$(field).each(function(){

						if ( $(this).val() == data.galleryType ) {

							$(this).parent().addClass('selected')
							$(this).prop('checked',true);

							value_check( $(this).val() );

							// add the type to a hidden field
							$('#ase_gallery_type').val( $(this).val() )

						}

					});

				} else {

					$( field[0] ).val(data[option]);

				}

			});

			////////////
			// SMOOTH SLIDE TO COMPONENT - @since 0.9.5
			///////////

			// if its a content component
			if ( component.hasClass('aesop-content-component') ) {

				var target = component.find('.aesop-content-comp-wrap').attr('id')
				, 	item = $('#'+target)

			} else {

				var item = $('#'+component.attr('id') )
			}

            if (item.length) {
                //$('html, body').animate({ scrollTop: item.offset().top - 50  }, 400);
            }

			/////////////
			// GET GALLERY IMAGES IF ITS A GALLERY
			/////////////

			//if ( $(this).parent().parent().hasClass('empty-gallery') ) {
				//settings.addClass('gallery-no-images')
			//}

			if ( $(this).parent().parent().hasClass('aesop-gallery-component') ) {

				var $this 		= $(this)
				,	ajaxurl 	= lasso_editor.ajaxurl
				,	form 		= $('#lasso--component-settings-form.gallery')
				,	nonce 		= lasso_editor.getGallImgNonce
				,	gall_id 	= data['id']

				var data      = {
					action:    	'process_gallery_get-images',
					post_id:   	gall_id,
					nonce: 		nonce
				};

				// post ajax response with data
				$.post( ajaxurl, data, function(response) {

					$('#lasso--gallery__images').html( response.data.html );

					/////////////
					// CALL SORTABLE ON RECIEVED IMAGES
					/////////////
					var	gallery = $('#ase-gallery-images');

					gallery.ready(function(){

						gallery.sortable({
							containment: 'parent',
							cursor: 'move',
							opacity: 0.8,
							placeholder: 'ase-gallery-drop-zone',
							forcePlaceholderSize:true,
							update: function(){
								var imageArray = $(this).sortable('toArray');
						  		$('#ase_gallery_ids').val( imageArray );
							},
							create: function(){
								var imageArray = $(this).sortable('toArray');
						  		$('#ase_gallery_ids').val( imageArray );
							}
						});
					});
				}).fail(function(xhr, err) { 
					var responseTitle= $(xhr.responseText).filter('title').get(0);
					alert($(responseTitle).text() + "\n" + EditusFormatAJAXErrorMessage(xhr, err) );
				});;

			}

		}).on('click', '#lasso-upload-img', function( e ){

		    e.preventDefault();

		    className = e.currentTarget.parentElement.className;

		    var type   = $('input[name="component_type"]').val()

		    // If the media frame already exists, reopen it.
			if ( typeof lasso_file_frame != 'undefined' ) {
				lasso_file_frame.close();
			}

		    // Create the media frame.
		    lasso_file_frame = wp.media.frames.file_frame = wp.media({
		      	title: 'Select Image',
		      	button: {
		        	text: 'Insert Image',
		      	},
		      	multiple: false  // Set to true to allow multiple files to be selected
		    });

		    // When an image is selected, run a callback.
		    lasso_file_frame.on( 'select', function() {

		      	var attachment = lasso_file_frame.state().get('selection').first().toJSON();

		      	$('.aesop-generator-attr-media_upload').prop('value',attachment.url);

				/////////////
				// START LIVE IMAGE EDITING COMPONENTS
				// @todo - this was going to be taken care of in above but it seems we have to bind this to the file upload here?
				////////////
		      	if ( 'parallax' == type ) {

				  	component.find('.aesop-parallax-sc-img').prop('src', attachment.url )

		      	} else if ( 'quote' == type ) {

				  	component.css({
				  		'background-image': 'url('+ attachment.url +')'
				  	});

		      	} else if ( 'image' == type ) {
                    $("#aesop-generator-attr-img").val(attachment.url);
				  	component.find('.aesop-image-component-image > img').prop('src', attachment.url);
					// new addition for panorama images
					component.find('.paver__pano').css({'background-image': 'url('+ attachment.url +')'});

		      	} else if ( 'character' == type ) {

				  	component.find('.aesop-character-avatar').prop('src', attachment.url)

		      	} else if ( 'chapter' == type ) {

		      		component.find('.aesop-article-chapter').css({
				  		'background-image': 'url('+ attachment.url +')'
				  	});

		      	}else if ( 'wpimg' == type ) {
                    var img = window.component.find('img');
                    if (img.length>0) {
		      		   img.prop('src', attachment.url );
                       img.prop("srcset","");
                    }
		      	}
                else if ( 'wpimg-block' == type ) {
                    var img = window.component.find('img');
                    if (img.length >0) {
		      		   img.prop('src', attachment.url );
                       img.prop("srcset","");
					   if (attachment.id) {
                           img.removeClass();
						   img.addClass("wp-image-"+attachment.id);
                           window.component.data( 'id', ""+attachment.id);
					   }
                    }
		      	}
                else if ( 'wpcover-block' == type ) {
                    var img = window.component.find('img');
                    if (img.length >0) {
		      		   img.prop('src', attachment.url );
                       img.prop("srcset","");
                       img.removeClass();
                       img.addClass("wp-block-cover__image-background");
					   if (attachment.id) {
						   img.addClass("wp-image-"+attachment.id);
					   }
                    } else {
                       window.component.css('background-image', "url("+attachment.url+")");
                    }

		      	}
				/////////////
				// EDN LIVE IMAGE EDITING COMPONENTS
				////////////

		    });

		    // Finally, open the modal
			lasso_file_frame.open();
		});

		// destroy panel if clicking close or overlay
		//$('#lasso--sidebar__close').live('click',function(e){
		// cancel 
		jQuery(document).on('click','#lasso--sidebar__close',function(e){
			e.preventDefault();
			window.component.replaceWith(window.componentClone); //restore the state before editing
			destroySidebar();
			$('#lasso--component__settings').perfectScrollbar('destroy');
		});

});

})( jQuery );
