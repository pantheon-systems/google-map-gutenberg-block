/* global PantheonGoogleMapsAPIKey, wp */
/**
 * Import internal dependencies.
 */
import '../css/style.css';
import getMapHTML from './getMapHTML.js';
import classnames from 'classnames';

/**
 * Get WordPress libraries from the wp global.
 */
const { __ } = wp.i18n;
const { InspectorControls } = wp.editor;
const { TextControl, ToggleControl, RangeControl, SelectControl } = wp.components;
const { Component } = wp.element;

export default class EditorBlock extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
			apiKey: PantheonGoogleMapsAPIKey,
			isLoading: true,
		};
	}

	render() {
		console.log( this.state, this.state.apiKey === '' )
		const { attributes, className, isSelected, setAttributes } = this.props;
		const { location, mapType, zoom, interactive, maxWidth, maxHeight, aspectRatio } = attributes;
		const editorPadding = '0 1em';
		const classes = classnames(
			className,
			`ratio${ aspectRatio }`,
			{
				'interactive': interactive,
				'has-api-key': this.state.apiKey,
			}
		);

		const linkOptions = [
			{
				value: 'roadmap',
				label: __( 'roadmap' ),
			},
			{
				value: 'satellite',
				label: __( 'satellite' ),
			},
		];

		const aspectRatioOptions = [
			{
				value: '2_1',
				label: __( '2:1' ),
			},
			{
				value: '1_1',
				label: __( '1:1' ),
			},
			{
				value: '4_3',
				label: __( '4:3' ),
			},
			{
				value: '16_9',
				label: __( '16:9' ),
			},
			{
				value: '1_2',
				label: __( '1:2' ),
			},
		];

		const keyInput = (
			<div>
				<p style={ { textAlign: 'center' } }>
					{ __( 'A Google Maps API key is required, please enter one on the writing settings page. You may need an administrator to do this.' ) }
					<br />
					<a href="options-writing.php">
						{ __( 'Enter Google Maps API Key' ) }
					</a>
					<br />
					{ __( 'Note: changing the API key effects all Google Map Embed blocks.' ) }
				</p>
				<p style={ {
					textAlign: 'center',
					paddingBottom: '1em',
				} }>
					{ __( 'Need an API key? Get one' ) }&nbsp;
					<a href="https://console.developers.google.com/flows/enableapi?apiid=maps_backend,static_maps_backend,maps_embed_backend&keyType=CLIENT_SIDE&reusekey=true">
						{ __( 'here.' ) }
					</a>
				</p>
			</div>
		);

		if ( ! this.state.apiKey ) {
			return (
				<div className={ `${ classes } error` } style={ { padding: editorPadding } }>
					{ keyInput }
				</div>
			)
		}

		return [
			!! isSelected && (
				<InspectorControls>
					{ interactive ? (
						<SelectControl
							label={ __( 'Aspect Ratio' ) }
							select={ aspectRatio }
							options={ aspectRatioOptions }
							onChange={ value => setAttributes( { aspectRatio: value } ) }
							value={ aspectRatio }
						/>
					) : null}
					<RangeControl
						label={ __( 'Zoom Level' ) }
						value={ zoom }
						onChange={ value => setAttributes( { zoom: value } ) }
						min={ 5 }
						max={ 20 }
					/>
					<SelectControl
						label={ __( 'Map Type' ) }
						select={ mapType }
						options={ linkOptions }
						onChange={ value => setAttributes( { mapType: value } ) }
						value={ mapType }
					/>
					<ToggleControl
						label={ __( 'Toggle interactive map (on) or static image (off)' ) }
						checked={ !! interactive }
						onChange={ () => setAttributes( { interactive: ! interactive } ) }
					/>
					{ ! interactive ? (
						<div>
							<TextControl
								label={ __( 'Maximum width (in pixels)' ) }
								onChange={ value => setAttributes( { maxWidth: Number.parseInt( value, 10 ) } ) }
								value={ maxWidth }
								type='number'
								min={ 0 }
								step={ 1 }
							/>
							<TextControl
								label={ __( 'Maximum height (in pixels)' ) }
								onChange={ value => setAttributes( { maxHeight: Number.parseInt( value, 10 ) } ) }
								value={ maxHeight }
								type='number'
								min={ 0 }
								step={ 1 }
							/>
						</div>
					) : null}
				</InspectorControls>
			),
			( <TextControl
				key="location-input"
				style={ {
					textAlign: 'center',
					border: 'solid 1px rgba(100,100,100,0.25)',
				} }
				onChange={ value => setAttributes( { location: value } ) }
				value={ location }
				placeholder={  __( 'Enter a location...' ) }
				label={ ( location === '' || ! location.length ) ? __( 'Location' ) : null }
			/> ),
			( location === '' || ! location.length ) ? (
				<div className={ `${ classes } error` } style={ { padding: editorPadding } }>
					<p style={ { textAlign: 'center' } }>
						{ __( 'A location is required. Please enter one in the field above.' ) }
					</p>
				</div>
			) : (
				( this.state.apiKey === '' ) ?
					keyInput
					: ( <div className={ classes }>
						<div className="map">
							{ getMapHTML( attributes, this.state.apiKey ) }
						</div>
					</div> )
			),
		];

	}

}
