import getMapURL from './getMapURL.js'

export default function getMapHTML( attributes ){
    const { interactive, APIkey } = attributes
    const mapURL = getMapURL( attributes )

    if( APIkey === '' ){
        return null
    }

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