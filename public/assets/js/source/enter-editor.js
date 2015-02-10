jQuery(document).ready(function($){

	var editor 			= lasso_editor.editor,
		post_container  = lasso_editor.article_object,
		toolbar 		= lasso_editor.toolbar,
		panel           = lasso_editor.component_sidebar,
		postid          = lasso_editor.postid,
		modal 			= lasso_editor.component_modal,
		components 		= lasso_editor.components,
		featImgClass   	= lasso_editor.featImgClass,
		featImgNonce    = lasso_editor.featImgNonce,
		titleClass      = lasso_editor.titleClass,
		uploadControls  = lasso_editor.featImgControls,
		wpImgEdit 		= lasso_editor.wpImgEdit,
		lassoDragHandle = lasso_editor.handle,
		lassoMapForm 	= lasso_editor.mapFormFooter,
		mapLocations    = lasso_editor.mapLocations,
		mapZoom    		= lasso_editor.mapZoom,
		mapStart        = lasso_editor.mapStart

	function restoreSelection(range) {
	    if (range) {
	        if (window.getSelection) {
	            var sel = window.getSelection();
	            sel.removeAllRanges();
	            sel.addRange(range);
	        } else if (document.selection && range.select) {
	            range.select();
	        }
	    }
	}

	$('#lasso--edit').click(function(e){
		e.preventDefault();

		// add body class editing
		$('body').toggleClass('lasso-editing');

		//append editor id to post container
		$(post_container).attr('id', editor);

		// append toolbar
		$(toolbar).hide().appendTo('body').fadeIn(200);

		// fade in controls if previous exacped
		$('.lasso--controls__right').css('opacity',1);

	    // set edtior to editable
	    $('#'+editor).attr('contenteditable',true);

	    // add settings panel
		$('body').append(panel);

		// append upload bar to featured image if present
		if ( $( featImgClass ).length > 0 ) {
			$(featImgClass).append( uploadControls );
		}

		// append contenteditable to title if set
		if ( $(titleClass).length > 0 ) {
			$(titleClass).attr('contenteditable', true);
		}

		// append the toolbar to any components that dont have them
		// @todo - this likely needs to be changed to a lasso- namespaced item which then needs to be updated in Aesop Story Engine
		$('.aesop-component').each(function(){

			// if there's no toolbar present
			if ( !$('.lasso-component--toolbar').length > 0 ) {

				// if this is a map then we need to first wrap it so that we can drag the  map around
				if ( $(this).hasClass('aesop-map-component') ) {

					var $this = $(this)

					// so wrap it with a aesop-compoentn aesop-map-component div
					// @todo - note once a map is inserted it can't be edited after saving again. a user has to delete the existin map and add a new map
					// to
					//$this.wrap('<form id="lasso--map-form" class="aesop-component aesop-map-component lasso--map-drag-holder" data-component-type="map" >').before( lassoDragHandle ).after( lassoMapForm );
					$this.wrap('<div id="lasso--map-form" class="aesop-component aesop-map-component lasso--map-drag-holder" data-component-type="map" >').before( lassoDragHandle );

				} else {

					$(this).append( lassoDragHandle );
				}
			}
		});

		// find images inserted from within the wordpress backend post editor and
		// wrap them in a div, then append an edit button for editing the image
		$("[class*='wp-image-']").each(function(){

			var $this = $(this)

			if ( !$('.lasso--wpimg-edit').length > 0 ) {

				$this.wrap('<div class="lasso--wpimg__wrap">')
				$('.lasso--wpimg__wrap').prepend(wpImgEdit)

			}

		});

		/////////////////
		///
		///   CONTENT EDITABLE / TOOLBAR
		///
		/// - attributes and tags are set to null to allow any markup and block level items to be passed through
		///   this means that medium.js is only providing us with a helper API to invoke certain markup and to 
		///   insert HTML. It's important to realize that the_content filter together with wpautop is responsible
		///   for automatically making new paragraph elements on enter
		///
		///////////////////
		article = document.getElementById(editor),
	    articleMedium = new Medium({
	        element: article,
	        mode: Medium.richMode,
	        attributes: null,
	        tags: null,
	        placeholder:'Just write...',
		    pasteAsText: true,
	    	cssClasses: {
				editor: 'lasso-editor',
				pasteHook: 'lasso-editor-paste-hook',
				placeholder: 'lasso-editor-placeholder',
				clear: 'lasso-editor-clear'
			}
	    });

	    // this forces the default new element in content editable to be a paragraph element if
	    // it has no previous element to depart from 
	    // ref http://stackoverflow.com/a/15482748
	    document.execCommand('defaultParagraphSeparator', false, 'p');


		article.highlight = function() {
			if (document.activeElement !== article) {

				articleMedium.select();

			} else {

				return false;
			}
		};

		document.getElementById('lasso-toolbar--bold').onmousedown = function() {
			article.highlight();
		    articleMedium.invokeElement('b');
			return false;
		};

		document.getElementById('lasso-toolbar--underline').onmousedown = function() {
			article.highlight();
			articleMedium.invokeElement('u');
			return false;
		};

		document.getElementById('lasso-toolbar--italic').onmousedown = function() {
			article.highlight();
			articleMedium.invokeElement('i');
			return false;
		};

		document.getElementById('lasso-toolbar--h2').onmousedown = function() {
			article.highlight();

			articleMedium.invokeElement('h2');

			return false;
		};

		document.getElementById('lasso-toolbar--h3').onmousedown = function() {
			article.highlight();
			articleMedium.invokeElement('h3');
			return false;
		};

		document.getElementById('lasso-toolbar--strike').onmousedown = function() {
			article.highlight();
			articleMedium.invokeElement('strike');
			return false;
		};
		document.getElementById('lasso-toolbar--link__create').onmousedown = function() {

		    restoreSelection(window.selRange);

			articleMedium.insertHtml('<a class="lasso-link" href="'+ $('#lasso-toolbar--link__inner').text() +'">'+window.selRange+'</a>');

			var container = window.selRange.startContainer.parentNode,
				containerTag = container.localName;

			if ( containerTag == 'a' ) {
				var containerObject = $(window.selRange.startContainer.parentNode);
				containerObject.replaceWith(containerObject[0].innerHTML);
			}

		    window.selRange = null;

		    // close modal drag
        	$('#lasso-toolbar--link').removeClass('link--drop-up');

		    return false;
		};
		document.getElementById('lasso-toolbar--html__insert').onmousedown = function() {

		    restoreSelection(window.selRange);

			var container = window.selRange.startContainer,
				containerTag;

			containerTag = container.localName;

			// handle 3 specific scenarios dealing with <p>'s
			// note: might need climb up dom tree depending on nesting use case
			if (containerTag == 'p') {
				// empty p tag
				var containerObject = $(container),
					htmlContent = $('#lasso-toolbar--html__inner').text();

				htmlContent = $(htmlContent);
				htmlContent.insertAfter( containerObject );
				containerObject.remove();
			} else {
				// within a p tag
				container = container.parentNode;
				containerTag = container.localName;

				if( containerTag == 'p') {
					var containerObject = $(container),
						htmlContent = $('#lasso-toolbar--html__inner').text();

					htmlContent = $(htmlContent);
					htmlContent.insertAfter( containerObject );
				} else {
					// let's just go ahead and paste it on location
					articleMedium.insertHtml( $('#lasso-toolbar--html__inner').text() );
				}
			}

		    window.selRange = null;

		    // close modal drag
        	$('#lasso-toolbar--html').removeClass('html--drop-up');

		    return false;
		};

		/////////////////
		/// EXIT EDITOR
		///////////////////
		$(document).keyup(function(e) {

			if ( 27 == e.keyCode ) {

				$('body').removeClass('lasso-sidebar-open lasso-editing');

				$('.lasso--toolbar_wrap, #lasso--sidebar, #lasso--featImgControls, #lasso--wpimg-edit').fadeOut().remove();

				$('#lasso--edit').css('opacity',1);
				$('.lasso--controls__right').css('opacity',0);
				$(post_container).attr('id','');

				// unwrap wp images
				$('.lasso--wpimg__wrap').each(function(){
					$(this).children().unwrap()
				});

				// unwrap map from hits drag holder
				$('#lasso--map-form').each(function(){

					var $this = $(this)

					$this.find('.lasso-component--controls, .lasso--map-form__footer ').remove()
					
					$this.children().unwrap()
				});

				$(titleClass).attr('contenteditable', false);

				articleMedium.destroy();
			}

		});

		///////////
		// INITIALIZE MAPS
		///////////
		var mapsGoTime = function(){

			var start_point = mapStart ? mapStart : [29.76, -95.38];
			var start_zoom = mapZoom ? mapZoom : 12;

			var map = L.map('aesop-map-component',{
				scrollWheelZoom: false,
				zoom: start_zoom,
				center: [29.76, -95.38]
			});

			setMapCenter(start_point[0],start_point[1]);

			jQuery('#lasso-map-address').geocomplete().bind('geocode:result', function(event, result){
				var lat = result.geometry.location.k;
				var lng = result.geometry.location.B;
				map.panTo(new L.LatLng(lat,lng));
				setMapCenter(lat,lng);
			});

			L.tileLayer('//{s}.tiles.mapbox.com/v3/aesopinteractive.hkoag9o3/{z}/{x}/{y}.png', {
				maxZoom: 20
			}).addTo(map);

			mapLocations.forEach(function(location) {
				createMapMarker([location['lat'],location['lng']],location['title']).addTo(map);
				createMarkerField( marker._leaflet_id, encodeMarkerData(location['lat'], location['lng'], location['title']) );
			});

			// adding a new marker
			map.on('click', onMapClick);
			map.on('dragend', onMapDrag);
			map.on('zoomend', onMapZoom);

			function setMapCenter(k, B) {
				var ldata = encodeLocationData(k,B);
				jQuery('input[name="ase-map-component-start-point"]').remove();
				jQuery('.lasso--map-form__footer').append('<input type="hidden" name="ase-map-component-start-point" data-ase="map" value="' + ldata + '">');
				jQuery('#lasso-map-address').val(k + ', ' + B);
			}

			function setMapZoom(z) {
				jQuery('input[name="ase-map-component-zoom"]').remove();
				jQuery('.lasso--map-form__footer').append('<input type="hidden" name="ase-map-component-zoom" data-ase="map" value="' + z + '">');
			}

			function onMarkerDrag(e) {
				updateMarkerField(e.target);
			}

			function onMapDrag(e) {
				var mapCenter = e.target.getCenter()
				setMapCenter(rnd(mapCenter.lat),rnd(mapCenter.lng));
			}

			function onMapZoom(e) {
				setMapZoom(e.target.getZoom());
			}

			function rnd(n) {
				return Math.round(n * 100) / 100
			}

			function onMapClick(e) {

			    var geojsonFeature = {

			        "type": "Feature",
			        "properties": {},
			        "geometry": {
			                "type": "Point",
			                "coordinates": [e.latlng.lat, e.latlng.lng]
			        }
			    }

			    var marker;

			    L.geoJson(geojsonFeature, {

			        pointToLayer: function(feature, latlng){

			            marker = L.marker(e.latlng, {

			                title: 'Resource Location',
			                alt: 'Resource Location',
			                riseOnHover: true,
			                draggable: true,

			            }).bindPopup("\
			            	<input type='text' name='ase_marker_text[]' value='Location Title'>\
			            	<a class='marker-update-button dashicons dashicons-yes'/></a>\
			            	<a class='marker-delete-button dashicons dashicons-trash'/></a>\
			            	");

			            marker.on('popupopen', onPopupOpen);
			            marker.on('dragend', onMarkerDrag);

			            return marker;
			        }
			    }).addTo(map);

			   	createMarkerField( marker._leaflet_id, encodeMarkerData(e.latlng.lat, e.latlng.lng, 'Location Title') );

			}

			// open popup
			function onPopupOpen() {

			    var tempMarker = this;

			    // To remove marker on click of delete button in the popup of marker
			    jQuery('.marker-delete-button:visible').click(function () {
			    	jQuery('input[data-marker="' + tempMarker._leaflet_id + '"]').remove();
			      	map.removeLayer(tempMarker);
			    });

			    // Update the title of the location
			    jQuery('.marker-update-button:visible').click(function (t) {
			    	var title = t.target.previousElementSibling.value;
			    	var tdata = encodeMarkerData(tempMarker._latlng.lat, tempMarker._latlng.lng, title);
			    	jQuery('input[data-marker="' + tempMarker._leaflet_id + '"]').val(tdata);
			    	tempMarker.options.title = title;
			    	tempMarker.closePopup();
			    	tempMarker.bindPopup("\
				            	<input type='text' name='ase_marker_text[]' value='" + title + "'>\
				            	<a class='marker-update-button dashicons dashicons-yes'/></a>\
				            	<a class='marker-delete-button dashicons dashicons-trash'/></a>\
				            	");
			    });
			}

			// create map marker
			function createMapMarker(latlng, title) {
	            marker = L.marker(latlng, {
	              	title: title,
	              	alt: title,
	              	riseOnHover: true,
	              	draggable: true,
	            }).bindPopup("\
	            	<input type='text' name='ase_marker_text[]' value='" + title + "'>\
	            	<a class='marker-update-button dashicons dashicons-yes'/></a>\
	            	<a class='marker-delete-button dashicons dashicons-trash'/></a>\
	            	");
	            marker.on('popupopen', onPopupOpen);
	            marker.on('dragend', onMarkerDrag);
	            return marker;
			}

			function getAllMarkers() {
			    var allMarkersObjArray = []; // for marker objects
			    var allMarkersGeoJsonArray = []; // for readable geoJson markers
			    jQuery.each(map._layers, function (ml) {
			        if (map._layers[ml].feature) {
			          	allMarkersObjArray.push(this)
			          	allMarkersGeoJsonArray.push(JSON.stringify(this.toGeoJSON()))
			        }
			    })
			}

			// let's create a hidden form element for the marker
			function createMarkerField(mid, mdata) {
			  	jQuery('.lasso--map-form__footer').append('<input type="hidden" name="ase-map-component-locations[]" data-ase="map" data-marker="' + mid + '" value="' + mdata + '">');
			}

			function updateMarkerField(m) {
				var tdata = encodeMarkerData(m._latlng.lat, m._latlng.lng, m.options.title);
				jQuery('input[data-marker="' + m._leaflet_id + '"]').val(tdata);
			}

			// encode the information into a string
			function encodeMarkerData(mlat, mlng, mtitle) {
				return encodeURIComponent(JSON.stringify({lat: mlat, lng: mlng, title: mtitle}));
			}

			// encode location into a string
			function encodeLocationData(mlat, mlng) {
				return encodeURIComponent(JSON.stringify({lat: mlat, lng: mlng}));
			}

			// decode the information
			function decodeMarkerData(mdata) {
				return decodeURIComponent(JSON.parse(mdata));
			}
		}

		/////////////////
		/// DRAG DROP
		///////////////////
		$('#'+editor).sortable({
			opacity: 0.65,
			placeholder:'lasso-drop-zone',
			handle: '.lasso-drag',
            cursor:'move',
            refreshPositions: true,
            helper: function( e, ui ) {

		    	// get the curent target and add the type class to the drag event
				var item = ui['context'],
					type = $(item).attr('data-component-type');

            	return $('<div class="lasso-drag-holder '+type+'"></div>'); 
            },
        	beforeStop: function (event, ui) { draggedItem = ui.item },
            receive: function () {

            	// close modal drag
            	$('#lasso-toolbar--components').removeClass('toolbar--drop-up');

            	// get the item and type
				var item = draggedItem['context'],
					type = $(item).attr('data-type');

				// if coming from draggable replace with our content and prepend toolbar
				if ( origin == 'draggable' ) {

					$(item).replaceWith( $(components[type]['content'])
						.prepend( lassoDragHandle )
						.attr({
							'data-component-type': type
						})
					)

					if ( 'map' == type ) { mapsGoTime() }

				}

		    }
		});

		$('#lasso-toolbar--components__list li').draggable({
			axis:'y',
			helper:'clone',
		    cursor: 'move',
		    connectToSortable: '#'+editor,
		    start: function(ui) {

		    	// add an origin so sortable can detect where comign from
		    	origin = 'draggable';

		    	// get the curent target and add the type class to the drag event
				var item = ui.currentTarget,
					type = $(item).attr('data-type');

              	$(this).addClass(type);
		    }
		});

	});

});





