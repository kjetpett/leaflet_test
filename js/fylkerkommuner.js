var map = L.map('map').setView([65, 10], 5);
var oldId, selectedFeature, kommuneLayer;
var layerGroup = L.layerGroup().addTo(map);

var kommuneFylkeStil = {
  color: '#AAAAAA',
  weight: 1,
  fill: true,
  fillColor: '#FFFFFF',
  fillOpacity: 1.0
} 

fylkeLayer = L.esri.featureLayer({
  url: 'https://services1.arcgis.com/ThExf1r1eIhz35uv/arcgis/rest/services/Fylker_3857/FeatureServer/0',
  // On-prem server url: 'https://trdetestarcgi01.miljodirektoratet.no/arcgis/rest/services/interne_tjenester/kommuner_fylker_3857/MapServer/1',
  simplifyFactor: 0.35,
  fields: ['OBJECTID', 'fylkeNavn'],
  style: kommuneFylkeStil
});

fylkeLayer.on('mouseout', function (e) {
  if (e.layer.feature.id != selectedFeature) {
    fylkeLayer.resetFeatureStyle(oldId);
  }
});

fylkeLayer.on('click', function (e) {
  fylkeLayer.resetFeatureStyle(selectedFeature);
  map.fitBounds(e.layer.getBounds()); //evt bruk flyToBounds
  if (e.layer.feature.id != selectedFeature) {
    fylkeLayer.setFeatureStyle(e.layer.feature.id, {
      fillColor: '#FFFF00'
    });
    selectedFeature = e.layer.feature.id;
  } else {
    fylkeLayer.resetFeatureStyle(selectedFeature);
    selectedFeature = null;
  }
});

fylkeLayer.on('mouseover', function (e) {
  oldId = e.layer.feature.id;
  document.getElementById('info-pane').innerHTML = e.layer.feature.properties.fylkeNavn;
  if (e.layer.feature.id != selectedFeature) {
    fylkeLayer.setFeatureStyle(e.layer.feature.id, {
      fillColor: '#BD98F2'
    })
  }
});

kommuneLayer = L.esri.featureLayer({
  url: 'https://services1.arcgis.com/ThExf1r1eIhz35uv/arcgis/rest/services/Kommuner_3857/FeatureServer/0',
  // On-prem server url: 'https://trdetestarcgi01.miljodirektoratet.no/arcgis/rest/services/interne_tjenester/kommuner_fylker/MapServer/0',
  simplifyFactor: 0.35,
  fields: ['OBJECTID', 'kommNavn'],
  style: kommuneFylkeStil
}).addTo(layerGroup);

kommuneLayer.on('mouseout', function (e) {
  if (e.layer.feature.id != selectedFeature) {
    kommuneLayer.resetFeatureStyle(oldId);
  }
});

kommuneLayer.on('click', function (e) {
  kommuneLayer.resetFeatureStyle(selectedFeature);
  map.fitBounds(e.layer.getBounds().pad(2));
  if (e.layer.feature.id != selectedFeature) {
    kommuneLayer.setFeatureStyle(e.layer.feature.id, {
      fillColor: '#FFFF00'
    });
    selectedFeature = e.layer.feature.id;
  } else {
    kommuneLayer.resetFeatureStyle(selectedFeature);
    selectedFeature = null;
  }
});

kommuneLayer.on('mouseover', function (e) {
  oldId = e.layer.feature.id;
  document.getElementById('info-pane').innerHTML = e.layer.feature.properties.kommNavn;
  if (e.layer.feature.id != selectedFeature) {
    kommuneLayer.setFeatureStyle(e.layer.feature.id, {
      fillColor: '#55f255'
    })
  }
});

document.querySelectorAll('input[name="layerRadio"]').forEach((elem) => {
  elem.addEventListener("change", function(event) {
    switch (event.target.value) {
      case 'fylkeLayer':
        layerGroup.removeLayer(L.stamp(kommuneLayer));
        fylkeLayer.addTo(layerGroup);
        break;
      case 'kommuneLayer':
        layerGroup.removeLayer(L.stamp(fylkeLayer));
        kommuneLayer.addTo(layerGroup);
        break;
    }
  });
});