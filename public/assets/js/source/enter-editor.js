jQuery(document).ready(function($){

	var editor 			= lasso_editor.editor,
		strings 		= lasso_editor.strings,
		settingsLink	= lasso_editor.settingsLink,
		post_container  = lasso_editor.article_object,
		toolbar 		= lasso_editor.toolbar,
		toolbarHeading 	= lasso_editor.toolbarHeadings,
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
		mapStart        = lasso_editor.mapStart,
		objectsNoSave   = lasso_editor.objectsNoSave,
		objectsNonEditable = lasso_editor.objectsNonEditable,
		supportedNoSave = lasso_editor.supportedNoSave

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

	/*
	function to disable selection. Not used for now
	jQuery.fn.extend({
		disableSelection : function() {
			return this.each(function() {
				this.onselectstart = function() { return false; };
				this.unselectable = "on";
				jQuery(this).css('user-select', 'none');
				jQuery(this).css('-o-user-select', 'none');
				jQuery(this).css('-moz-user-select', 'none');
				jQuery(this).css('-khtml-user-select', 'none');
				jQuery(this).css('-webkit-user-select', 'none');
			});
		}
	});*/
	

	$('#lasso--edit').click(function(e){
	
		if ($(post_container).length ==0 ){
			// try one more time
			post_container = '.entry-content';
			if ($(post_container).length ==0 ){
				// if we can't find the article class, warn them and exit
				swal({
					title: strings.warning,
					type: 'info',
					text: strings.missingClass,
					showCancelButton: true,
					cancelButtonText: strings.cancelText,
					confirmButtonColor: '#007aab',
					confirmButtonText: strings.missingConfirm,
					closeOnConfirm: false
				},
				function(){
					location.replace(settingsLink);
				});
				return;
			}
		}
	
		e.preventDefault();

		// add body class editing
		$('body').toggleClass('lasso-editing');

		//append editor id to post container
		$(post_container).attr('id', editor);

		// append toolbar
		$(toolbar).hide().appendTo('body').fadeIn(300);

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
		} else {
			// try one more time with .entry-header
			titleClass = '.entry-header';
			if ( $(titleClass).length > 0 ) {
				$(titleClass).attr('contenteditable', true);
			}
		}

		// if tehre are any scrollnav sections we need to break them open so that we can drag compnents around in them
		$('.scroll-nav__section').each(function(){
			$(this).children().unwrap();
		})

		// add an exit editor button
		$('.lasso--controls__right ').prepend('<a title="Exit Editor" id="lasso--exit" href="#"></a>');

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

				if ( $this.parent().hasClass('wp-caption') ) {

					$this.parent().addClass('lasso--wpimg__wrap')

				} else {

					$this.wrap('<div data-component-type="wpimg" class="lasso--wpimg__wrap lasso-component">')
				}

				$this.parent().prepend(wpImgEdit)

			}

		});

		$('.lasso-component:not(.lasso--wpimg__wrap)').each(function(){

			var $this = $(this)

			if ( !$('.lasso-component--toolbar').length > 0 ) {
				$(this).append( lassoDragHandle );

			}

		})

		
		

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
	        placeholder:lasso_editor.strings.justWrite,
		    pasteAsText: true,
	    	cssClasses: {
				editor: 'lasso-editor',
				pasteHook: 'lasso-editor-paste-hook',
				placeholder: 'lasso-editor-placeholder',
				clear: 'lasso-editor-clear'
			}
	    });
		
		$(objectsNonEditable).attr('contenteditable',false);
		$(objectsNonEditable).attr('readonly',true);
		
		// remove any additional markup so we dont save it as HTML
		if (objectsNoSave.length) {
		    objectsNoSave = objectsNoSave+","+supportedNoSave;
		} else {
			objectsNoSave = supportedNoSave;
		}
		
		lasso_editor.objectsNoSave = objectsNoSave;
		
		if ($(objectsNonEditable).length || (lasso_editor.showIgnoredItems && ($(objectsNoSave).length)|| $(supportedNoSave).length )) {
			lasso_editor.readOnlyExists = true;
		} else {
			lasso_editor.readOnlyExists = false;
		}
		if (!lasso_editor.showIgnoredItems) {
		    $(objectsNoSave).remove();
		    $(supportedNoSave).remove();
		} else {
			$(objectsNoSave).attr('contenteditable',false);
		    $(objectsNoSave).attr('readonly',true);
		}
		
		//$(objectsNonEditable).disableSelection();

	    // this forces the default new element in content editable to be a paragraph element if
	    // it has no previous element to depart from 
	    // ref http://stackoverflow.com/a/15482748
	    document.execCommand('defaultParagraphSeparator', false, 'p');


		article.highlight = function() {
			if (document.activeElement !== article) {

				//articleMedium.select();
				article.focus();

			} else {

				return false;
			}
		};

		document.getElementById('lasso-toolbar--bold').onmousedown = function() {
			articleMedium.element.contentEditable = true;
			article.highlight();
		    articleMedium.invokeElement('b');
			return false;
		};
		
		/*
		// Todo: code for future integration
		document.getElementById('lasso-toolbar--color').onmousedown = function() {
			article.highlight();
		    //articleMedium.invokeElement('b');
			//handleClick: function(e) {
            e.preventDefault();
            e.stopPropagation();

            //this.selectionState = this.base.exportSelection();

            // If no text selected, stop here.
            //if(this.selectionState && (this.selectionState.end - this.selectionState.start === 0) ) {
            //  return;
            //}

            // colors for picker
            var pickerColors = [ 
              "#1abc9c",
              "#2ecc71",
              "#3498db",
              "#9b59b6",
              "#34495e",
			  
              "#16a085",
              "#27ae60",
              "#2980b9",
              "#8e44ad",
              "#2c3e50",
			  
              "#f1c40f",
              "#e67e22",
              "#e74c3c",
              "#bdc3c7",
              "#95a5a6",
			  
              "#f39c12"
            ];

            //var picker = vanillaColorPicker(this.document.querySelector(".medium-editor-toolbar-active .editor-color-picker"));
			var picker = vanillaColorPicker(document.getElementById('lasso-toolbar--color'));
            picker.set("customColors", pickerColors);
            picker.set("positionOnTop");
            picker.openPicker();
            picker.on("colorChosen", function(color) {
              //this.base.importSelection(this.selectionState);
              document.execCommand("styleWithCSS", false, true);
              document.execCommand("foreColor", false, color);
			  //var container = window.selRange.startContainer.parentNode;
			  //container.style.color = color;
            }.bind(this));
        //}
			return false;
		};*/
		
		//color
		if (lasso_editor.showColor) {
			// red is the default color
			$( '#lasso-toolbar--color-pick' ).iris();
			$( '#lasso-toolbar--color-pick' ).iris('color', '#f00');
			$("#lasso-toolbar--color-pick").css( 'color', '#f00');
			$("#lasso-toolbar--color-set").css( 'color', '#f00');
			
			$(window).mousedown(function() {
			    //Hide the color picker if visible
				$("#lasso-toolbar--color-pick").iris('hide');
			});
			/*$(".iris-picker").click(function(e) {
			   
			});*/
			
			function rgb2hex(rgb) {
				rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
				function hex(x) {
					return ("0" + parseInt(x).toString(16)).slice(-2);
				}
				return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
			}
			if (!lasso_editor.isMobile) {
			    $(".iris-picker").css({position:'absolute', top:-180});
			}
			$("#lasso-toolbar--color-pick").iris({
				palettes: true,
				change: function(event, ui) {
					// event = standard jQuery event, produced by whichever control was changed.
					// ui = standard jQuery UI object, with a color member containing a Color.js object

					// change the color
					$("#lasso-toolbar--color-pick").css( 'color', ui.color.toString());
					$("#lasso-toolbar--color-set").css( 'color', ui.color.toString());
				}
			});
				
			$('#lasso-toolbar--color-pick').mousedown(function(event) {
				
				if (event.target.id == 'lasso-toolbar--color-pick') {
				   $("#lasso-toolbar--color-pick").iris('toggle');
				}
                event.stopPropagation();				
			});
			
			$('#lasso-toolbar--color-set').mousedown(function() {
				$("#lasso-toolbar--color-pick").iris('hide');
				articleMedium.element.contentEditable = true;
				//article.highlight();
				var colorVar = rgb2hex($('#lasso-toolbar--color-pick').css("color"));
				articleMedium.invokeElement('span', { style: 'color:' + colorVar + ';'});
				//unselect
				if (window.getSelection) {
				  if (window.getSelection().empty) {  // Chrome
					window.getSelection().empty();
				  } else if (window.getSelection().removeAllRanges) {  // Firefox
					window.getSelection().removeAllRanges();
				  }
				} else if (document.selection) {  // IE?
				  document.selection.empty();
				}
				return false;
			});
		}

		
		// color end
		
		//alignement
		if (lasso_editor.showAlignment) {
			$('#lasso-toolbar--right-align').mousedown(function() {
				var focusedElements = articleMedium.html.textElementsAtCaret();
				if (focusedElements) {
					for (i = 0; i < focusedElements.length; i++) {
					  focusedElements[i].style.textAlign = "right";
					}			
				}
				return false;
			});
			
			$('#lasso-toolbar--left-align').mousedown(function() {
				var focusedElements = articleMedium.html.textElementsAtCaret();
				if (focusedElements) {
					for (i = 0; i < focusedElements.length; i++) {
					  focusedElements[i].style.textAlign = "left";
					}			
				}
				return false;
			});
			
			$('#lasso-toolbar--center-align').mousedown(function() {
				var focusedElements = articleMedium.html.textElementsAtCaret();
				if (focusedElements) {
					for (i = 0; i < focusedElements.length; i++) {
					  focusedElements[i].style.textAlign = "center";
					}			
				}
				return false;
			});
		}
		
		//end alignment
		
		document.getElementById('lasso-toolbar--underline').onmousedown = function() {
			articleMedium.element.contentEditable = true;
			article.highlight();
			articleMedium.invokeElement('u');
			return false;
		};

		document.getElementById('lasso-toolbar--italic').onmousedown = function() {
			articleMedium.element.contentEditable = true;
			article.highlight();
			articleMedium.invokeElement('i');
			return false;
		};

		if ( toolbarHeading ) {

			document.getElementById('lasso-toolbar--h2').onmousedown = function() {
				articleMedium.element.contentEditable = true;
				article.highlight();

				articleMedium.invokeElement('h2');

				return false;
			};

			document.getElementById('lasso-toolbar--h3').onmousedown = function() {
				articleMedium.element.contentEditable = true;
				article.highlight();
				articleMedium.invokeElement('h3');
				return false;
			};
		}

		document.getElementById('lasso-toolbar--strike').onmousedown = function() {
			articleMedium.element.contentEditable = true;
			article.highlight();
			articleMedium.invokeElement('strike');
			return false;
		};
		document.getElementById('lasso-toolbar--link__create').onmousedown = function() {
			articleMedium.element.contentEditable = true;
		    article.highlight();
		    restoreSelection(window.selRange);

			if ($('#aesop-toolbar--link_newtab').is(':checked')) {
				 articleMedium.insertHtml('<a class="lasso-link" target="_blank" href="'+ $('#lasso-toolbar--link__inner').text() +'">'+window.selRange+'</a>');
			} else {
			    articleMedium.insertHtml('<a class="lasso-link" href="'+ $('#lasso-toolbar--link__inner').text() +'">'+window.selRange+'</a>');
			}
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
		    articleMedium.element.contentEditable = true;
		    restoreSelection(window.selRange);

			var container = window.selRange.startContainer,
				containerTag;

			containerTag = container.localName;
			var containerObject = $(container),
					htmlContent = $('#lasso-toolbar--html__inner').text();

			htmlContent = $(htmlContent);
			htmlContent.attr('contenteditable','true');

			// handle 3 specific scenarios dealing with <p>'s
			// note: might need climb up dom tree depending on nesting use case
			if (containerTag == 'p') {
				// empty p tag
				htmlContent.insertAfter( containerObject );
				containerObject.remove();
			} else {
				// within a p tag
				container = container.parentNode;
				containerTag = container.localName;

				if( containerTag == 'p') {
					htmlContent.insertAfter( containerObject );
				} else {
					// let's just go ahead and paste it on location
					articleMedium.insertHtml( htmlContent.text() );
				}
			}

		    window.selRange = null;

		    // close modal drag
        	$('#lasso-toolbar--html').removeClass('html--drop-up');

		    return false;
		};

		if (lasso_editor.enableAutoSave) {
			lasso_editor.intervalID = window.setInterval(autoSave, 60000);
		}
		
		function autoSave() {
			if (localStorage.getItem( 'lasso_backup_'+postid ) || lasso_editor.dirtyByComponent) 
			{
				$('.lasso--controls__right a:not(#lasso--exit)').trigger('click');
			}
		}
		
		/////////////////
		/// EXIT EDITOR
		///////////////////
		function exitEditor(){
			if ($('body').hasClass('lasso-sidebar-open')) {
				//e.preventDefault();
				$('body').removeClass('lasso-sidebar-open');
				$('#lasso--component__settings').perfectScrollbar('destroy');
				return;
			}

			$('body').removeClass('lasso-sidebar-open lasso-editing');

			$('.lasso--toolbar_wrap, #lasso--sidebar, #lasso--featImgControls, #lasso--wpimg-edit, #lasso--exit').fadeOut().remove();

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

			$(articleMedium.element).find("*").removeAttr('contenteditable');
			articleMedium.destroy();
		}
		// on escape key exit
		$(document).keyup(function(e) {

			if ( 27 == e.keyCode ) {
				if ($('#lasso-toolbar--link').hasClass('link--drop-up')) {
					$('#lasso-toolbar--link').removeClass('link--drop-up');
                } else if ($('#lasso-toolbar--html').hasClass('html--drop-up')) {
					$('#lasso-toolbar--html').removeClass('html--drop-up');
				} else {
				   exitEditor()
				}
			}

		});
		// on utility class exit
		//$('#lasso--exit').live('click',function(e){
		jQuery(document).on('click','#lasso--exit', function(e){
			e.preventDefault();
			exitEditor();
		})

		// on control s save
		$(document).keydown(function(e) {
		    if ((e.which == '115' || e.which == '83' ) && (e.ctrlKey || e.metaKey)){
		        e.preventDefault();
		        	
		        $('.lasso-editing #lasso--save').trigger('click')

		        return false;
		    }
		    return true;
		});

		///////////
		// INITIALIZE TIMELINE
		//////////
		var timelineGoTime = function(){

			// if there's no toolbar present
			if ( !$('.aesop-timeline').length > 0 ) {
				$('body').append('<div class="aesop-timeline"></div>').addClass('has-timeline');
			}


			if ( !$('.aesop-timeline .scroll-nav').length > 0 ) {

				$('.aesop-entry-content').scrollNav({
				    sections: '.aesop-timeline-stop',
				    arrowKeys: true,
				    insertTarget: '.aesop-timeline',
				    insertLocation: 'appendTo',
				    showTopLink: false,
				    showHeadline: false,
				    scrollOffset: 0,
				});

				$('.aesop-timeline-stop').each(function(){
					var label = $(this).attr('data-title');
					$(this).text(label).append( lassoDragHandle );
				});

			}


		}

		///////////
		// INITIALIZE VIDEO
		///////////
		var videoGoTime = function(){
			$('.aesop-video-component').fitVids()
		}

		var start_point 	= mapStart ? mapStart : [29.76, -95.38]
		, 	start_zoom 		= mapZoom ? mapZoom : 12
		, 	mapTileProvider = lasso_editor.mapTileProvider;

		///////////
		// INITIALIZE MAPS
		///////////
		var mapsGoTime = function(){

			var lat = start_point.lat ? start_point.lat : 29.76
			,	lng = start_point.lng ? start_point.lng : -95.38;

			var map = L.map('aesop-map-component',{
				scrollWheelZoom: false,
				zoom: start_zoom,
				center: [lat, lng]
			});

			setMapCenter(start_point[0],start_point[1]);

			jQuery('#lasso-map-address').geocomplete().bind('geocode:result', function(event, result){
				var lat = result.geometry.location.k;
				var lng = result.geometry.location.B;
				map.panTo(new L.LatLng(lat,lng));
				setMapCenter(lat,lng);
			});

			L.tileLayer(mapTileProvider, {
				maxZoom: start_zoom
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
		// recent change: when a new component is dropped, the setting window is opened automatically
		$('#'+editor).sortable({
			opacity: 0.65,
			placeholder:'lasso-drop-zone',
			handle: '.lasso-drag',
            cursor:'move',
            tolerance:'pointer',
            refreshPositions: true,
            helper: function( e, ui ) {

		    	// get the curent target and add the type class to the drag event
				var item = ui['context'],
					type = $(item).attr('data-component-type');

            	return $('<div class="lasso-drag-holder lasso-toolbar--component__'+type+'"></div>');
            },
        	beforeStop: function (event, ui) { draggedItem = ui.item },
            receive: function () {


            	// close modal drag
            	$('#lasso-toolbar--components').removeClass('toolbar--drop-up');

            	// get the item and type
				var item = draggedItem['context'],
					type = $(item).attr('data-type');
				// item2 will be the content tthat gets inserted. It also has edit controls
                var item2;

				// if coming from draggable replace with our content and prepend toolbar
				if ( origin == 'draggable' ) {

					// if a stock wordpress image is dragged in
					if ( 'wpimg' == type ) {

						item2 = $(components[type]['content']).prepend( wpImgEdit );
						$(item).replaceWith( item2 );

					// else it's likely an aesop component
					} else {

						item2 = $(components[type]['content'])
							.prepend( lassoDragHandle )
							.attr({
								'data-component-type': type
							});
						$(item).replaceWith( item2);
					}

					if ( 'map' == type ) { mapsGoTime() }

					if ('timeline_stop' == type ) { timelineGoTime() }

					if ('video' == type ) { videoGoTime() }
					
					$(item2).find('.lasso-settings').trigger('click');
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
	if (lasso_editor.skipToEdit)
	{
		$('#lasso--edit').trigger('click');
		lasso_editor.skipToEdit = false;
	}
});





