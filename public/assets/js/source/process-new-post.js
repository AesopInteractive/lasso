(function( $ ) {

	$(document).ready(function(){

		// method to destroy the modal
		var destroyModal = function(){
			$('body').removeClass('lasso-modal-open' );
			$('.lasso--modal, #lasso--modal__overlay').remove();
			if (noWarningReload) {
				location.reload();
			}
		}

		// modal click
		//$('#lasso--post-new').live('click',function(e){
		jQuery(document).on('click','#lasso--post-new',function(e){

			e.preventDefault();

			// add a body class
			$('body').toggleClass('lasso-modal-open');

			// append teh modal markup ( lasso_editor_component_modal() )
			$('body').append(lasso_editor.newPostModal);

		    // if any changes happen then show the footer
		    $('.lasso--modal__trigger-footer').on('keyup',function(){
			  	$('.lasso--postsettings__footer').slideDown()
			});

			modalResizer()

		});

		// destroy modal if clicking close or overlay
		//$('#lasso--modal__close, #lasso--modal__overlay, .lasso--postsettings-cancel').live('click',function(e){
		jQuery(document).on('click','#lasso--modal__close, #lasso--modal__overlay, .lasso--postsettings-cancel',function(e){
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
		// MAKE NEW POST OBJECT
		//////////////
		var form;

		//$('#lasso--postnew__form').live('submit', function(e) {
		jQuery(document).on('submit', '#lasso--postnew__form', function(e){

			e.preventDefault();

			var $this = $(this);

			$(this).find('input[type="submit"]').val(lasso_editor.strings.adding);

			
			if (lasso_editor.saveusingrest) {
                // Use REST API 
				var data2 = $this.serializeArray().reduce(function(obj, item) {
					obj[item.name] = item.value;
					return obj;
				}, {});
				newPostREST(data2.story_title, data2.object,lasso_editor.newObjectContent);
			} else {
				var data = $this.serialize();
				/////////////
				//	DO TEH SAVE
				/////////////
				$.post( lasso_editor.ajaxurl, data, function(response) {
					if ( true == response.success ) {
						$('input[type="submit"]').addClass('saved');
						$('input[type="submit"]').val(lasso_editor.strings.added);
						window.location.replace(response.data.postlink);
					} else {
						alert('error');
					}
				});
			}

		});

	});
	
	function newPostREST(title_, type_,content_){
		var data      = {
			title: title_,
			content: 	content_, 
			status: "draft"
		};
		
		var type;
		if (type_=="post") {
			type = "posts";
		} else if (type_=="page"){
			type = "pages";
		} else {
			type = type_;
		}
			
		$.ajax({
			method: "POST",
			url: lasso_editor.rest_root + 'wp/v2/'+type,
			data: data,
			beforeSend: function ( xhr ) {
				xhr.setRequestHeader( 'X-WP-Nonce', lasso_editor.rest_nonce );
			},
			success : function( response ) {
				$('input[type="submit"]').addClass('saved');
				$('input[type="submit"]').val(lasso_editor.strings.added);

				window.location.replace(response.link);
			},
			error : function (xhr, exception) {
				alert("AJAX Error: "+xhr.responseText );		
			}
		});
	}

	/////////////
	// POST OBJECT CHANGE - since 0.9.5
	/////////////
	//$('#lasso--select-type').live('change',function() {
	jQuery(document).on('change', '#lasso--select-type', function(){

		var val = $(this).val()

		$('input[name="object"]').val( val )

		$(this).closest('.story-slug-option').find('label span:not(.lasso-util--help)').text( val )
	});

})( jQuery );
