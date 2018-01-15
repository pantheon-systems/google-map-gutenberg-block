export default function getMapHTML( attributes, isEditor=false ){
    const { location, mapType, zoom, width, height, interactive, APIkey } = attributes;

    if( APIkey === '' ){
        return null
    }

    if( !! interactive ){

        return (
            <iframe
            width={width}
            height={height}
            frameborder="0"
            style={{border:0}}
            src={`https://www.google.com/maps/embed/v1/place?key=${APIkey}&q=${encodeURI(location)}&zoom=${zoom}&maptype=${mapType}`} 
            allowFullScreen={true}>
            </iframe>
            /*
            // Example using wp.element.createElement and vanilla JS instead of JSX
            wp.element.createElement('iframe', {
                src: `https://www.google.com/maps/embed/v1/place?key=${APIkey}&q=${encodeURI(location)}&zoom=${zoom}&maptype=${mapType}`,
                width: width,
                height: height,
                allowFullScreen: true,
                frameBorder: "0",
                style: {border:0},
            })
            */
        )
    } else {
        return (
            <img src={`https://maps.googleapis.com/maps/api/staticmap?center=${encodeURI(location)}&zoom=${zoom}&size=${width}x${height}&maptype=${mapType}&key=${APIkey}`} />
        );
    }
}