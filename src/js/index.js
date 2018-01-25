/**
 * Import internal dependencies
 */
import '../css/style.scss'
import blockIcons from './icons.js'
import EditorBlock from './EditorBlock.js'

/**
 * Get WordPress libraries from the wp global
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

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
    description: __( 'This block creates either an interactive Google map or an image. Simply enter text for a location above the map and adjust advanced settings below.' ),
	icon: blockIcons.googleMap,
	category: 'embed',
	supports: {html: true},
	edit: EditorBlock,
    save() { return null }
});

/*

withAPIData( () => {
		return {
			APIData: '/wp/v2/settings'
		};
	} )( ( { APIData, attributes, setAttributes, focus, className, setFocus } )  => {

        const editorPadding = '0 1em';
        
        if( APIData.isLoading || APIData.data === undefined ){
            return (
                <div className={`${className} notice notice-warning`} style={{padding: editorPadding}}>
                    <p style={{textAlign: 'center'}}>
                        {__( 'Loading map...') }
                    </p>
                </div>
            )
        }

        return null;
        
        const pantheonGoogleMapBlockOptions = APIData.data;
        
        setAttributes( { APIkey: pantheonGoogleMapBlockOptions.settings.api_key } ) 
        
        const {APIkey, location, alignment} = attributes;

		return [
			!! focus && (
                formFields( attributes, setAttributes)
            ),
            ( ( location === '' || ! location.length ) || !! focus ) ? (
                <TextControl 
                    style={{padding: '0.5em', textAlign: 'center', border: 'solid 1px rgba(100,100,100,0.25)', margin: editorPadding}}
                    onChange={ ( value ) => setAttributes( { location: value } ) } 
                    value={location}
                    placeholder={ __('Enter a location...') }
                />
            ) : null,
            getEditorBlockContent( attributes, className, pantheonGoogleMapBlockOptions )
		];
	} ),


registerBlockType( 'mdlr/instagram', {
	title: __( 'Instagram' ),
	icon: 'camera',
	category: 'common',
	attributes: {
		content: {
			type: 'string',
			default: 'Editable block example',
		},
		apiKey: {
			type: 'string',
			default: '',
		},
		refresh: {
			type: 'boolean',
			default: true,
		}
	},
	edit: class extends Component {
		constructor() {
			super( ...arguments );

			this.saveApiKey = this.saveApiKey.bind( this );
			this.clearApiKey = this.clearApiKey.bind( this );

			this.state = {
				apiKey: '',
				isSavedKey: false
			};

			const model = new wp.api.models.Settings();
			model.fetch().then( response => {
				this.setState({ apiKey: response.mdlr_block_instagram_api_key });
				if (this.state.apiKey) {
					this.setState({ isSavedKey: true });
				}
			});
		}

		saveApiKey() {
			const model = new wp.api.models.Settings({ mdlr_block_instagram_api_key:this.state.apiKey });
			model.save().then( response => {
				this.setState({ isSavedKey: true });
			});
		}

		clearApiKey() {
			const model = new wp.api.models.Settings({ mdlr_block_instagram_api_key:'' });
			model.save().then( response => {
				this.setState({ isSavedKey: false, apiKey: '' });
			});
		}

		render() {
			const { attributes, className, focus, setAttributes, setFocus } = this.props;

			if ( ! this.state.isSavedKey  ) {
				return (
					<div>
						<p>You need an api key:</p>

						<TextControl
							key="api-input"
							className={ className }
							value={ this.state.apiKey }
							onChange={ value => this.setState({ apiKey: value }) }
						/>
						<button onClick={ this.saveApiKey }>Save API key</button>
					</div>
				);
			}

			const inspectorControls = focus && (
				<InspectorControls key="inspector">
					<h3>{ __( 'Instagram Settings' ) }</h3>
					<TextControl
						key="api-input"
						className={ className }
						value={ this.state.apiKey }
						onChange={ value => this.setState({ apiKey: value }) }
					/>
					<button onClick={ this.saveApiKey }>Save API key</button>
				</InspectorControls>
			);

			return [
				inspectorControls,
				<div>
					<h2>Instagram stuff</h2>
				</div>

			];

		}
	},

	save( { attributes, className } ) {
		const { content } = attributes;

		return (<p className={ className }>{ content }</p>);
	},
} );
*/