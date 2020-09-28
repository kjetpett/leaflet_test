var map = L.map('map').setView([65, 10], 5);
var currentLayer;
var basisLayerURL = 'https://services.geodataonline.no/arcgis/rest/services/Geocache_WMAS_WGS84/GeocacheBasis/MapServer';
var bilderLayerURL = 'https://services.geodataonline.no/arcgis/rest/services/Geocache_WMAS_WGS84/GeocacheBilder/MapServer';
var landskapLayerURL = 'https://services.geodataonline.no/arcgis/rest/services/Geocache_WMAS_WGS84/GeocacheLandskap/MapServer';

settLayer(basisLayerURL);

document.querySelectorAll('input[name="layerRadio"]').forEach((elem) => {
  elem.addEventListener("change", function (event) {
    switch (event.target.value) {
      case 'basisLayer':
        settLayer(basisLayerURL);
        break;
      case 'bilderLayer':
        settLayer(bilderLayerURL);
        break;
      case 'landskapLayer':
        settLayer(landskapLayerURL);
        break;
    }
  });
});

function settLayer(url) {
  if (currentLayer) {
    map.removeLayer(currentLayer);
  }
  currentLayer = L.esri.tiledMapLayer({
    url: url,
    maxZoom: 18
  });
  currentLayer.addTo(map);
}