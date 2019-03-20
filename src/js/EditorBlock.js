/**
 * Import internal dependencies
 */
import '../css/style.css';
import getMapHTML from './getMapHTML.js';
import classnames from 'classnames';

/**
 * Get WordPress libraries from the wp global
 */
const { __ } = wp.i18n;
const { InspectorControls } = wp.editor;
const { Button, TextControl, ToggleControl, RangeControl, SelectControl } = wp.components;
const { Component, Fragment } = wp.element;

let settings;
wp.api.loadPromise.then( () => {
	settings = new wp.api.models.Settings();
});

const googleAPIkeyLink = 'https://console.developers.google.com/flows/enableapi?apiid=maps_backend,static_maps_backend,maps_embed_backend&keyType=CLIENT_SIDE&reusekey=true';

export default class EditorBlock extends Component {
    constructor() {
        super( ...arguments );

        this.saveApiKey = this.saveApiKey.bind( this );

        this.state = {
            apiKey: PantheonGoogleMapsData.APIKey,
            isSavedKey: PantheonGoogleMapsData.APIKey !== '',
            isLoading: PantheonGoogleMapsData.userCanManageOptions,
            APIKeyConstantDefined: !! PantheonGoogleMapsData.APIKeyConstantDefined,
            userCanManageOptions: !! PantheonGoogleMapsData.userCanManageOptions,
            isSaving: false,
            keySaved: false,
        };

        settings.on( 'change:pantheon_google_map_block_api_key', (model) => {
            const apiKey = model.get('pantheon_google_map_block_api_key');
            this.setState({ apiKey: settings.get( 'pantheon_google_map_block_api_key' ), isSavedKey: (apiKey === '' ) ? false : true  });
        });

        if( this.state.userCanManageOptions ){
            settings.fetch().then( response => {
                this.setState({ apiKey: response.pantheon_google_map_block_api_key });
                if ( this.state.apiKey && this.state.apiKey !== '' ) {
                    this.setState({ isSavedKey: true });
                }
                this.setState({ isLoading: false });
            });
        } else {
            this.setState({ apiKey: PantheonGoogleMapsData.APIKey });
            if ( this.state.apiKey && this.state.apiKey !== '' ) {
                this.setState({ isSavedKey: true });
            }
            this.setState({ isLoading: false });
        }
    }

    saveApiKey() {
        this.setState({ isSaving: true });
        const model = new wp.api.models.Settings({ pantheon_google_map_block_api_key: this.state.apiKey });
        model.save().then( response => {
            this.setState({ isSavedKey: true, isLoading: false, isSaving: false, keySaved: true });
            settings.fetch();
        });
    }

    render() {
        const { attributes, className, isSelected, setAttributes } = this.props;
        const { location, mapType, zoom, interactive, maxWidth, maxHeight, aspectRatio } = attributes;
        const editorPadding = '0 1em';
        const classNames = classnames(
			className,
			`ratio${ aspectRatio }`,
			{
				'interactive': interactive,
				'has-api-key': this.state.apiKey,
			}
		);

        const linkOptions = [
            {value: 'roadmap', label: __( 'roadmap' ) },
            {value: 'satellite', label: __( 'satellite' ) },
        ];

        const aspectRatioOptions = [
            {value: '2_1', label: __( '2:1' ) },
            {value: '16_9', label: __( '16:9' ) },
            {value: '4_3', label: __( '4:3' ) },
            {value: '1_1', label: __( '1:1' ) },
            {value: '1_2', label: __( '1:2' ) },
        ];

        if ( !! this.state.isLoading  ) {
            return (
                <div className={`${className} notice notice-warning`} style={{padding: editorPadding}}>
                    <p style={{textAlign: 'center'}}>
                        {__( 'Loading map...') }
                    </p>
                </div>
            )
        }

        let apiKeyMessage = ''

        if( this.state.APIKeyConstantDefined ) {
            apiKeyMessage = __( 'The Google Maps API key is defined with the GOOGLE_MAPS_API_KEY constant. To change the API key, update the constant value.');
        } else if( this.state.isSavedKey ) {
            apiKeyMessage = this.state.userCanManageOptions ? '' : __( 'Only administrators can change the Google Maps API key.');
        } else { 
            apiKeyMessage = this.state.userCanManageOptions ? __( 'A valid Google Maps API key is required to use the map block, please enter one below.') : __( 'A valid Google Maps API key is required to use the map block, please ask an administrator to enter one.');
        }

        const keyInput = (
            <div className="api-key-input-container">
                {
                    this.state.APIKeyConstantDefined  ? (
                        <p style={{textAlign: 'center'}}>
                            {apiKeyMessage}
                        </p>
                    ) : (
                        <Fragment>
                            <p style={{textAlign: 'center'}}>
                                {apiKeyMessage}<br />
                                { ( this.state.isSavedKey && this.state.userCanManageOptions ) ? __( 'Note: changing the API key effects all Google Map Embed blocks.') : null }
                            </p>
                            <TextControl
                                key="api-input"
                                value={ this.state.apiKey }
                                onChange={ value => this.setState({ apiKey: value }) }
                                style={{textAlign: 'center', border: 'solid 1px rgba(100,100,100,0.25)'}}
                                readOnly={this.state.APIKeyConstantDefined || ! this.state.userCanManageOptions}
                                placeholder={ __('API Key') }
                            />
                            <p style={{textAlign: 'center', paddingBottom: '1em'}}>
                                <a href={googleAPIkeyLink}>
                                    {__('An API key can be obtained here.')}
                                </a><br /><br />
                                <Button
                                    isPrimary
                                    onClick={ this.saveApiKey }
                                    isBusy={ this.state.isSaving }
                                    disabled={ this.state.APIKeyConstantDefined || ! this.state.userCanManageOptions || this.state.apiKey === '' }
                                >
                                    {__('Save API key')}
                                </Button>
                            </p>
                        </Fragment>
                    )
                }
            </div>
        );

        if ( ! this.state.isSavedKey  ) {
            return (
                <div className={`${className} error`} style={{padding: editorPadding}}>
                    {keyInput}
                </div>
            )
        }

        return [
			!! isSelected && (
                <InspectorControls>
                    {!! interactive ? (
                        <SelectControl
                            label={ __( 'Aspect Ratio' ) } 
                            select={aspectRatio} 
                            options={aspectRatioOptions} 
                            onChange={ ( value ) => setAttributes( { aspectRatio: value } ) } 
                            value={ aspectRatio }
                        />
                    ) : null}
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
                    {! interactive ? (
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
                    ) : null}
                    {keyInput}
                </InspectorControls>
            ),
            ( <TextControl 
                key="location-input"
                style={{textAlign: 'center', border: 'solid 1px rgba(100,100,100,0.25)'}}
                onChange={ ( value ) => setAttributes( { location: value } ) } 
                value={location}
                placeholder={  __('Enter a location...') }
                label={ ( location === '' || ! location.length ) ? __('Location') : null }
            /> ),
            ( location === '' || ! location.length ) ? (
                <div className={`${className} error`} style={{padding: editorPadding}}>
                    <p style={{textAlign: 'center'}}>
                        {__( 'A location is required. Please enter one in the field above.')  }
                    </p>
                </div>
            ) : (
                ( this.state.apiKey === '' && this.state.keySaved === false ) ?
                keyInput
                : (<div className={classNames}>
                    <div className="map">
                        {getMapHTML( attributes, this.state.apiKey )}
                    </div>
                </div>)
            ),
		];

    }

}
