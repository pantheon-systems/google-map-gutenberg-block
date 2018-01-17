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

const aspectRatioOptions = [
    {value: '2_1', label: __( '2:1' ) },
    {value: '1_1', label: __( '1:1' ) },
    {value: '4_3', label: __( '4:3' ) },
    {value: '16_9', label: __( '16:9' ) },
    {value: '1_2', label: __( '1:2' ) },
];

export default function formFields(attributes, setAttributes) {
    const { mapType, zoom, interactive, maxWidth, maxHeight, aspectRatio } = attributes;

    return (

        <InspectorControls key="inspector">
            <BlockDescription>
                <p>{ __( 'This block creates either an interactive Google map or an image. Simply enter text for a location above the map and adjust advanced settings below.' ) }</p>
            </BlockDescription>
            {!! interactive && (
                <SelectControl
                    label={ __( 'Aspect Ratio' ) } 
                    select={aspectRatio} 
                    options={aspectRatioOptions} 
                    onChange={ ( value ) => setAttributes( { aspectRatio: value } ) } 
                    value={ aspectRatio }
                />
            )}
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
           {! interactive && (
            <div>
                <TextControl 
                    label={ __( 'Maximum width (in pixels)' ) } 
                    onChange={ ( value ) => setAttributes( { maxWidth: Number.parseInt( value, 10 ) } ) }
                    value={maxWidth}
                    type='number'
                    min={0}
                    step={1}
                />
                <TextControl 
                    label={ __( 'Maximum height (in pixels)' ) } 
                    onChange={ ( value ) => setAttributes( { maxHeight: Number.parseInt( value, 10 ) } ) }
                    value={maxHeight}
                    type='number'
                    min={0}
                    step={1}
                />
            </div>
           )}
        </InspectorControls>
    );
}

export function locationField(location, setAttributes, focus, setFocus) {
    
}