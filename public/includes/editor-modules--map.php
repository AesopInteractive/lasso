<?php

/**
*
*	Component settings for the Map component
*
*/
function lasso_map_editor_module(){

	$postid = get_the_ID();

	ob_start();

		echo '<div class="lasso-map-data" style="display: hidden;">';
			wp_nonce_field( 'ase_map_meta', 'ase_map_meta_nonce' );
		echo '</div>';

		echo "Starting location: <input type='text' id='lasso-map-address'/>";
		echo __('<em>Hint: Type to search for locations</em>','lasso-core');
		//echo '<div id="lasso-map" style="height:350px;"></div>';

		$ase_map_locations 		= get_post_meta( $postid, 'ase_map_component_locations' );
		$ase_map_start_point 	= get_post_meta( $postid, 'ase_map_component_start_point', true );
		$get_map_zoom 			= get_post_meta( $postid, 'ase_map_component_zoom', true);

		$ase_map_start_point 	= empty ( $ase_map_start_point ) ? array(29.76, -95.38) : array($ase_map_start_point['lat'],$ase_map_start_point['lng']);
		$ase_map_zoom 			= empty ( $get_map_zoom ) ? 12 : $get_map_zoom;

		$ase_map_start_point 	= json_encode($ase_map_start_point);
		$ase_map_locations 		= json_encode($ase_map_locations);


		?>
		<!-- Lasso Maps -->
		<script>

			jQuery(document).ready(function(){

				var start_point = <?php echo $ase_map_start_point; ?>;
				var start_zoom = <?php echo absint($ase_map_zoom); ?>;

				/*
				var map = L.map('lasso-map-component',{
					scrollWheelZoom: false,
					zoom: start_zoom,
					center: start_point
				});
				*/

				setMapCenter(start_point[0],start_point[1]);

				jQuery('#lasso-map-address').geocomplete().bind('geocode:result', function(event, result){
					var lat = result.geometry.location.k;
					var lng = result.geometry.location.B;
					map.panTo(new L.LatLng(lat,lng));
					setMapCenter(lat,lng);
					});
				/*
				L.tileLayer('//{s}.tiles.mapbox.com/v3/lassointeractive.hkoag9o3/{z}/{x}/{y}.png', {
					maxZoom: 20
				}).addTo(map);
				*/
				<?php if ( ! empty( $ase_map_locations ) ) : ?>
					var ase_map_locations = <?php echo $ase_map_locations; ?>
				<?php endif; ?>

				ase_map_locations.forEach(function(location) {
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
					jQuery('.lasso-map-data').append('<input type="hidden" name="ase-map-component-start-point" data-ase="map" value="' + ldata + '">');
					jQuery('#lasso-map-address').val(k + ', ' + B);
				}

				function setMapZoom(z) {
					jQuery('input[name="ase-map-component-zoom"]').remove();
					jQuery('.lasso-map-data').append('<input type="hidden" name="ase-map-component-zoom" data-ase="map" value="' + z + '">');
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
				  	jQuery('.lasso-map-data').append('<input type="hidden" name="ase-map-component-locations[]" data-ase="map" data-marker="' + mid + '" value="' + mdata + '">');
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
			});
		</script>
	<?php

	return ob_get_clean();
}