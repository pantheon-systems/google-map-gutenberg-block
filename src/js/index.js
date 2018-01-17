 /**
 * Import internal dependencies
 */
import '../css/style.scss'
import blockIcons from './icons.js'
import formFields from './formFields.js'
import getMapHTML from './getMapHTML.js'
import getEditorBlockContent from './getEditorBlockContent.js'

/**
 * Get WordPress libraries from the wp global
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { withAPIData } = wp.components;
const { TextControl  } = wp.blocks.InspectorControls;

/**
 * Register Block.
 *
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'pantheon/google-map', {
	title: __( 'Google Map' ),
    
    description: __( 'Google Map' ),
	
	icon: blockIcons.googleMap,
	
	category: 'embed',

	attributes: {
		location: {
            type: 'string',
			default: '',
		},
		mapType: {
            type: 'string',
            default: 'roadmap',
		},
		zoom: {
			type: 'number',
			default: 13,
		},
		maxWidth: {
			type: 'number',
			default: 1920,
		},
		maxHeight: {
			type: 'number',
			default: 1329,
		},
		interactive: {
			type: 'boolean',
			default: true,
		},
		aspectRatio: {
            type: 'string',
            default: '2_1',
		},
		APIkey: {
			type: 'string',
			default: '',
		},
	},

	supports: {
		html: true,
	},

	edit: withAPIData( () => {
		return {
			APIData: '/pantheon-google-map-block/v1/options'
		};
	} )( ( { APIData, attributes, setAttributes, focus, className, setFocus } )  => {
        
        if( APIData.isLoading || APIData.data === undefined ){
            return (
                <div className={`${className} notice notice-warning`} style={{padding: '1em'}}>
                    <p style={{textAlign: 'center'}}>
                        {__( 'Loading map...') }
                    </p>
                </div>
            )
        }
        
        const pantheonGoogleMapBlockOptions = APIData.data;
        
        setAttributes( { APIkey: pantheonGoogleMapBlockOptions.settings.api_key } ) 
        
        const {APIkey, location, alignment} = attributes;

		return [
			!! focus && (
                formFields( attributes, setAttributes)
            ),
            ( ( location === '' || ! location.length ) || !! focus ) ? (
                <TextControl 
                    style={{padding: '0.5em', textAlign: 'center', border: 'solid 1px rgba(100,100,100,0.25)', margin: '0 1em'}}
                    onChange={ ( value ) => setAttributes( { location: value } ) } 
                    value={location}
                    placeholder={ __('Enter a location...') }
                />
            ) : null,
            getEditorBlockContent( attributes, className, pantheonGoogleMapBlockOptions )
		];
	} ),

	save( { attributes, className } ) {
        const {aspectRatio, interactive} = attributes
        let classNames = `${className} ratio${aspectRatio}`
        if( !! interactive ){
            classNames = `${classNames} interactive`
        }

        return (
            <div className={classNames}>
                <div className="map">
                    {getMapHTML( attributes )}
                </div>
            </div>
        )
	},
} );