import getMapURL from './getMapURL.js';

/**
 * Get WordPress libraries from the wp global.
 */
const { __ } = wp.i18n;

export default function getMapHTML( attributes, apiKey ){
	const { interactive } = attributes;

	if ( apiKey === '' || apiKey === undefined ){
		return null;
	}

	const mapURL = getMapURL( attributes, apiKey );

	if ( interactive ){
		return (
			<iframe
				width='100%'
				height='100%'
				frameborder="0"
				style={ { border: 0 } }
				src={ mapURL }
				allowFullScreen={ true }
			/>
		)
	} else {
		return (
			<img src={ mapURL } alt={ __( 'Google map image' ) }/>
		);
	}
}
