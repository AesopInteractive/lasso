(function( $ ) {

	$(document).ready(function(){

		/////////////
		// LIVE EDITING COMPONENTS
		// @todo - this is hella dirty and needs to be cleaned up
		// @todo - move this mess to it's own file
		////////////

		$('#lasso-component--settings__trigger').live('click', function(){

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
			  	component.find('blockquote cite').text( $(this).val() );
			});

			// PARALLAX LIVE EDIT ///////////////////
			settings.find('.lasso-parallax-caption > #lasso-generator-attr-caption').on('keyup',function(){
				component.find('.lasso-parallax-sc-caption-wrap').text( $(this).val() );
			})
			settings.find('.lasso-parallax-captionposition > #lasso-generator-attr-captionposition').on('change',function(){

				var value = $(this).val()

				if ( 'bottom-left' == value ) {

					component.find('.lasso-parallax-sc-caption-wrap').removeClass('bottom-right top-left top-right')

				} else if ( 'bottom-right' == value ) {

					component.find('.lasso-parallax-sc-caption-wrap').removeClass('bottom-left top-left top-right')

				} else if ( 'top-left' == value ) {

					component.find('.lasso-parallax-sc-caption-wrap').removeClass('bottom-right top-right bottom-left')

				} else if ( 'top-right' == value ) {

					component.find('.lasso-parallax-sc-caption-wrap').removeClass('bottom-right bottom-left top-left')

				}

				component.find('.lasso-parallax-sc-caption-wrap').addClass( value );

			})

			// IMAGE LIVE EDIT ///////////////////
			settings.find('.lasso-image-caption > #lasso-generator-attr-caption').on('keyup',function(){
				component.find('.lasso-image-component-caption').text( $(this).val() );
			})
			settings.find('.lasso-option.lasso-image-imgwidth > #lasso-generator-attr-imgwidth').on('keyup',function(){
				component.find('.lasso-image-component-image').css('width', $(this).val() );
			})
			settings.find('.lasso-option.lasso-image-align > #lasso-generator-attr-align').on('change',function(){

				var value = $(this).val()

				if ( 'left' == value ) {

					component.find('.lasso-image-component-image').removeClass('lasso-component-align-right lasso-component-align-center')

				} else if ( 'right' == value ) {

					component.find('.lasso-image-component-image').removeClass('lasso-component-align-left lasso-component-align-center')

				} else if ( 'center' == value ) {

					component.find('.lasso-image-component-image').removeClass('lasso-component-align-left lasso-component-align-right')

				}

				component.find('.lasso-image-component-image').addClass('lasso-component-align-'+$(this).val()+' ')

			})
			settings.find('.lasso-option.lasso-image-captionposition > #lasso-generator-attr-captionposition').on('change',function(){

				var value = $(this).val();

				if ( 'left' == value ) {

					component.find('.lasso-image-component-image').removeClass('lasso-image-component-caption-right lasso-image-component-caption-center')

				} else if ( 'right' == value ) {

					component.find('.lasso-image-component-image').removeClass('lasso-image-component-caption-left lasso-image-component-caption-center')

				} else if ( 'center' == value ) {

					component.find('.lasso-image-component-image').removeClass('lasso-image-component-caption-left lasso-image-component-caption-right')

				}

				component.find('.lasso-image-component-image').addClass('lasso-image-component-caption-'+value+' ');
			});

			// CHARACTER LIVE EDIT ///////////////////
			settings.find('.lasso-character-name > #lasso-generator-attr-name').on('keyup',function(){
				component.find('.lasso-character-title').text( $(this).val() );
			})
			settings.find('.lasso-character-caption > #lasso-generator-attr-caption').on('keyup',function(){
				component.find('.lasso-character-cap').text( $(this).val() );
			})
			settings.find('.lasso-option.lasso-character-align > #lasso-generator-attr-align').on('change',function(){

				var value = $(this).val()

				if ( 'left' == value ) {

					component.removeClass('lasso-component-align-right lasso-component-align-center');

				} else if ( 'center' == value ) {

					component.removeClass('lasso-component-align-left lasso-component-align-right');

				}

				component.addClass('lasso-component-align-'+$(this).val()+' ');

			});

			// CHAPTER LIVE EDIT ///////////////////
			settings.find('.lasso-option.lasso-chapter-title > #lasso-generator-attr-title').on('keyup',function(){
				component.find('.lasso-cover-title span').text( $(this).val() );
			})
			settings.find('.lasso-option.lasso-chapter-subtitle > #lasso-generator-attr-subtitle').on('keyup',function(){
				component.find('.lasso-cover-title small').text( $(this).val() );
			})

		});

	});

})( jQuery );
