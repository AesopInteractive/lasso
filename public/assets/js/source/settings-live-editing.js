(function( $ ) {

	$(document).ready(function(){

		/////////////
		// LIVE EDITING COMPONENTS
		// @todo - this is hella dirty and needs to be cleaned up
		// @todo - move this mess to it's own file
		////////////

		$('#aesop-component--settings__trigger').live('click', function(){

			var settings 	= $('#aesop-editor--component__settings')

			// QUOTE LIVE EDIT ///////////////////
			settings.find('#aesop-generator-attr-background').live('change',function(){
			  	component.css({'background-color': $(this).val()});
			});
			settings.find('#aesop-generator-attr-text').live('change',function(){
			  	component.css({'color': $(this).val()});
			});
			settings.find('#aesop-generator-attr-quote').on('keyup',function(){
			  	component.find('blockquote span').text( $(this).val() );
			});
			settings.find('#aesop-generator-attr-cite').on('keyup',function(){
			  	component.find('blockquote cite').text( $(this).val() );
			});

			// PARALLAX LIVE EDIT ///////////////////
			settings.find('.aesop-parallax-caption > #aesop-generator-attr-caption').on('keyup',function(){
				component.find('.aesop-parallax-sc-caption-wrap').text( $(this).val() );
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
				component.find('.aesop-image-component-caption').text( $(this).val() );
			})
			settings.find('.aesop-option.aesop-image-imgwidth > #aesop-generator-attr-imgwidth').on('keyup',function(){
				component.find('.aesop-image-component-image').css('width', $(this).val() );
			})
			settings.find('.aesop-option.aesop-image-align > #aesop-generator-attr-align').on('change',function(){

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
			settings.find('.aesop-option.aesop-image-captionposition > #aesop-generator-attr-captionposition').on('change',function(){

				var value = $(this).val();

				if ( 'left' == value ) {

					component.find('.aesop-image-component-image').removeClass('aesop-image-component-caption-right aesop-image-component-caption-center')

				} else if ( 'right' == value ) {

					component.find('.aesop-image-component-image').removeClass('aesop-image-component-caption-left aesop-image-component-caption-center')

				} else if ( 'center' == value ) {

					component.find('.aesop-image-component-image').removeClass('aesop-image-component-caption-left aesop-image-component-caption-right')

				}

				component.find('.aesop-image-component-image').addClass('aesop-image-component-caption-'+value+' ');
			});

			// CHARACTER LIVE EDIT ///////////////////
			settings.find('.aesop-character-name > #aesop-generator-attr-name').on('keyup',function(){
				component.find('.aesop-character-title').text( $(this).val() );
			})
			settings.find('.aesop-character-caption > #aesop-generator-attr-caption').on('keyup',function(){
				component.find('.aesop-character-cap').text( $(this).val() );
			})
			settings.find('.aesop-option.aesop-character-align > #aesop-generator-attr-align').on('change',function(){

				var value = $(this).val()

				if ( 'left' == value ) {

					component.removeClass('aesop-component-align-right aesop-component-align-center');

				} else if ( 'center' == value ) {

					component.removeClass('aesop-component-align-left aesop-component-align-right');

				}

				component.addClass('aesop-component-align-'+$(this).val()+' ');

			});

			// CHAPTER LIVE EDIT ///////////////////
			settings.find('.aesop-option.aesop-chapter-title > #aesop-generator-attr-title').on('keyup',function(){
				component.find('.aesop-cover-title span').text( $(this).val() );
			})
			settings.find('.aesop-option.aesop-chapter-subtitle > #aesop-generator-attr-subtitle').on('keyup',function(){
				component.find('.aesop-cover-title small').text( $(this).val() );
			})

		});

	});

})( jQuery );
