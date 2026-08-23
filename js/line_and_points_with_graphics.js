var map = L.map('map', { tap: false }).setView([63.4305, 10.3951], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// 10 points distributed around Trondheim city center.
var trondheimPoints = [
  [63.4305, 10.3951],
  [63.4324, 10.3872],
  [63.4363, 10.4021],
  [63.4386, 10.4108],
  [63.4269, 10.4150],
  [63.4208, 10.4071],
  [63.4187, 10.3962],
  [63.4229, 10.3848],
  [63.4293, 10.3792],
  [63.4349, 10.3898]
];

var iconFiles = [
  'Den_fireoyde_katten_fra_uffa.png',
  'Edvard_og_Embla_Ender.png',
  'Ella_Ekorn.png',
  'Harald_Hane.png',
  'Kora_Krake.png',
  'Maja_Maase.png',
  'Palle_Panda.png',
  'Rasmus_Rev.png',
  'Sofie_Svartlamoen-katt.png',
  'Ulva_og_Ulrian_Ulv.png'
];

var pointLayer = L.layerGroup().addTo(map);

trondheimPoints.forEach(function (latlng, index) {
  var icon = L.icon({
    iconUrl: 'graphics/' + iconFiles[index],
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    popupAnchor: [0, -36],
    className: 'point-icon-frame'
  });

  var marker = L.marker(latlng, {
    icon: icon,
    zIndexOffset: 1000,
    riseOnHover: true
  })
    .bindPopup('Point ' + (index + 1) + '<br>' + iconFiles[index])
    .addTo(pointLayer);

  marker.on('click touchstart', function (e) {
    L.DomEvent.stopPropagation(e);
    marker.openPopup();
  });
});

var lineLayer = L.polyline(trondheimPoints, {
  color: '#D32F2F',
  weight: 4,
  opacity: 0.9,
  lineJoin: 'round',
  interactive: false
}).addTo(map);

map.fitBounds(lineLayer.getBounds().pad(0.2));
