/*
 * This is the main PebbleJS file. You do not need to modify this file unless
 * you want to change the way PebbleJS starts, the script it runs or the libraries
 * it loads.
 *
 * By default, this will run app.js
 */

require('safe');
var Settings = require('settings');

Pebble.addEventListener('ready', function(e) {
  // Initialize the Pebble protocol
  require('ui/simply-pebble.js').init();
  // Load local file
  require('app.js');
});

Pebble.addEventListener('showConfiguration', function(e) {
  var sites = Settings.data('sites') || [];
  var sitesParam = encodeURIComponent(JSON.stringify(sites));

  Pebble.openURL('http://107.170.129.79/pebble/sitestatus?sites=' + sitesParam);
});

Pebble.addEventListener('webviewclosed', function(e) {
  if(e.response) {
    var sites = JSON.parse(decodeURIComponent(e.response));
    Settings.data('sites', sites); 
  }
});
