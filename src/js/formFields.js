/**
 * Get WordPress libraries from the wp global
 */
const { __ } = wp.i18n;
const { InspectorControls, BlockDescription } = wp.blocks;
const { TextControl, ToggleControl, RangeControl, SelectControl } = InspectorControls;

/**
 * Declare variables
 */
const linkOptions = [
    {value: 'roadmap', label: __( 'roadmap' ) },
    {value: 'satellite', label: __( 'satellite' ) },
];

export default function formFields(attributes, setAttributes) {
    const { mapType, zoom, width, height, interactive } = attributes;

    return (

        <InspectorControls key="inspector">
            <BlockDescription>
                <p>{ __( 'This block creates either an interactive Google map or an image. Simply enter text for a location.' ) }</p>
            </BlockDescription>
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
            <RangeControl
                label={ __( 'Zoom Level' ) }
                value={ zoom }
                onChange={ ( value ) => setAttributes( { zoom: value } ) }
                min={ 5 }
                max={ 20 }
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
    );
}

export function locationField(location, setAttributes, focus, setFocus) {
    
}