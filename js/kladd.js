var map = L.map('map').setView([65, 10], 5);
// L.esri.basemapLayer('Topographic').addTo(map);


fylkeLayer = L.esri.featureLayer({
  url: 'https://trdetestarcgi01.miljodirektoratet.no/arcgis/rest/services/interne_tjenester/kommuner_fylker/MapServer/1',
  simplifyFactor: 0.35,
  precision: 5,
  fields: ['OBJECTID', 'fylkeNavn'],
  style: {
    color: '#999999',
    weight: 1,
    fill: true,
    fillColor: '#FFFFFF',
    fillOpacity: 1.0
  }
}).addTo(map);

kommuneLayer = L.esri.featureLayer({
  url: 'https://trdetestarcgi01.miljodirektoratet.no/arcgis/rest/services/interne_tjenester/kommuner_fylker/MapServer/0',
  simplifyFactor: 0.35,
  precision: 5,
  fields: ['OBJECTID', 'kommNavn'],
  style: {
    color: '#999999',
    weight: 1,
    fill: true,
    fillColor: '#FFFFFF',
    fillOpacity: 1.0
  }
}).addTo(map);

norgeLayer = L.esri.featureLayer({
  url: 'https://trdetestarcgi01.miljodirektoratet.no/arcgis/rest/services/interne_tjenester/kommuner_fylker/MapServer/2',
  simplifyFactor: 0.35,
  precision: 5,
  fields: ['OBJECTID', 'Land'],
  style: {
    color: '#999999',
    weight: 1,
    fill: true,
    fillColor: '#FFFFFF',
    fillOpacity: 1.0
  }
}).addTo(map);


var oldId;

fylkeLayer.on('mouseout', function (e) {
  // document.getElementById('info-pane').innerHTML = 'Hover to Inspect';
  fylkeLayer.resetFeatureStyle(oldId);
});

kommuneLayer.on('mouseout', function (e) {
  // document.getElementById('info-pane').innerHTML = 'Hover to Inspect';
  kommuneLayer.resetFeatureStyle(oldId);
});

fylkeLayer.on('mouseover', function (e) {
  oldId = e.layer.feature.id;
  document.getElementById('info-pane').innerHTML = e.layer.feature.properties.fylkeNavn;
  fylkeLayer.setFeatureStyle(e.layer.feature.id, {
    color: '#9D78D2',
    weight: 1,
    opacity: 1,
    fill: true,
    fillColor: '#BD98F2',
    fillOpacity: 1.
  });
});

kommuneLayer.on('mouseover', function (e) {
  oldId = e.layer.feature.id;
  document.getElementById('info-pane').innerHTML = e.layer.feature.properties.kommNavn;
  kommuneLayer.setFeatureStyle(e.layer.feature.id, {
    color: '#9D78D2',
    weight: 1,
    opacity: 1,
    fill: true,
    fillColor: '#BD98F2',
    fillOpacity: 1.
  });
});

var allLayers = {
  Fylker: fylkeLayer,
  Kommuner: kommuneLayer
}

L.control.layers(allLayers,null, {
  collapsed: false
}).addTo(map);

L.DomUtil.get('tooltip').innerHTML = tooltipConten

var defaultOptions = {
    zoom: 9,
    center: [52.52, 13.42],
  };
  var initMap = function (opts) {
    // extend passed options with the default options#
    // if we pass { zoom : 12 }, options would be { zoom : 12, center : [52.52, 13.42] }
    var options = L.Util.extend(opts, defaultOptions);
    // initialize map
  };

  //https://webkid.io/blog/rarely-used-leaflet-features/

  // create div element with the class 'overlay' and append it to the body
L.DomUtil.create('div', 'overlay', document.body);
// create span element with the class 'title' without appending it
var title = L.DomUtil.create('span', 'title');
