var map = L.map('map', { tap: false }).setView([63.4305, 10.3951], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Source data is in EPSG:25833 (ETRS89 / UTM zone 33N), Leaflet needs WGS84.
proj4.defs('EPSG:25833', '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');

function toLatLng(coord) {
  var wgs84 = proj4('EPSG:25833', 'EPSG:4326', coord);
  return [wgs84[1], wgs84[0]];
}

var pointLayer = L.layerGroup().addTo(map);
var lineLayer = L.layerGroup().addTo(map);

Promise.all([
  fetch('geojson/punkt.geojson').then(function (res) { return res.json(); }),
  fetch('geojson/linje.geojson').then(function (res) { return res.json(); })
]).then(function (results) {
  var punktData = results[0];
  var linjeData = results[1];

  punktData.features.forEach(function (feature) {
    var latlng = toLatLng(feature.geometry.coordinates);
    var props = feature.properties;

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
      .bindPopup(props.beskrivelse || '')
      .addTo(pointLayer);

    marker.on('click touchstart', function (e) {
      L.DomEvent.stopPropagation(e);
      marker.openPopup();
    });
  });

  linjeData.features.forEach(function (feature) {
    var latlngs = feature.geometry.coordinates.map(toLatLng);
    L.polyline(latlngs, {
      color: '#D32F2F',
      weight: 4,
      opacity: 0.9,
      lineJoin: 'round',
      interactive: false
    }).addTo(lineLayer);
  });

  var bounds = L.featureGroup([pointLayer, lineLayer]).getBounds();
  if (bounds.isValid()) {
    map.fitBounds(bounds.pad(0.2));
  }
});
