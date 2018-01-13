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
const { registerBlockType } = wp.blocks;
const { withAPIData } = wp.components;

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
			type: 'integer',
			default: 13,
		},
		width: {
			type: 'integer',
			default: 650,
		},
		height: {
			type: 'integer',
			default: 450,
		},
		interactive: {
			type: 'bool',
			default: true,
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
	} )( ( { APIData, attributes, setAttributes, focus, className } )  => {
        
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
        
        const {APIkey} = attributes;
        
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
		return [
			focus && (
                formFields( attributes, setAttributes)
            ),
			(
                <div className={className} style={{padding: '1em'}}>
                    {blockContent}
                </div>
            ),
		];
	} ),

	save( { attributes } ) {
        return getMapHTML( attributes );
	},
} );