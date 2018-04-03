(function( $ ) {

	$(document).ready(function(){

		/////////////
		// LIVE EDITING COMPONENTS
		// @todo - this is hella dirty and needs to be cleaned up
		// @todo - move this mess to it's own file
		////////////

		$(document).on('click', '#lasso-component--settings__trigger', function(){

			var settings 	= $('#lasso--component__settings')

			// QUOTE LIVE EDIT ///////////////////
			//settings.find('#aesop-generator-attr-background').live('change',function(){
			settings.find('#aesop-generator-attr-background').on('change',function(){
			  	component.css({'background-color': $(this).val()});
			});
			//settings.find('#aesop-generator-attr-text').live('change',function(){
			settings.find('#aesop-generator-attr-text').on('change',function(){
			  	component.css({'color': $(this).val()});
			});
			settings.find('#aesop-generator-attr-quote').on('keyup',function(){
			  	component.find('blockquote span').text( $(this).val() );
			});
			settings.find('#aesop-generator-attr-cite').on('keyup',function(){

				var t = component.find('blockquote cite');

				if ( 0 == t.length ) {

					component.find('blockquote').append( '<cite class="aesop-quote-component-cite">'+$(this).val()+'</cite>' );

				} else {
			  		component.find('blockquote cite').text( $(this).val() );
				}
			});
			settings.find('.aesop-quote-width > #aesop-generator-attr-width').on('keyup',function(){
				component.css('width', $(this).val() );
			});
			settings.find('.aesop-quote-type #aesop-generator-attr-type').on('change',function(){

				var value = $(this).val()

				if ( 'pull' == value ) {
					component.css('background-color','transparent')
				}

				component.removeClass('aesop-quote-type-block aesop-quote-type-pull')

				component.addClass('aesop-quote-type-'+$(this).val()+' ')
			});

			settings.find('.aesop-quote-align #aesop-generator-attr-align').on('change',function(){

				var value = $(this).val()

				if ( 'left' == value ) {

					component.removeClass('aesop-component-align-right aesop-component-align-center')
					component.find('blockquote').removeClass('aesop-component-align-right aesop-component-align-center')

				} else if ( 'right' == value ) {

					component.removeClass('aesop-component-align-left aesop-component-align-center')
					component.find('blockquote').removeClass('aesop-component-align-left aesop-component-align-center')

				} else if ( 'center' == value ) {

					component.removeClass('aesop-component-align-left aesop-component-align-right')
					component.find('blockquote').removeClass('aesop-component-align-left aesop-component-align-right')

				}
				component.addClass('aesop-component-align-'+$(this).val()+' ')
				component.find('blockquote').addClass('aesop-component-align-'+$(this).val()+' ')
			});

			// PARALLAX LIVE EDIT ///////////////////
			settings.find('.aesop-parallax-caption > #aesop-generator-attr-caption').on('keyup',function(){


				var t = component.find('.aesop-parallax-sc-caption-wrap')

				if ( 0 == t.length ) {

					component.find('img').after( '<figcaption class="aesop-parallax-sc-caption-wrap bottom-left">'+$(this).val()+'</figcaption>' );

				} else {
			  		component.find('.aesop-parallax-sc-caption-wrap').text( $(this).val() );
				}
			})
			settings.find('.aesop-parallax-captionposition > #aesop-generator-attr-captionposition').on('change',function(){

				var value = $(this).val()

				if ( 'bottom-left' == value ) {

					component.find('.aesop-parallax-sc-caption-wrap').removeClass('bottom-right top-left top-right')

				} else if ( 'bottom-right' == value ) {

					component.find('.aesop-parallax-sc-caption-wrap').removeClass('bottom-left top-left top-right')

				} else if ( 'top-left' == value ) {

					component.find('.aesop-parallax-sc-caption-wrap').removeClass('bottom-right top-right bottom-left')

				} else if ( 'top-right' == value ) {

					component.find('.aesop-parallax-sc-caption-wrap').removeClass('bottom-right bottom-left top-left')

				}

				component.find('.aesop-parallax-sc-caption-wrap').addClass( value );

			})

			// IMAGE LIVE EDIT ///////////////////
			settings.find('.aesop-image-caption > #aesop-generator-attr-caption').on('keyup',function(){

				var t = component.find('.aesop-image-component-caption');

				if ( 0 == t.length ) {

					component.find('img').after( '<p class="aesop-image-component-caption">'+$(this).val()+'</p>' );

				} else {
					component.find('.aesop-image-component-caption').text( $(this).val() );
				}

			})
			settings.find('.aesop-image-imgwidth > #aesop-generator-attr-imgwidth').on('keyup',function(){
				component.find('.aesop-image-component-image').css('max-width', $(this).val() );
			})
			settings.find('.aesop-image-align > #aesop-generator-attr-align').on('change',function(){

				var value = $(this).val()

				if ( 'left' == value ) {

					component.find('.aesop-image-component-image').removeClass('aesop-component-align-right aesop-component-align-center')

				} else if ( 'right' == value ) {

					component.find('.aesop-image-component-image').removeClass('aesop-component-align-left aesop-component-align-center')

				} else if ( 'center' == value ) {

					component.find('.aesop-image-component-image').removeClass('aesop-component-align-left aesop-component-align-right')

				}

				component.find('.aesop-image-component-image').addClass('aesop-component-align-'+$(this).val()+' ')

			})
				settings.find('.aesop-image-captionposition > #aesop-generator-attr-captionposition').on('change',function(){

					var value = $(this).val();

					if ( 'left' == value ) {

						component.find('.aesop-image-component-image').removeClass('aesop-image-component-caption-right aesop-image-component-caption-center')

					} else if ( 'right' == value ) {

						component.find('.aesop-image-component-image').removeClass('aesop-image-component-caption-left aesop-image-component-caption-center')

					} else if ( 'center' == value ) {

						component.find('.aesop-image-component-image').removeClass('aesop-image-component-caption-left aesop-image-component-caption-right')

					}

					component.find('.lasso-image-component-image').addClass('lasso-image-component-caption-'+value+' ');
				});
				settings.find('.aesop-image-offset > #aesop-generator-attr-offset').on('keyup',function(){

					var value = $(this).val();

					if ( component.find('.aesop-image-component-image').hasClass('aesop-component-align-left') ) {

						component.find('.aesop-image-component-image').css('margin-left', $(this).val() );

					} else {

						component.find('.aesop-image-component-image').css('margin-right', $(this).val() );
					}

				});


			// CHARACTER LIVE EDIT ///////////////////
			settings.find('.aesop-character-name > #aesop-generator-attr-name').on('keyup',function(){
				component.find('.aesop-character-title').text( $(this).val() );
			})
			settings.find('.aesop-character-caption > #aesop-generator-attr-caption').on('keyup',function(){
				component.find('.aesop-character-cap').text( $(this).val() );
			})
			settings.find('.aesop-character-align > #aesop-generator-attr-align').on('change',function(){

				var value = $(this).val()

				if ( 'left' == value ) {

					component.removeClass('aesop-component-align-right aesop-component-align-center');

				} else if ( 'center' == value ) {

					component.removeClass('aesop-component-align-left aesop-component-align-right');

				}

				component.addClass('aesop-component-align-'+$(this).val()+' ');

			});

			// CHAPTER LIVE EDIT ///////////////////
			settings.find('.aesop-chapter-title > #aesop-generator-attr-title').on('keyup',function(){
				component.find('.aesop-cover-title span').text( $(this).val() );
			})
			settings.find('.aesop-chapter-subtitle > #aesop-generator-attr-subtitle').on('keyup',function(){
				component.find('.aesop-cover-title small').text( $(this).val() );
			})

			// VIDEO LIVE EDITOR /////////////////////
			//settings.find('.lasso-video-src > #aesop-generator-attr-src').live('change blur',function(){
			settings.find('.aesop-video-src > #aesop-generator-attr-src').on('change blur',function(){

				val = $(this).val()

				if ( 'vimeo' == val ) {

					component.find('iframe').attr('src', '//player.vimeo.com/video/'+val+' ')

					initVideoProvider( settings, component, 'vimeo' );

				} else if ( 'youtube' == val ) {

					component.find('iframe').attr('src', '//www.youtube.com/embed/'+val+'?rel=0&wmode=transparent')

					initVideoProvider( settings, component, 'youtube' );
				}

			});
			settings.find('.aesop-video-id > #aesop-generator-attr-id').on('keyup',function(){
				t = $('.aesop-video-src > #aesop-generator-attr-src').val();
				val = $(this).val();
				if ( 'vimeo' == t ) {
					component.find('iframe').attr('src', '//player.vimeo.com/video/'+val+' ')
				} else if ( 'youtube' == t ) {
					component.find('iframe').attr('src', '//www.youtube.com/embed/'+val+'?rel=0&wmode=transparent')
				}
			});
			settings.find('.aesop-video-width > #aesop-generator-attr-width').on('keyup',function(){
				component.find('.aesop-video-container').css('max-width', $(this).val() );
			});

			// CONTENT COMPONENT LIVE EDIT /////
			//settings.find('.lasso-content-background > #aesop-generator-attr-background').live('change',function(){
			settings.find('.lasso-content-background > #aesop-generator-attr-background').on('change',function(){
			  	component.find('.aesop-content-comp-wrap').css({'background-color': $(this).val()});
			});
				//settings.find('.lasso-content-color > #aesop-generator-attr-color').live('change',function(){
				settings.find('.aesop-content-color > #aesop-generator-attr-color').on('change',function(){
				  	component.find('.aesop-content-comp-wrap').css({'color': $(this).val()});
				});
				//settings.find('.lasso-content-height > #aesop-generator-attr-height').live('keyup',function(){
				settings.find('.aesop-content-height > #aesop-generator-attr-height').on('keyup',function(){

					val = $(this).val()

					component.find('.aesop-content-comp-wrap').css({'min-height': $(this).val()});

				});
				//settings.find('.lasso-content-columns > #aesop-generator-attr-columns').live('change',function(){
				settings.find('.aesop-content-columns > #aesop-generator-attr-columns').on('change',function(){

					val = $(this).val()

					if ( '1' == val ) {
						component.find('.aesop-content-comp-wrap').removeClass('aesop-content-comp-columns-2 aesop-content-comp-columns-3 aesop-content-comp-columns-4').addClass('aesop-content-comp-columns-1')
					} else if ( '2' == val ) {
						component.find('.aesop-content-comp-wrap').removeClass('aesop-content-comp-columns-1 aesop-content-comp-columns-3 aesop-content-comp-columns-4').addClass('aesop-content-comp-columns-2')
					} else if ( '3' == val ) {
						component.find('.aesop-content-comp-wrap').removeClass('aesop-content-comp-columns-1 aesop-content-comp-columns-2 aesop-content-comp-columns-4').addClass('aesop-content-comp-columns-3')
					} else if ( '4' == val ) {
						component.find('.aesop-content-comp-wrap').removeClass('aesop-content-comp-columns-1 aesop-content-comp-columns-2 aesop-content-comp-columns-3').addClass('aesop-content-comp-columns-4')
					}


				});
		});

		/**
		*
		*	Swap the video player with the correct id
		*	@param object the global settings for this component
		*	@param object the component we're editing
		*	@param type string the type of video (vimeo, youtube)
		*	@since 0.9.7
		*/
		function initVideoProvider( settings, component, type ){

			//settings.find('.lasso-video-id > #aesop-generator-attr-id').live('change',function(){
			settings.find('.lasso-video-id > #aesop-generator-attr-id').on('change',function(){

				video_id = $(this).val()

				if ( 'vimeo' == type ) {
					component.find('iframe').attr('src', '//player.vimeo.com/video/'+video_id+' ')
				} else if ( 'youtube' == type ) {
					component.find('iframe').attr('src', '//www.youtube.com/embed/'+video_id+'?rel=0&wmode=transparent')
				}

			})
		}


	});

})( jQuery );
