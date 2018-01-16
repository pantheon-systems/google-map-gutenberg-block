# Pantheon Google Maps Gutenberg Block
This plugin provides a Google Maps block for the [Gutenberg WordPress editor](https://github.com/WordPress/gutenberg). 

## API Key
[Google Maps Embeds](https://developers.google.com/maps/documentation/embed/guide) requires [an API key](https://developers.google.com/maps/documentation/embed/get-api-key) to function properly. 

**In order for maps to be shown on your site you must enter an API key into plugin settings**

![Google Map Gutenberg Block API Setting](./assets/images/google-map-block-api-key.png)

Note: The API key will be exposed publicly to generate the map. It is important to [restrict your API key](https://developers.google.com/maps/documentation/embed/get-api-key#key-restrictions) so others do not abuse it. They can be restricted by domain or IP address.

Rate limits (at the time of publishing) are `2,000,000` per day. Each request, both on the frontend and in the admin/editor, count towards this total.

## Use
Once you have saved an API key into the plugin settings simply enter a location, such as New York, NY, or a full address. You may also choose the map width, height, zoom level and toggle between an interactive map or a static image in the block settings, which are visible in the right-hand sidebar when the block is selected.

![Google Map Gutenberg Block Demo](./assets/images/google-map-block-demo.gif)
