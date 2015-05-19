jQuery(document).ready(function($){

	var ajaxurl 	=  lasso_editor.ajaxurl,
		save    	=  $('.lasso--controls__right a'),
		editor 		=  lasso_editor.editor,
		postid 		=  lasso_editor.postid,
		oldHtml 	=  $('#'+editor).html(),
		warnNoSave 	=  'You have unsaved changes!';

	///////////////////////
	// 1. IF UNSAVED CHANGES STORE IN LOCAL STORAGE
	// @todo - need to account for component on the page this only accounts for text
	///////////////////////
	$('#'+editor).live('change',function(){

		var $this = $(this),
			newHtml = $this.html();

		if ( oldHtml !== newHtml ) {

			localStorage.setItem( 'lasso_backup_'+postid , newHtml );
		}

	});

	///////////////////////
	// 2. WARN THE USER IF THEY TRY TO NAVIGATE AWAY WITH UNSAVED CHANGES
	///////////////////////
	window.onbeforeunload = function () {

		if ( localStorage.getItem( 'lasso_backup_'+postid ) && lasso_editor.userCanEdit ) {
        	return warnNoSave;
        	$('#lasso--save').css('opacity',1);
        }
    }

	///////////////////////
	// 3. SAVE OR PUBLISH OBJECT
	///////////////////////
	$('.lasso--controls__right a:not(#lasso--exit)').live('click',function(e) {

		var warnNoSave = null;

		e.preventDefault();

		// sore reference to this
		var $this = $(this);

		// unwrap wp images
		$(".lasso--wpimg__wrap").each(function(){

			if ( !$(this).hasClass('wp-caption') ) {

				$(this).children().unwrap()

			}

			$('.lasso-component--controls').remove();
		});

		// unwrap custom components
		$('.lasso-component').each(function(){
			$('.lasso-component--controls').remove();
		});

		// unwrap map from hits drag holder
		$('#lasso--map-form').each(function(){

			var $this = $(this)

			$this.find('.lasso-component--controls, .lasso--map-form__footer ').remove()

			$this.children().unwrap()
		});

		// if tehre are any scrollnav sections we need to break them open so the editor doesnt save the html
		$('.scroll-nav__section').each(function(){
			$(this).children().unwrap();
		})

		// get the html from our div
		var html = $('#'+editor).html(),
			postid = $this.closest('#lasso--controls').data('post-id');

		// let user know someting is happening on click
		$(this).addClass('being-saved');

		// gather the data
		var data      = {
			action:    	$this.hasClass('lasso-publish-post') ? 'process_save_publish-content' : 'process_save_content',
			author:  	lasso_editor.author,
			content: 	$this.hasClass('shortcodify-enabled') ? shortcodify(html) : html,
			post_id:   	postid,
			nonce:     	lasso_editor.nonce
		};

		// intercept if publish to confirm
		if ( $this.hasClass('lasso-publish-post') ) {
			swal({
				title: lasso_editor.strings.publishPost,
				type: "info",
				text: false,
				showCancelButton: true,
				confirmButtonColor: "#5bc0de",
				confirmButtonText: lasso_editor.strings.publishYes,
				closeOnConfirm: true
			},
			function(){

				if ( lasso_editor.can_publish_posts ) {

					runSavePublish()

				}

			});

		} else {

			if ( lasso_editor.can_publish_posts ) {

				runSavePublish()

			}

		}

		/**
		 	* Turn content html into shortcodes
		 	* @param  {[type]} content  [description]
		 	* @param  {[type]} selector [description]
		 	* @return {[type]}          [description]
		*/
		function shortcodify(content,selector){

			// Convert the html into a series of jQuery objects
			var j = $(content);
			var processed = '';

			// Iterate through the array of dom objects
			for (var i = 0; i < j.length; i++) {

	    		var component = $(j[i]);

	    		// If it's not a component, move along
	    		if ( !component.hasClass('aesop-component') ) {

	    			// Let's test what kind of object it is
	    			if ( component.context.nodeType == 3 ) {
	    				// Text only object without dom
	    				processed += j[i].data;
	    			} else {
	    				// DOM object
	    				processed += j[i].outerHTML;
	    			}
	    			continue;
	    		}

	    		var data = component.data();
	    		var params = '';

	    		// It's a component, let's check to make sure it's defined properly
				if ( data.hasOwnProperty('componentType') ) {

					for ( var index in data ) {

						// Don't accept componentType as a param
						if ( !data.hasOwnProperty(index) || index == 'componentType' ) {
							continue;
						}

						// Build the params string out of the data attributes
						params += " " + index + '="' + data[index] + '"';

					}

					var sc = '[aesop_' + data.componentType + params + ']';

					// Let's check to see if it's a "full" shortcode
					var inner = component.find('.aesop-component-content-data');

					if ( inner.length != 0 ) {
						sc += inner[0].innerHTML + "[/aesop_" + data.componentType + "]";
					}

					processed += sc;

				}

			}

			return processed;

		}

		// make the actual ajax call to save or publish
		function runSavePublish(){
			$.post( ajaxurl, data, function(response) {

				if( true == response.success ) {

					// change button class to saved
					$(save).removeClass('being-saved').addClass('lasso--saved');

					// if this is being published then remove the publish button afterwards
					if ( $this.hasClass('lasso-publish-post') ) {
						$this.remove();
					}

					// wait a bit then remvoe the button class so they can save again
					setTimeout(function(){
						$(save).removeClass('lasso--saved');

						if ( $this.hasClass('lasso-publish-post') ) {
							location.reload()
						}

					},1200);

					// then remove this copy from local stoarge
					localStorage.removeItem( 'lasso_backup_'+postid );

				} else {

					// testing
					//console.log(response);
					$(save).removeClass('being-saved').addClass('lasso--error');
				}

			});
		}

	});
});
