var map = L.map('map').setView([63, 11], 9);
var basisLayerURL = 'https://services.geodataonline.no/arcgis/rest/services/Geocache_WMAS_WGS84/GeocacheBasis/MapServer';
var geomapPostLayerURL = 'https://services.geodataonline.no/arcgis/rest/services/Geomap_UTM33_EUREF89/GeomapPost/FeatureServer/6';
var token = 'kOEi8NRpauNEckcTlzOkpK4KhXvfpXhDMmi9mxnLm3RMTJ7418USeUDAb_cgldVu'; // Lag din egen token på https://services.geodataonline.no/arcgis/tokens/ (request ip)
var selectedFeature, oldId;

basisLayer = L.esri.tiledMapLayer({
  url: basisLayerURL,
  maxZoom: 18
}).addTo(map);

var geomapPostFeatureLayer = L.esri.featureLayer({
  url: geomapPostLayerURL,
  token: token,
  where: '1=1',
  minZoom: 9
}).addTo(map);

geomapPostFeatureLayer.on('click', function (e) {
  document.getElementById('info-pane').innerHTML = 
    'Postnr:' + e.layer.feature.properties.post_id + ' Poststed: ' + e.layer.feature.properties.poststed + '<br>' +
    'Kommunenr: ' + e.layer.feature.properties.komm_id + '<br>' +
    'Lengdegrad/Breddegrad: ' + e.latlng.lng + '/' + e.latlng.lat
});
