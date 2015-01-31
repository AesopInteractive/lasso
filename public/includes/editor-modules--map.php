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

		<?php echo '<input type="hidden" name="action" value="process_map_save">';?>
	<?php

	return ob_get_clean();
}