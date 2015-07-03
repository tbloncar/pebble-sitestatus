/**
 * SiteStatus
 */

var UI = require('ui');
var ajax = require('ajax');
var Vector2 = require('vector2');
var Settings = require('settings');

Settings.data('sites', ['http://www.reddit.com/notfound',
                        'http://news.ycombinator.com',
                        'http://myspace.com',
                        'http://www.facebook.com',
                        'http://www.example.com/notfound']);

var sites = Settings.data('sites');
var siteElements = [];
var activeIndex = -1;
var main = new UI.Window({
  scrollable: true,
  backgroundColor: 'darkGray'
});

function displayStatus(url, status, positionY) {
  var statusColor = status < 300 ? 'darkGreen' : 'sunsetOrange';
  var rect = new UI.Rect({
    backgroundColor: statusColor,
    size: new Vector2(144, 25),
    position: new Vector2(0, positionY - 3)
  });

  var divider = new UI.Rect({
    backgroundColor: 'black',
    size: new Vector2(144, 1),
    position: new Vector2(0, positionY + 22)
  });

  var favicon = new UI.Image({
    position: new Vector2(5, positionY - 1),
    size: new Vector2(20, 20),
    image: 'http://www.google.com/s2/favicons?domain=' + url
  });
 
  var domainText = url.match(/https*:\/\/([^\/]*).*/)[1];
  var domain = new UI.Text({
    position: new Vector2(30, positionY),
    color: 'white',
    font: 'gothic-14',
    size: new Vector2(80, 20),
    text: domainText,
    textAlign: 'left',
    textOverflow: 'ellipsis' 
  });

  var statusCode = new UI.Text({
    position: new Vector2(115, positionY),
    color: 'white',
    size: new Vector2(40, 20),
    font: 'gothic-14',
    text: status,
    textAlign: 'left',
    textOverflow: 'wrap'
  }); 

  main.add(rect);
  main.add(divider);
  main.add(favicon);
  main.add(domain);
  main.add(statusCode);

  // Persist elements for manipulation
  siteElements.push({
    container: rect,
    divider: divider,
    favicon: favicon,
    domain: domain,
    status: statusCode
  });

  return positionY + 26;
}

function removeSiteElements() {
  siteElements.forEach(function(elm) {
    for(var k in elm) {
      main.remove(elm[k]); 
    } 
  });
}

function getStatuses() {
  var positionY = 30;

  // Remove existing site elements
  removeSiteElements();

  sites.forEach(function(url) {
    (function(u) {
      ajax({
        url: url,
        method: 'get',
      }, function(data, status, request) {
        positionY = displayStatus(url, status, positionY);
      }, function(data, status, request) {
        positionY = displayStatus(url, status, positionY);
      });
    })(url);
  });
}

var title = new UI.Text({
  text: 'SiteStatus',
  textAlign: 'center',
  position: new Vector2(0, 0),
  size: new Vector2(144, 20),
  font: 'gothic-18-bold'
});

main.on('click', 'select', getStatuses);
main.add(title);
getStatuses();
main.show();
