export default function getMapURL( attributes, apiKey ){
    const { location, mapType, zoom, interactive, maxHeight, maxWidth } = attributes;

    if( apiKey === '' || apiKey === undefined ){
        return null;
    }

    if( !! interactive ){

        return (
            `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURI(location)}&zoom=${zoom}&maptype=${mapType}`
        );
    } else {
        return (
            `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURI(location)}&zoom=${zoom}&size=${maxWidth}x${maxHeight}&maptype=${mapType}&key=${apiKey}`
        );
    }
}