var map = L.map('map').setView([65, 10],5);
L.esri.basemapLayer('Topographic').addTo(map);
L.esri.featureLayer({
    url: 'https://trdetestarcgi01.miljodirektoratet.no/arcgis/rest/services/interne_tjenester/kommuner_fylker/MapServer/0'
  }).addTo(map);

  L.esri.featureLayer({
    url: 'https://trdetestarcgi01.miljodirektoratet.no/arcgis/rest/services/interne_tjenester/kommuner_fylker/MapServer/1'
  }).addTo(map);
  