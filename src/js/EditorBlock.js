/**
 * Import internal dependencies
 */
import '../css/style.scss'
import blockIcons from './icons.js'
import getMapHTML from './getMapHTML.js'
import formFields from './formFields.js'

/**
 * Get WordPress libraries from the wp global
 */
const { __ } = wp.i18n;
// const { TextControl  } = wp.blocks.InspectorControls;
// const { Component } = wp.element;
const { Button } = wp.components;
const { TextControl } = wp.blocks.InspectorControls;
const { Component } = wp.element;

export default class EditorBlock extends Component {
    constructor() {
        super( ...arguments );

        this.saveApiKey = this.saveApiKey.bind( this );
        this.clearApiKey = this.clearApiKey.bind( this );

        this.state = {
            apiKey: '',
            isSavedKey: false,
            isLoading: true
        };

        const model = new wp.api.models.Settings();
        model.fetch().then( response => {
            this.setState({ apiKey: response.pantheon_google_map_block_api_key });
            if ( this.state.apiKey && this.state.apiKey !== '' ) {
                this.setState({ isSavedKey: true, isLoading: false });
            }
        });
    }

    saveApiKey() {
        if( this.state.apiKey !== '' ) {
            const model = new wp.api.models.Settings({ pantheon_google_map_block_api_key:apiKey });
            model.save().then( response => {
                this.setState({ isSavedKey: true, isLoading: false });
            });
        }
    }

    clearApiKey() {
        const model = new wp.api.models.Settings({ pantheon_google_map_block_api_key:'' });
        model.save().then( response => {
            this.setState({ isSavedKey: false, apiKey: '' });
        });
    }

    render() {
        const { attributes, className, focus, setAttributes, setFocus } = this.props;
        const { location, mapType, zoom, interactive, maxWidth, maxHeight, aspectRatio } = attributes;
        const editorPadding = '0 1em';
        const classNames = ( ! interactive ) ? `${className} ratio${aspectRatio}` : `${className}  ratio${aspectRatio} interactive`

        if ( !! this.state.isLoading  ) {
            return (
                <div className={`${className} notice notice-warning`} style={{padding: editorPadding}}>
                    <p style={{textAlign: 'center'}}>
                        {__( 'Loading map...') }
                    </p>
                </div>
            )
        }

        if ( ! this.state.isSavedKey  ) {
            return (
                <div className={`${className} error`} style={{padding: editorPadding}}>
                    <p style={{textAlign: 'center'}}>
                        {__( 'A Google Maps API key is required, please enter one below.')  }
                    </p>
                    <TextControl
                        key="api-input"
                        value={ this.state.apiKey }
                        onChange={ value => this.setState({ apiKey: value }) }
                    />
                    <p style={{textAlign: 'center', paddingBottom: '1em'}}>
                        {__('Need an API key? Get one')}&nbsp;
                        <a href="https://console.developers.google.com/flows/enableapi?apiid=maps_backend,static_maps_backend,maps_embed_backend&keyType=CLIENT_SIDE&reusekey=true">
                            {__('here.')}
                        </a><br />
                        <Button onClick={ this.saveApiKey }>
                            {__('Save API key')}
                        </Button>
                    </p>
                </div>
            );
        }

        return [
			!! focus && (
                <formFields 
                    saveApiKey={this.saveApiKey}
                    setState={this.setState}
                    apiKey={this.state.apiKey}
                    {...this.props}
                />
            ),
            ( <TextControl 
                key="location-input"
                style={{padding: '0.5em', textAlign: 'center', border: 'solid 1px rgba(100,100,100,0.25)', margin: editorPadding}}
                onChange={ ( value ) => setAttributes( { location: value } ) } 
                value={location}
                placeholder={ __('Enter a location...') }
            /> ),
            ( location === '' || ! location.length ) ? (
                <div className={`${className} error`} style={{padding: editorPadding}}>
                    <p style={{textAlign: 'center'}}>
                        {__( 'A location is required. Please enter one in the field above.')  }
                    </p>
                </div>
            ) : (
                <div className={classNames}>
                    <div className="map">
                        {getMapHTML( attributes, this.state.apiKey )}
                    </div>
                </div>
            ),
		];

    }

}