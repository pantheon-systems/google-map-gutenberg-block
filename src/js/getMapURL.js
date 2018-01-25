export default function getMapURL( attributes ){
    const { location, mapType, zoom, interactive, maxHeight, maxWidth, APIkey } = attributes;

    if( APIkey === '' ){
        return null
    }

    if( !! interactive ){

        return (
            `https://www.google.com/maps/embed/v1/place?key=${APIkey}&q=${encodeURI(location)}&zoom=${zoom}&maptype=${mapType}`
        )
    } else {
        return (
            `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURI(location)}&zoom=${zoom}&size=${maxWidth}x${maxHeight}&maptype=${mapType}&key=${APIkey}`
        );
    }
}