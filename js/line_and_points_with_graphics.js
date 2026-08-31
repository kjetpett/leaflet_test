var map = L.map('map', { tap: false }).setView([63.4305, 10.3951], 13);

var vectorKartLayer = L.esri.Vector.vectorTileLayer(
  'https://services.geodataonline.no/arcgis/rest/services/GeocacheVector/GeocacheBasis_WM/VectorTileServer'
);

var geocacheBilderLayer = L.esri.tiledMapLayer({
  url: 'https://services.geodataonline.no/arcgis/rest/services/Geocache_WMAS_WGS84/GeocacheBilder/MapServer',
  maxZoom: 19
}).addTo(map);

var activeBackgroundLayer = geocacheBilderLayer;

var backgroundToggleControl = L.control({ position: 'topright' });
backgroundToggleControl.onAdd = function () {
  var button = L.DomUtil.create('button', 'leaflet-bar background-toggle-button');
  button.type = 'button';

  var icon = L.DomUtil.create('img', '', button);

  function updateButton() {
    // The icon shows the basemap you switch to, not the one currently shown.
    if (activeBackgroundLayer === vectorKartLayer) {
      button.title = 'Vis flyfoto';
      icon.src = 'graphics/basemap_bilder.png';
    } else {
      button.title = 'Vis kart';
      icon.src = 'graphics/basemap_kart.png';
    }
  }

  L.DomEvent.disableClickPropagation(button);
  L.DomEvent.on(button, 'click', function () {
    map.removeLayer(activeBackgroundLayer);
    activeBackgroundLayer = activeBackgroundLayer === vectorKartLayer ? geocacheBilderLayer : vectorKartLayer;
    activeBackgroundLayer.addTo(map);
    updateButton();
  });

  updateButton();
  return button;
};
backgroundToggleControl.addTo(map);

// Source data is in EPSG:25833 (ETRS89 / UTM zone 33N), Leaflet needs WGS84.
proj4.defs('EPSG:25833', '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');

function toLatLng(coord) {
  var wgs84 = proj4('EPSG:25833', 'EPSG:4326', coord);
  return [wgs84[1], wgs84[0]];
}

function toLatLngRing(ring) {
  return ring.map(toLatLng);
}

function buildPopupContent(props) {
  var content = '<b>' + (props.popup_kort || '') + '</b>';
  if (props.popup_lang) {
    content += '<br>' + props.popup_lang;
  }
  return content;
}

// URL parameters: ?type=<value> filters features by their "type" property.
// ?punkt=0|1, ?linje=0|1, ?omraade=0|1 toggle layer visibility (default shown).
var urlParams = new URLSearchParams(window.location.search);
var typeFilter = urlParams.get('type');

function isLayerEnabled(name) {
  return urlParams.get(name) !== '0';
}

function matchesTypeFilter(props) {
  return !typeFilter || props.type === typeFilter;
}

// Expects the given property as a "#RRGGBB" hex string; falls back if missing/invalid.
function resolveColor(props, propName, fallback) {
  var hexColorPattern = /^#[0-9A-Fa-f]{6}$/;
  return hexColorPattern.test(props[propName]) ? props[propName] : fallback;
}

var pointLayer = L.layerGroup();
var lineLayer = L.layerGroup();
var omraadeLayer = L.layerGroup();

if (isLayerEnabled('punkt')) {
  pointLayer.addTo(map);
}
if (isLayerEnabled('linje')) {
  lineLayer.addTo(map);
}
if (isLayerEnabled('omraade')) {
  omraadeLayer.addTo(map);
}

Promise.all([
  fetch('geojson/punkt.geojson').then(function (res) { return res.json(); }),
  fetch('geojson/linje.geojson').then(function (res) { return res.json(); }),
  fetch('geojson/omraade.geojson').then(function (res) { return res.json(); })
]).then(function (results) {
  var punktData = results[0];
  var linjeData = results[1];
  var omraadeData = results[2];

  punktData.features.forEach(function (feature) {
    var props = feature.properties;
    if (!matchesTypeFilter(props)) {
      return;
    }

    var latlng = toLatLng(feature.geometry.coordinates);

    var icon = L.icon({
      iconUrl: props.ikon_url,
      iconSize: [42, 42],
      iconAnchor: [21, 21],
      popupAnchor: [0, -21],
      className: 'point-icon-frame'
    });

    var marker = L.marker(latlng, {
      icon: icon,
      zIndexOffset: 1000,
      riseOnHover: true
    })
      .bindPopup(buildPopupContent(props))
      .addTo(pointLayer);
  });

  linjeData.features.forEach(function (feature) {
    var props = feature.properties;
    if (!matchesTypeFilter(props)) {
      return;
    }

    var latlngs = feature.geometry.coordinates.map(toLatLng);
    L.polyline(latlngs, {
      color: '#e92020',
      weight: 4,
      dashArray: '5, 5',
      opacity: 0.9,
      lineJoin: 'round',
      interactive: false
    }).addTo(lineLayer);
  });

  omraadeData.features.forEach(function (feature) {
    var props = feature.properties;
    if (!matchesTypeFilter(props)) {
      return;
    }

    var latlngs = feature.geometry.coordinates.map(toLatLngRing);
    var polygon = L.polygon(latlngs, {
      color: resolveColor(props, 'linje_farge', '#333333'),
      fillColor: resolveColor(props, 'farge', '#1E88E5'),
      weight: 1,
      fillOpacity: 0.5
    })
      .bindPopup(buildPopupContent(props))
      .addTo(omraadeLayer);

    if (props.gruppe && map.hasLayer(omraadeLayer)) {
      L.marker(polygon.getCenter(), {
        icon: L.divIcon({
          className: 'omraade-label',
          html: props.gruppe,
          iconSize: null
        }),
        interactive: false
      }).addTo(omraadeLayer);
    }
  });

  var activeLayers = [];
  if (map.hasLayer(pointLayer)) {
    activeLayers = activeLayers.concat(pointLayer.getLayers());
  }
  if (map.hasLayer(lineLayer)) {
    activeLayers = activeLayers.concat(lineLayer.getLayers());
  }
  if (map.hasLayer(omraadeLayer)) {
    activeLayers = activeLayers.concat(omraadeLayer.getLayers());
  }

  var bounds = L.featureGroup(activeLayers).getBounds();
  if (bounds.isValid()) {
    map.fitBounds(bounds.pad(0.2));
  }
});
