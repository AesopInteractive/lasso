(function( $ ) {

	$(document).ready(function(){

		//$("[class*='wp-image-']").each(function() {

			// get the attachment id from teh class wp-image-XXX, where XXX is the id of the attached iamge
			// this oly works if the image was inserted from within the wordpress post editor
			var ase_edit_frame;
			var className;

			$(document).on('click', '#lasso--wpimg-edit',function(e){

  				e.preventDefault()
  				var selected_img
  				, 	clicked = $(this)
  				, 	id 		= $(this).parent().next('img').attr('class').match(/\d+/);

			    className = e.currentTarget.parentElement.className;

			    // Create the media frame.
			    ase_edit_frame = wp.media.frames.ase_edit_frame = wp.media({
			      	title: lasso_editor.strings.selectImage,
			      	button: {
			        	text: lasso_editor.strings.insertImage,
			      	},
			      	multiple: false  // Set to true to allow multiple files to be selected
			    });

				ase_edit_frame.on('open',function(){
					var selection = ase_edit_frame.state().get('selection');
					var attachment = wp.media.attachment( id );
					attachment.fetch();
					selection.add( attachment ? [ attachment ] : [] );
				});

			    // When an image is selected update it
			    ase_edit_frame.on( 'select', function() {


			      	var attachment = ase_edit_frame.state().get('selection').first().toJSON();

			      	$(clicked).parent().next('img').attr({
			      		'src': attachment.sizes.large.url,
			      		'alt': attachment.alt,
			      		'class': 'aligncenter size-large wp-image-'+attachment.id+''
			      	})


			    });

			    // Finally, open the modal
			    ase_edit_frame.open();

			})

		//});

	});

})( jQuery );