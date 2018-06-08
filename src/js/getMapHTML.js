import getMapURL from './getMapURL.js';

export default function getMapHTML( attributes, apiKey ){
    const { interactive } = attributes;
    
    if( apiKey === '' || apiKey === undefined ){
        return null;
    }
    
    const mapURL = getMapURL( attributes, apiKey );

    if( !! interactive ){

        return (
            <iframe
            width='100%'
            height='100%'
            frameborder="0"
            style={{border:0}}
            src={mapURL} 
            allowFullScreen={true}>
            </iframe>
        )
    } else {
        return (
            <img src={mapURL} />
        );
    }
}