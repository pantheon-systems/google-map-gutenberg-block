/**
 * Import internal dependencies.
 */
import '../css/style.css';
import blockIcons from './icons.js';
import EditorBlock from './EditorBlock.js';

/**
 * Get WordPress libraries from the wp global.
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

/**
 * Register Block.
 *
 * @param  {string}  name     Block name.
 * @param  {Object}  settings Block settings.
 * @return {WPBlock} The block, if it has been successfully registered; otherwise `undefined`.
 */
registerBlockType( 'pantheon/google-map', {
	title: __( 'Google Map' ),
    description: __( 'This block creates either an interactive Google map or a static map image. Simply enter text for a location in the map block. Advanced settings can be adjusted below.' ),
	icon: blockIcons.googleMap,
	category: 'embed',
	supports: { html: false },
	edit: EditorBlock,
	save() {
		return null;
	},
} );
