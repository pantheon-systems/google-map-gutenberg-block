/**
 * get WordPress libraries from the wp global
 */
const { __ } = wp.i18n;
const { InspectorControls } = wp.blocks;
const { TextControl, ToggleControl, RangeControl, SelectControl } = InspectorControls;
const { Button } = wp.components;
const { Component, PanelBody, PanelRow, FormToggle } = wp.element;

export default class formFields extends Component {

    constructor( props ) {
        super( ...arguments );
      }    
    
    render (){
        
        console.log(this.props);
        const { setState, saveApiKey, apiKey, setAttributes, attributes } = this.props;
        const { mapType, zoom, interactive, maxWidth, maxHeight, aspectRatio } = attributes;

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

        return (
            <InspectorControls key="inspector">
                <PanelBody
                title={ __( 'Map Settings' ) }
                >
                    <PanelRow>
                        <TextControl
                            label={ __( 'API Key' ) } 
                            key="api-input"
                            value={ apiKey }
                            onChange={ value => setState({ apiKey: value }) }
                        />
                        <p>
                            { __( 'Note: updating the API key will apply site wide. All other settings apply to only the selected block.' ) }
                        </p>
                        <Button isPrimary onClick={ saveApiKey }>
                            {__('Save API key')}
                        </Button>
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
                    </PanelRow>
                </PanelBody>
            </InspectorControls>
        )
    }
}