export default function getMapHTML( attributes, isEditor=false ){
    const { location, mapType, zoom, interactive, maxHeight, maxWidth, APIkey } = attributes;

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
            src={`https://www.google.com/maps/embed/v1/place?key=${APIkey}&q=${encodeURI(location)}&zoom=${zoom}&maptype=${mapType}`} 
            allowFullScreen={true}>
            </iframe>
            /*
            // Example using wp.element.createElement and vanilla JS instead of JSX
            wp.element.createElement('iframe', {
                src: `https://www.google.com/maps/embed/v1/place?key=${APIkey}&q=${encodeURI(location)}&zoom=${zoom}&maptype=${mapType}`,
                width: "100%",
                height: "100%",
                allowFullScreen: true,
                frameBorder: "0",
                style: {border:0},
            })
            */
        )
    } else {
        return (
            <img src={`https://maps.googleapis.com/maps/api/staticmap?center=${encodeURI(location)}&zoom=${zoom}&size=${maxWidth}x${maxHeight}&maptype=${mapType}&key=${APIkey}`} />
        );
    }
}