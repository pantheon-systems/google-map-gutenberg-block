export default function(locationArray) {
    let locationString = ''

    for( const value of locationArray ) {

        if( typeof value === 'object' ){

            if( value.hasOwnProperty('props') && value.props.hasOwnProperty('children') ){
                locationString = `${locationString}${value.props.children}` 
            }

            if( value.hasOwnProperty('type') && value.type === 'br' ){
                locationString = `${locationString} `
            }

        }

        if( typeof value === 'string' ){
            locationString = `${locationString}${value}`
        }
    }
    return locationString
}