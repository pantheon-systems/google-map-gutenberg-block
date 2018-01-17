=== Map Embed Gutenberg Block for Google Maps By Pantheon ===
Contributors: andrew.taylor
Tags: map, gutenberg, google, embed
Author URI: https://pantheon.io/
Plugin URI: https://github.com/pantheon-systems/google-map-gutenberg-block
Requires at least: 4.8
Tested up to: 4.9.2
Requires PHP: 5.6
Stable tag: 1.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
 
This plugin provides a Google Maps embed block for the Gutenberg editor.
 
== Description ==
 
This plugin provides a Google Maps embed block for the [Gutenberg WordPress editor](https://github.com/WordPress/gutenberg).
 
== Installation ==
 
The Map Embed Gutenberg Block for Google Maps By Pantheon plugin can be installed just like you would install any other WordPress plugin. Because Google Map embes require an API key you'll need to provide a valid API key in plugin settings as well. See the detailed steps below.
 
1. Install and activate the Gutenberg plugin if you are on a WordPress version <= `5.0`
1. Upload the plugin to the `/wp-content/plugins/` directory
1. Activate the plugin through the 'Plugins' menu in WordPress
1. Obtain a Google Map embed API key
1. Visit the plugin settings page and enter/save your Google Map embedAPI key
1. Search for _Google Map_ when adding a new content block
1. Enter a location for the map. This can be an exact address for a queryable location, such as _New York, NY_
1. Optionally edit the advanced block settings
 
== API Key ==

[Google Maps Embeds](https://developers.google.com/maps/documentation/embed/guide) requires [an API key](https://developers.google.com/maps/documentation/embed/get-api-key) to function properly. 

**In order for maps to be shown on your site you must enter an API key into plugin settings**

Note: The API key will be exposed publicly to generate the map. It is important to [restrict your API key](https://developers.google.com/maps/documentation/embed/get-api-key#key-restrictions) so others do not abuse it. They can be restricted by domain or IP address.

Rate limits (at the time of publishing) are `2,000,000` per day. Each request, both on the frontend and in the admin/editor, count towards this total.

== Use ==

Once you have saved an API key into the plugin settings simply enter a location, such as New York, NY, or a full address. You may also choose the map width, height, zoom level and toggle between an interactive map or a static image in the block settings, which are visible in the right-hand sidebar when the block is selected.

== Screenshots ==
 
1. Animated `GIF` showing a demo of the plugin
2. Screenshot showing where to add the Googe Map embed API key
 
== Changelog ==
 
= 1.0 =
* Initial release