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
			if ($(e.target).hasClass('tagit') ||  $(e.target).hasClass('story-categories-option')) {
				// close the modal window if the user clicks on empty spaces
				// destroy posts modal
				
				destroyModal();
			}			
		});

		// modal click
		//$('#lasso--post-settings').live('click',function(e){
		jQuery(document).on('click','#lasso--post-settings',function(e){

			e.preventDefault();

			// add a body class
			$('body').toggleClass('lasso-modal-open');

			// append teh modal markup ( lasso_editor_component_modal() )
			$('body').append(lasso_editor.component_modal);

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
		    $('#lasso--slider').slider({
		      	value:statusReturn(lasso_editor.post_status),
		      	min: 100,
		      	max: 200,
		      	step: 100,
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

		    // if any changes happen then show the footer
		    $('.lasso--modal__trigger-footer').on('keyup',function(){
			  	$('.lasso--postsettings__footer').slideDown()
			});

		    // categories
		    var cats = $('#lasso--cat-select')
		    ,	tags = $('#lasso--tag-select')

			cats.tagit({
				//fieldName:'itemName[fieldName][]',
				placeholderText: 'add categories...',
				availableTags: lasso_editor.postCategories
			});

			cats.on('change',function(event){
				$('.lasso--postsettings__footer').slideDown()
			})

			tags.tagit({
				//fieldName:'itemName[fieldName][]',
				placeholderText: 'add tags...',
				availableTags: lasso_editor.postTags
			});

			tags.on('change',function(event){
				$('.lasso--postsettings__footer').slideDown()
			})
			
			if( $('.editus_custom_date').length ) {
				$('.editus_custom_date').datepicker({});
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
		jQuery(document).on('submit','#lasso--postsettings__form',function(e) {

			e.preventDefault();

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

			$(this).find('input[type="submit"]').val(lasso_editor.strings.saving);

			var data = $this.serialize();

			/////////////
			//	DO TEH SAVE
			/////////////
			$.post( lasso_editor.ajaxurl, data, function(response) {

				console.log(response)

				if( true == response.success ) {

					$('input[type="submit"]').addClass('saved');
					$('input[type="submit"]').val(lasso_editor.strings.saved);
					location.reload();

					window.location.replace(lasso_editor.permalink);

				} else {

					alert('error');

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