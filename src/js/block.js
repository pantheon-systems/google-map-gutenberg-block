/**
 * Import internal dependencies
 */
import '../css/style.scss'
import blockIcons from './icons.js'

/**
 * Get WordPress libraries from the wp global
 */
const { __ } = wp.i18n;
const { registerBlockType, InspectorControls, BlockDescription } = wp.blocks;
const { TextControl, ToggleControl, TextareaControl, RangeControl, SelectControl } = InspectorControls;

/**
 * Declare variables
 */
const blockGlobals = window.pantheonGoogleMapBlockGlobals

const linkOptions = [
    {value: 'roadmap', label: __( 'roadmap' ) },
    {value: 'satellite', label: __( 'satellite' ) },
];

const getMapHTML = function( attributes, isEditor=false ){
    const { location, mapType, zoom, width, height, interactive, APIkey } = attributes;

    if( APIkey === '' ){
        return null
    }

    if( !! interactive ){

        return (
            <iframe
            width={width}
            height={height}
            frameborder="0"
            style={{border:0}}
            src={`https://www.google.com/maps/embed/v1/place?key=${APIkey}&q=${encodeURI(location)}&zoom=${zoom}&maptype=${mapType}`} 
            allowFullScreen={true}>
            </iframe>
            /*
            // Example using wp.element.createElement instead of JSX
            wp.element.createElement('iframe', {
                src: `https://www.google.com/maps/embed/v1/place?key=${APIkey}&q=${encodeURI(location)}&zoom=${zoom}&maptype=${mapType}`,
                width: width,
                height: height,
                allowFullScreen: true,
                frameBorder: "0",
                style: {border:0},
            })
            */
        )
    } else {
        return (
            <img src={`https://maps.googleapis.com/maps/api/staticmap?center=${encodeURI(location)}&zoom=${zoom}&size=${width}x${height}&maptype=${mapType}&key=${APIkey}`} />
        );
    }
}

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
	
	icon: blockIcons.googleMap,
	
	category: 'embed',

	attributes: {
		location: {
            type: 'string',
            default: 'Pantheon, San Francisco, CA',
		},
		mapType: {
            type: 'string',
            default: 'roadmap',
		},
		zoom: {
			type: 'int',
			default: 13,
		},
		width: {
			type: 'int',
			default: 650,
		},
		height: {
			type: 'int',
			default: 450,
		},
		interactive: {
			type: 'bool',
			default: true,
		},
		APIkey: {
			type: 'string',
			default: pantheonGoogleMapBlockGlobals.settings.api_key,
		},
	},

	supports: {
		html: true,
	},

	edit( { attributes, setAttributes, focus, className } ) {
        const { location, mapType, zoom, width, height, interactive, APIkey } = attributes;
        let blockContent = (
            <div className={className} style={{padding: '1em'}}>
                {getMapHTML( attributes )}
            </div>
        )
        console.log(blockGlobals)
        if( APIkey === '' ){
            blockContent = (
                <div className={`${className} error`} style={{padding: '1em'}}>
                    <p style={{textAlign: 'center'}}>
                        {__( 'A Google Maps API key is required.')  }&nbsp;
                        <a href={blockGlobals.settings_url}>
                        {__( 'View plugin settings to add an API key.')  }
                        </a>
                    </p>
                </div>
            )
        }
		return [
			focus && (
				<InspectorControls key="inspector">
					<BlockDescription>
						<p>{ __( 'This block creates either an interactive Google map or an image. Simply enter text for a location.' ) }</p>
					</BlockDescription>
					<TextareaControl 
                        label={ __( 'Location' ) } 
                        onChange={ ( value ) => setAttributes( { location: value } ) } 
                        value={location}
                    />
					<TextControl 
                        label={ __( 'Width (in pixels)' ) } 
                        onChange={ ( value ) => setAttributes( { width: Number.parseInt( value, 10 ) } ) }
                        value={width}
                        type='number'
                    />
					<TextControl 
                        label={ __( 'Height (in pixels)' ) } 
                        onChange={ ( value ) => setAttributes( { height: Number.parseInt( value, 10 ) } ) }
                        value={height}
                        type='number'
                    />
                    <TextControl 
                        label={ __( 'API Key' ) } 
                        onChange={ ( value ) => setAttributes( { APIkey: value } ) }
                        value={APIkey}
                        autoFocus={ APIkey === '' }
                    />
					<SelectControl
                        label={ __( 'Map Type' ) } 
                        select={mapType} 
                        options={linkOptions} 
                        onChange={ ( value ) => setAttributes( { mapType: value } ) } 
                        value={ mapType }
                    />
                    <ToggleControl
						label={ __( 'Toggle interactive map (on) or static image (off)' ) }
						checked={ !! interactive }
						onChange={ () => setAttributes( { interactive: ! interactive } ) }
					/>
				</InspectorControls>
            ),
			(
                <div className={className} style={{padding: '1em'}}>
                    {blockContent}
                </div>
            ),
		];
	},

	save( { attributes } ) {
        return getMapHTML( attributes );
	},
} );