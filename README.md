# Map Embed Gutenberg Block for Google Maps By Pantheon
This WordPress plugin provides a Google Maps embed block for the [Gutenberg WordPress editor](https://github.com/WordPress/gutenberg).

This plugin **requires** WordPress `5.0` or greater.

## Installation
The Map Embed Gutenberg Block for Google Maps By Pantheon plugin can be installed just like you would install any other WordPress plugin. To install from GitHub simply [download the `.zip`](https://github.com/pantheon-systems/google-map-gutenberg-block/archive/master.zip) file. You can then either unzip it and add it to your plugins folder _or_ upload the `.zip` file when adding a new plugin in the WordPress dashboard.

Because Google Map embes require an API key you'll need to provide a valid API key in plugin settings as well. See the detailed steps below.

1. Search for 'embed-gutenberg-block-google-maps' when adding a new plugin in the WordPress dashboard **or** upload the plugin files manually to the `/wp-content/plugins/` directory
1. Activate the plugin through the 'Plugins' menu in WordPress
1. Obtain a Google Map embed API key (instructions below)
1. Visit the plugin settings page and enter/save your Google Map embed API key
1. Clear full page cache if enabled for your site so the API key can be read from the plugin settings via the REST API
1. Search for _Google Map_ when adding a new content block
1. Enter a location for the map. This can be an exact address for a queryable location, such as _New York, NY_
1. Optionally edit the advanced block settings

## API Key
This plugin requires an API key to interact with Google Maps. Without an API key maps will not be displayed.

To obtain an API key follow these steps:
1. Create a new project in the Google Developer's console by clicking [here](https://console.developers.google.com/flows/enableapi?apiid=maps_backend,static_maps_backend,maps_embed_backend&keyType=CLIENT_SIDE&reusekey=true) and selecting _Create new project_
1. Name your project
1. Select _HTTP referrers (web sites)_  for the _Key restriction_ type
1. Enter the domains where your API key will be used
    - Example: `*.mysite.com`
1. Click the _Create_ button
1. Write your API key down in a safe place
1. Enter the API key into the plugin settings
1. Clear full page caching, if necessary

Note: The API key will be exposed publicly to generate the map. It is important to [restrict your API key](https://developers.google.com/maps/documentation/embed/get-api-key#key-restrictions) so others do not abuse it. The API key will be used, and displayed, in both the WordPress editor and the front end of the site.

## Use
Once you have saved an API key into the plugin settings simply enter a location, such as New York, NY, or a full address. You may also choose the map width, height, zoom level and toggle between an interactive map or a static image in the block settings, which are visible in the right-hand sidebar when the block is selected.

![Google Map Gutenberg Block Demo](./assets/images/screenshot-1.gif)

If you want to e.g. wrap the output in your markup, you can do that with `render_pantheon_google_map_block` filter in your `functions.php` file:

```php
add_filter('render_pantheon_google_map_block', function($content, $attributes) {
    return '<div class="row"><div class="column">' . $content . '</div></div>';
});
```

## Changelog

### `1.5.1`
Aspect ratio bug fixes to address [this WordPress.org issue](https://circleci.com/docs/api/#trigger-a-new-job).

- Fix the `1:1` aspect ratio incorrectly displaying as `2:1`
- Move `16:9` ahead of `4:3` in the aspect ratio selection list so that the aspect ratios are in order of width

### `1.5.0`
Allow non-admins to use the map block

The settings API endpoint requires the `manage_options` capability. This is problematic because only administrators have that permission by default so any users with a lesser role cannot use the map block.

The saved API key and a boolean of whether the current user has the `manage_options` capability are now passed to the block editor JS. Those values are used to determine if an API key is present. If it is not only users who have the `manage_options` capability are shown an option to update the API key. Users without that capability are directed to ask an administrator to save the API key.

Once an API key is saved the block works as expected for users without the `manage_options` capability as the API key is no longer fetched from the REST API for those users.

### `1.3.5`
Remove `wp-blocks` dependency from block CSS registration

### `1.3.4`
Enqueue block JavaScript in the footer

### `1.3.3`
* Add filter `render_pantheon_google_map_block`

### `1.3.2`
* Use `InspectorControls` in `wp.editor` rather than `wp.blocks` as it will be deprecated in Gutenberg `3.1`
* Test with WordPress `4.9.6`
* Test with Gutenberg `3.0.1`

### `1.3.1`
* Fix a bug retrieving API key from the database causing the map to not display on the frontend

### `1.3`
* Upgrade to webpack 4

### `1.2`
* Use [`create-guten-block`](https://github.com/ahmadawais/create-guten-block) for building assets.
    - Prior build process has dependencies that used a version of `hoek` [which had a vulnerability](https://nvd.nist.gov/vuln/detail/CVE-2018-3728)

### `1.1.2`
* Enqueue block scripts/styles automatically using `register_block_type`
* Change `focus` to `isSelected`
* Disallow HTML editing of block source


### `1.1.1`
* Import controls from `wp.components` instead of `wp.blocks.InspectorControls`
* Bump tested up to from `4.9.2` to `4.9.5`

### `1.1.0`
* Dynamic block
* API Key entered directly in the block
* Removes plugin settings page
* API key setting synced in global state between all blocks.
* Updated README with new API instructions
    - Includes Google Developer flow link for API key
* Use WordPress core settings REST API endpoint instead of a custom endpoint

### `1.0.0`
* Initial release
