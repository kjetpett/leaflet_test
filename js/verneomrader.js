var map = L.map('map').setView([66, 17], 5);
var oldId, selectedFeature;

map.createPane('bakgrunnskart');
var norgeLayer = L.esri.featureLayer({
    url: 'https://services1.arcgis.com/ThExf1r1eIhz35uv/arcgis/rest/services/Norge_3857/FeatureServer/0',
    // OnPrem server url: 'https://trdetestarcgi01.miljodirektoratet.no/arcgis/rest/services/interne_tjenester/kommuner_fylker_3857/MapServer/2',
    pane: 'bakgrunnskart',
    simplifyFactor: 0.35,
    fields: ['OBJECTID', 'Land'],
    style: {
        color: '#AAAAAA',
        weight: 1,
        fill: true,
        fillColor: '#FFFFFF',
        fillOpacity: 1.0
    }
}).addTo(map);

map.createPane('verneomrade'); //pane bestemmer tegnerekkefølgen
var verneomradeLayer = L.esri.featureLayer({
    url: 'https://kart.miljodirektoratet.no/arcgis/rest/services/vern/MapServer/0',
    pane: 'verneomrade',
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
                fillOpacity: 1, 
                weight: 1
            };
        }
    },
    where: "verneform = 'Nasjonalpark'"
}).addTo(map);

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
    map.fitBounds(e.layer.getBounds().pad(2)); //evt bruk flyToBounds
    if (e.layer.feature.id != selectedFeature) {
        p = e.layer.feature.properties;
        
        verneomradeLayer.setFeatureStyle(e.layer.feature.id, {
            fillColor: '#FFFF00'
        });        
        
        document.getElementById('details-pane').innerHTML = 
            '<b>' + p.offisieltNavn + '</b><br><br>' + '<a href = "https://faktaark.naturbase.no?id=' + p.naturvernId + '" target="_blank">Faktaark</a><br>';

        var find = L.esri.find({
            url: 'https://arcgis03.miljodirektoratet.no/arcgis/rest/services/faktaark/vern/MapServer',
        });
        find.layers('0').text(p.naturvernId).fields('naturvernId').returnGeometry(false);
        find.run(function (err, featureColl, response) {
            if (err) {
                console.log(err);
                return;
            }
            if (featureColl.features[0].properties.Generelt.toLowerCase() != 'null') {
                document.getElementById('details-pane').innerHTML += featureColl.features[0].properties.Generelt.substring(0,500) + '...';
            }
        });

        selectedFeature = e.layer.feature.id;
        
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
