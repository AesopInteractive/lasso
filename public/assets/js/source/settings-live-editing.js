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
			settings.find('#lasso-generator-attr-background').live('change',function(){
			  	component.css({'background-color': $(this).val()});
			});
			settings.find('#lasso-generator-attr-text').live('change',function(){
			  	component.css({'color': $(this).val()});
			});
			settings.find('#lasso-generator-attr-quote').on('keyup',function(){
			  	component.find('blockquote span').text( $(this).val() );
			});
			settings.find('#lasso-generator-attr-cite').on('keyup',function(){

				var t = component.find('blockquote cite');

				if ( 0 == t.length ) {

					component.find('blockquote').append( '<cite class="aesop-quote-component-cite">'+$(this).val()+'</cite>' );

				} else {
			  		component.find('blockquote cite').text( $(this).val() );
				}
			});
			settings.find('.lasso-quote-width > #lasso-generator-attr-width').on('keyup',function(){
				component.css('width', $(this).val() );
			})
			settings.find('.lasso-quote-type #lasso-generator-attr-type').on('change',function(){

				var value = $(this).val()

				if ( 'pull' == value ) {
					component.css('background-color','transparent')
				}

				component.removeClass('aesop-quote-type-block aesop-quote-type-pull')

				component.addClass('aesop-quote-type-'+$(this).val()+' ')
			});

			settings.find('.lasso-quote-align #lasso-generator-attr-align').on('change',function(){

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
			settings.find('.lasso-parallax-caption > #lasso-generator-attr-caption').on('keyup',function(){


				var t = component.find('.aesop-parallax-sc-caption-wrap')

				if ( 0 == t.length ) {

					component.find('img').after( '<figcaption class="aesop-parallax-sc-caption-wrap bottom-left">'+$(this).val()+'</figcaption>' );

				} else {
			  		component.find('.aesop-parallax-sc-caption-wrap').text( $(this).val() );
				}
			})
			settings.find('.lasso-parallax-captionposition > #lasso-generator-attr-captionposition').on('change',function(){

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
			settings.find('.lasso-image-caption > #lasso-generator-attr-caption').on('keyup',function(){

				var t = component.find('.aesop-image-component-caption');

				if ( 0 == t.length ) {

					component.find('img').after( '<p class="aesop-image-component-caption">'+$(this).val()+'</p>' );

				} else {
					component.find('.aesop-image-component-caption').text( $(this).val() );
				}

			})
			settings.find('.lasso-image-imgwidth > #lasso-generator-attr-imgwidth').on('keyup',function(){
				component.find('.aesop-image-component-image').css('max-width', $(this).val() );
			})
			settings.find('.lasso-image-align > #lasso-generator-attr-align').on('change',function(){

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
				settings.find('.lasso-image-captionposition > #lasso-generator-attr-captionposition').on('change',function(){

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
				settings.find('.lasso-image-offset > #lasso-generator-attr-offset').on('keyup',function(){

					var value = $(this).val();

					if ( component.find('.aesop-image-component-image').hasClass('aesop-component-align-left') ) {

						component.find('.aesop-image-component-image').css('margin-left', $(this).val() );

					} else {

						component.find('.aesop-image-component-image').css('margin-right', $(this).val() );
					}

				});


			// CHARACTER LIVE EDIT ///////////////////
			settings.find('.lasso-character-name > #lasso-generator-attr-name').on('keyup',function(){
				component.find('.aesop-character-title').text( $(this).val() );
			})
			settings.find('.lasso-character-caption > #lasso-generator-attr-caption').on('keyup',function(){
				component.find('.aesop-character-cap').text( $(this).val() );
			})
			settings.find('.lasso-character-align > #lasso-generator-attr-align').on('change',function(){

				var value = $(this).val()

				if ( 'left' == value ) {

					component.removeClass('aesop-component-align-right aesop-component-align-center');

				} else if ( 'center' == value ) {

					component.removeClass('aesop-component-align-left aesop-component-align-right');

				}

				component.addClass('aesop-component-align-'+$(this).val()+' ');

			});

			// CHAPTER LIVE EDIT ///////////////////
			settings.find('.lasso-chapter-title > #lasso-generator-attr-title').on('keyup',function(){
				component.find('.aesop-cover-title span').text( $(this).val() );
			})
			settings.find('.lasso-chapter-subtitle > #lasso-generator-attr-subtitle').on('keyup',function(){
				component.find('.aesop-cover-title small').text( $(this).val() );
			})

			// VIDEO LIVE EDITOR /////////////////////
			settings.find('.lasso-video-src > #lasso-generator-attr-src').live('change blur',function(){

				val = $(this).val()

				if ( 'vimeo' == val ) {
					component.find('iframe').attr('src', '//player.vimeo.com/video/'+val+' ')
				} else if ( 'youtube' == val ) {
					component.find('iframe').attr('src', '//www.youtube.com/embed/'+val+'?rel=0&wmode=transparent')
				}

			})
				settings.find('.lasso-video-width > #lasso-generator-attr-width').on('keyup',function(){
					component.find('.aesop-video-container').css('max-width', $(this).val() );
				})

			// CONTENT COMPONENT LIVE EDIT /////
			settings.find('.lasso-content-background > #lasso-generator-attr-background').live('change',function(){
			  	component.find('.aesop-content-comp-wrap').css({'background-color': $(this).val()});
			});
				settings.find('.lasso-content-color > #lasso-generator-attr-color').live('change',function(){
				  	component.find('.aesop-content-comp-wrap').css({'color': $(this).val()});
				});
				settings.find('.lasso-content-height > #lasso-generator-attr-height').live('keyup',function(){

					val = $(this).val()

					component.find('.aesop-content-comp-wrap').css({'min-height': $(this).val()});

				});
				settings.find('.lasso-content-columns > #lasso-generator-attr-columns').live('change',function(){

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


	});

})( jQuery );
