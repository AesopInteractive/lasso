jQuery(document).ready(function($){

	var ajaxurl 	=  aesop_editor.ajaxurl,
		save    	=  $('.aesop-editor--controls__right a'),
		editor 		=  aesop_editor.editor,
		postid 		=  aesop_editor.postid,
		oldHtml 	=  $('#'+editor).html(),
		warnNoSave 	=  'You have unsaved changes!';

	// if unsaved changes store in local storage
	$('#'+editor).live('change',function(){

		var $this = $(this),
			newHtml = $this.html();

		if ( oldHtml !== newHtml ) {

			localStorage.setItem( 'aesop_backup_'+postid , newHtml );

			//$('#aesop-editor--save').css('opacity',1);
		}

	});

	if ( localStorage.getItem( 'aesop_backup_'+postid ) ) {

    $('#aesop-editor--save').css('opacity',1);

  }

	// if the user tries to navigate away and this post was backed up and not saved warn them
	window.onbeforeunload = function () {

		if ( localStorage.getItem( 'aesop_backup_'+postid ) ) {
        	return warnNoSave;
        	$('#aesop-editor--save').css('opacity',1);
        }
    }

	// do the actual saving
	$(save).live('click',function(e) {

		var warnNoSave = null;

		e.preventDefault();

		// sore reference to this
		var $this = $(this);

		////////////
		/// DO THE SAVE
		////////////
		// get the html from our div
		var html = $('#'+editor).html(),
			postid = $this.closest('#aesop-editor--controls').data('post-id');

		// remove controls
		// @todo - worry about saving later this is shit hack
	  $('.aesop-component--controls').remove();

		// let user know someting is happening on click
		$(this).addClass('being-saved');

		var data      = {
			action:    	$this.hasClass('aesop-publish-post') ? 'process_publish_content' : 'process_save_content',
			author:  		aesop_editor.author,
			content: 		shortcodify(html),
			post_id:   	postid,
			nonce:     	aesop_editor.nonce
		};

		/**
		 * Turn content html into shortcodes
		 * @param  {[type]} content  [description]
		 * @param  {[type]} selector [description]
		 * @return {[type]}          [description]
		 */
		function shortcodify(content,selector){

			var j = $(content);
			var processed = '';

			for (var i = 0; i < j.length; i++) {

    		var component = $(j[i]);
    		var data = component.data();
    		var params = '';

    		// If it's not a component, move along
    		if ( !component.hasClass('aesop-component') ) {
    			processed += j[i].outerHTML;
    			continue;
    		}

    		// It's a component, let's check to make sure it's defined properly
				if ( data.hasOwnProperty('componentType') ) {

					for (var index in data) {

						// Don't accept componentType as a param
						if (!data.hasOwnProperty(index) || index == 'componentType') {
							continue;
						}

						// Build the params string out of the data attributes
						params += " " + index + '="' + data[index] + '"';

					}

					var sc = '[aesop-' + data.componentType + params + ']';

					processed += sc;

				}

			}

			return processed;

		}

		// post ajax response with data
		$.post( ajaxurl, data, function(response) {

			if ( 'success' == response ) {

				$(save).removeClass('being-saved').addClass('aesop-editor--saved');

				setTimeout(function(){
					$(save).removeClass('aesop-editor--saved');
				},1200);

				// purge this post from local storage
				localStorage.removeItem( 'aesop_backup_'+postid );

			} else {

				// testing
				console.log(response);
				$(save).removeClass('being-saved').addClass('aesop-editor--error');
			}

		});

	});
});