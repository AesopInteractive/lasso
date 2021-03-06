(function( $ ) {

	$(document).ready(function(){

		/////////////////
		/// MODAL LOGIC
		///////////////////

		// method to destroy the modal
		var destroyModal = function(){
			$('body').removeClass('lasso-modal-open');
			$('#lasso--post-settings__modal, #lasso--modal__overlay').remove();
		}
		
		jQuery(document).on('click', '.lasso--postsettings__option', function(e){
			if ($(e.target).hasClass('tagit')) {
				// close the modal window if the user clicks on empty spaces
				// destroy posts modal
				
				destroyModal();
			}			
		});

		// modal click
		//$('#lasso--post-settings').live('click',function(e){
		jQuery(document).on('click','#lasso--post-settings, #lasso--post-settings2',function(e){

			e.preventDefault();

			// add a body class
			$('body').toggleClass('lasso-modal-open');

			// append teh modal markup ( lasso_editor_component_modal() )
			$('body').append(lasso_editor.component_modal);

			/////////////////
			/// UI SLIDER INIT AND METHODS
			///////////////////

			var statusReturn = function( value ) {

				var out;
				if ( 100 == value ) {
					out = 'draft';
				} else if ( 150 == value ) {
					out = 'pending';
				} else if ( 200 == value ) {
					out = 'publish';
				} else if ( 'draft' == value ) {
					out = 100;
				} else if ( 'pending' == value ) {
					out = 150;
				} else if ( 'publish' == value ) {
					out = 200;
				}
				return out;
			}

			// init slider
		    $('#lasso--slider').slider({
		      	value:statusReturn(lasso_editor.post_status),
		      	min: 100,
		      	max: 200,
		      	step: lasso_editor.supportPendingStatus ? 50 : 100,
		      	animate:'fast',
		      	slide: function( event, ui ) {
		        	$('input[name="status"]').val( statusReturn(ui.value) );

		        	$('.lasso--postsettings__footer').slideDown()

		        	if ( 100 == ui.value ) {
		        		$('.story-status').removeClass('story-status-publish').addClass('story-status-draft')
		        	} else if ( 200 == ui.value ) {
		        		$('.story-status').removeClass('story-status-draft').addClass('story-status-publish')
		        	}
		      	}
		    });
		    $('input[name="status"]').val( statusReturn( $( "#lasso--slider" ).slider('value') ) );

		    /*// if any changes happen then show the footer
		    $('.lasso--modal__trigger-footer').on('keyup',function(){
			  	$('.lasso--postsettings__footer').slideDown()
			});*/

		    // categories
		    var cats = $('#lasso--cat-select')
		    ,	tags = $('#lasso--tag-select')
            ,   custom = $('#lasso--custom-taxo-input')

			cats.tagit({
				//fieldName:'itemName[fieldName][]',
				placeholderText: lasso_editor.strings.catsPlaceholder, //'add categories...',
				availableTags: lasso_editor.postCategories,
                allowSpaces: true
			});

			cats.on('change',function(event){
				$('.lasso--postsettings__footer').slideDown()
			})

			tags.tagit({
				//fieldName:'itemName[fieldName][]',
				placeholderText: lasso_editor.strings.tagsPlaceholder,//'add tags...',
				availableTags: lasso_editor.postTags,
                allowSpaces: true
			});

			tags.on('change',function(event){
				$('.lasso--postsettings__footer').slideDown()
			})
			
			if( $('.editus_custom_date').length ) {
				$('.editus_custom_date').datepicker({});
			}
            
            if (lasso_editor.supCustTaxo) {           
                var selTaxo = $('#lasso--custom-taxo-select').val();
                custom.val(lasso_editor.postCusTaxonomies[selTaxo]);
                custom.tagit({
                    placeholderText: lasso_editor.strings.catsPlaceholder,//'add tags...',
                    availableTags: lasso_editor.extCusTaxonomies[selTaxo],
                    allowSpaces: true
                });
                              
                $('#lasso--custom-taxo-select').on('change', function() {
                    lasso_editor.postCusTaxonomies[selTaxo] = custom.val();
                    
                    custom.tagit("destroy");
                    custom.val(lasso_editor.postCusTaxonomies[$(this).val()]);
                    custom.tagit({
                        placeholderText: lasso_editor.strings.taxoPlaceholder, //'add categories...',
                        availableTags: lasso_editor.extCusTaxonomies[$(this).val()],
                        allowSpaces: true
                    });
                                   
                    selTaxo = $(this).val();
                });
            }

			modalResizer()

		});

		// destroy modal if clicking close or overlay
		//$('#lasso--modal__close, #lasso--modal__overlay, .lasso--postsettings-cancel').live('click',function(e){
		jQuery(document).on('click', '#lasso--modal__close, #lasso--modal__overlay, .lasso--postsettings-cancel', function(e){
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

		//$('#lasso--postsettings__form').live('submit', function(e) {
				//$('#lasso--postsettings__form').live('submit', function(e) {
		jQuery(document).on('submit','#lasso--postsettings__form',function(e) {

			e.preventDefault();
			if ($('#lasso--custom-field-form').length ==0 || $('#lasso--custom-field-form').children().length == 0 ) {
                $('#lasso--save').removeClass('lasso-publish-post');
				$('#lasso--save').trigger('click');
			}

			var $this = $(this);
			
			/*
			//alternate way of setting categories, disabled for now
			var cats = [];
			
			$('input[name="categories"]').each(function () {
				if (this.checked) { cats.push(this.id);}
			});
			if (cats.length>0) {
				$('input[name="story_cats"]').val(cats.join(','));
			}*/
            
            if (lasso_editor.supCustTaxo) {          
                var selTaxo = $('#lasso--custom-taxo-select').val();
                lasso_editor.postCusTaxonomies[selTaxo] = $('#lasso--custom-taxo-input').val();
                $(this).find("input[name=story_custom_taxonomies]" ).val(JSON.stringify(lasso_editor.postCusTaxonomies));
            }

			$(this).find('input[type="submit"]').val(lasso_editor.strings.saving);

			
			var data2 = $this.serialize();

			/////////////
			//	DO THE SAVE
			/////////////
				
			var data = {
				action: 'editus_set_post_setting',
			    postid: lasso_editor.postid,
				data: data2
			};
				
			$.post( lasso_editor.ajaxurl2, data, function(response) {

				if( true == response.success ) {
					$('input[type="submit"]').addClass('saved');
					$('input[type="submit"]').val(lasso_editor.strings.saved);
                    window.onbeforeunload = null;
					
					if ($('#lasso--custom-field-form').length && $('#lasso--custom-field-form').children().length) {
						$('#lasso--custom-field-form').trigger('submit');
						setTimeout(function() {
						  window.location.replace(response.data['link']);
						}, 1000);
					} else {
                        // changing the setting can potentially change the URL of the post. In that case we need to
                         // reload the post
					    window.location.replace(response.data['link']);
					}

				} else {
					alert('error:'+response);
					console.log(response)

				}


			}).fail(function(xhr, err) { 
				var responseTitle= $(xhr.responseText).filter('title').get(0);
				alert($(responseTitle).text() + "\n" + EditusFormatAJAXErrorMessage(xhr, err) );
			});

		});

		/////////////
		// ADDON TABS
		//////////////
		$(document).on('click', '.lasso--modal__tabs li', function(e){

			e.preventDefault()

			var $this	= $(this)
			,	name  	= $this.data('addon-name')
			,	rem 	= 'not-visible'
			,	add    	= 'visible'

			$('.lasso--modal__tabs li').removeClass('active-tab')

			$this.addClass('active-tab')

			$('.lasso--modal__content').removeClass( add ).addClass( rem )

			$this.closest('.lasso--modal__inner').find('div[data-addon-content="'+name+'"]').removeClass( rem ).addClass( add )

			modalResizer()
		})

	});

})( jQuery );