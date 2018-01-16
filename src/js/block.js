/**
 * Import internal dependencies
 */
import '../css/style.scss'
import blockIcons from './icons.js'
import formFields from './formFields.js'
import getMapHTML from './getMapHTML.js'

/**
 * Get WordPress libraries from the wp global
 */
const { __ } = wp.i18n;
const { registerBlockType, Editable } = wp.blocks;
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
			default: __( 'Pantheon, San Francisco, CA' ),
		},
		mapType: {
            type: 'string',
            default: 'roadmap',
		},
		zoom: {
			type: 'number',
			default: 13,
		},
		width: {
			type: 'number',
			default: 650,
		},
		height: {
			type: 'number',
			default: 450,
		},
		interactive: {
			type: 'bool',
			default: true,
		},
		align: {
			type: 'string',
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
        
        if( attributes.APIkey === '' ){
            setAttributes( { APIkey: pantheonGoogleMapBlockOptions.settings.api_key } ) 
        }
        
        const {APIkey, location} = attributes;
        
        let blockContent = (
            <div className={className} style={{padding: '1em'}}>
                {getMapHTML( attributes )}
            </div>
        )

        if( APIkey === '' ){
            blockContent = (
                <div className={`${className} error`} style={{padding: '1em'}}>
                    <p style={{textAlign: 'center'}}>
                        {__( 'A Google Maps API key is required.')  }&nbsp;
                        <a href={pantheonGoogleMapBlockOptions.settings_url}>
                        {__( 'View plugin settings to add an API key.')  }
                        </a>
                    </p>
                </div>
            )
        }
        
        if( location === '' || ! location.length ){
            blockContent = (
                <div className={`${className} error`} style={{padding: '1em'}}>
                    <p style={{textAlign: 'center'}}>
                        {__( 'A location is required. Please enter one in the field above.')  }
                    </p>
                </div>
            )
        }

		return [
			focus && (
                formFields( attributes, setAttributes)
            ),
			(
                <div>
                    {
                        <TextControl 
                            style={{padding: '0.5em', textAlign: 'center', border: 'solid 1px rgba(80,80,80,0.5)', margin: '0 1em'}}
                            onChange={ ( value ) => setAttributes( { location: value } ) } 
                            value={location}
                            placeholder={ __('Location...') }
                        />
                    }
                    {blockContent}
                </div>
            ),
		];
	} ),

	save( { attributes } ) {
        return getMapHTML( attributes );
	},
} );