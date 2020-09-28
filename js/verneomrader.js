var map = L.map('map').setView([66, 17], 5);
var oldId, selectedFeature;
var layerGroup = L.layerGroup().addTo(map);

var norgeLayer = L.esri.featureLayer({
    url: 'https://services1.arcgis.com/ThExf1r1eIhz35uv/arcgis/rest/services/Norge_3857/FeatureServer/0',
    // OnPrem server url: 'https://trdetestarcgi01.miljodirektoratet.no/arcgis/rest/services/interne_tjenester/kommuner_fylker_3857/MapServer/2',
    simplifyFactor: 0.35,
    fields: ['OBJECTID', 'Land'],
    style: {
        color: '#AAAAAA',
        weight: 1,
        fill: true,
        fillColor: '#FFFFFF',
        fillOpacity: 1.0
    }
}).addTo(layerGroup);

var verneomradeLayer = L.esri.featureLayer({
    url: 'https://kart.miljodirektoratet.no/arcgis/rest/services/vern/MapServer/0',
    simplifyFactor: 0.35,
    fields: ['OBJECTID', 'navn', 'verneform', 'offisieltNavn', 'naturvernId'],
    style: function (feature) {
        if (feature.properties.verneform === 'Nasjonalpark') {
            return {
                fillColor: '#65C922',
                color: '#50A000',
                fillOpacity: 1,
                weight: 1
            };
        } else {
            return {
                fillColor: '#45B0B0',
                color: '#4A7F7F',
                fillOpacity: 1, weight: 1
            };
        }
    },
    where: "verneform = 'Nasjonalpark'"
}).addTo(layerGroup);

verneomradeLayer.on('mouseout', function (e) {
    if (e.layer.feature.id != selectedFeature) {
        verneomradeLayer.resetFeatureStyle(oldId);
    }
});

verneomradeLayer.on('mouseover', function (e) {
    oldId = e.layer.feature.id;
    document.getElementById('info-pane').innerHTML = e.layer.feature.properties.navn;
    if (e.layer.feature.id != selectedFeature) {
        verneomradeLayer.setFeatureStyle(e.layer.feature.id, {
            color: '#000000',
            fillColor: '#DF0000'
        })
    }
});

verneomradeLayer.on('click', function (e) {
    verneomradeLayer.resetFeatureStyle(selectedFeature);
    map.fitBounds(e.layer.getBounds()); //evt bruk flyToBounds
    if (e.layer.feature.id != selectedFeature) {
        verneomradeLayer.setFeatureStyle(e.layer.feature.id, {
            fillColor: '#FFFF00'
        });
        selectedFeature = e.layer.feature.id;
        p = e.layer.feature.properties;
        document.getElementById('details-pane').innerHTML = 
            '<b>' + p.offisieltNavn + '</b><br>' +
            'https://faktaark.naturbase.no?id=' + p.naturvernId;
    } else {
        verneomradeLayer.resetFeatureStyle(selectedFeature);
        selectedFeature = null;
    }
});

document.querySelectorAll('input[name="layerRadio"]').forEach((elem) => {
    elem.addEventListener("change", function (event) {
        switch (event.target.value) {
            case 'nasjonalparkLayer':
                verneomradeLayer.setWhere("verneform = 'Nasjonalpark'");
                break;
            case 'landskapsvernLayer':
                verneomradeLayer.setWhere("verneform = 'Landskapsvernomraade'");
                break;
        }
    });
});