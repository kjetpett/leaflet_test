var map = L.map('map').setView([65, 10], 5);

var kommunerLayer;
var fylkeLayer;
var selectionLayer;

var layerGroup = L.layerGroup().addTo(map);

L.esri.tiledMapLayer({
    url: 'http://trdetestarcgi01.miljodirektoratet.no/arcgis/rest/services/interne_tjenester/kommuner_fylker_3857/MapServer',
    maxZoom: 15
  }).addTo(map);

var norgeLayer = L.esri.featureLayer({
    url: 'https://trdetestarcgi01.miljodirektoratet.no/arcgis/rest/services/interne_tjenester/kommuner_fylker/MapServer/0',
    // simplifyFactor: 1,
    precision: 5,
    // fields: ['OBJECTID','Land'],
    style: {
        color: '#999999',
        weight: 1,
        fill: true,
        fillColor: '#FFFFFF',
        fillOpacity: 1.0
    }
}).addTo(layerGroup);

selectionLayer = L.geoJSON(null, {
    style: {
        color: '#999999',
        weight: 1,
        fill: true,
        fillColor: '#88FF88',
        fillOpacity: 1.0
    }
});

selectionLayer.addTo(layerGroup);

map.on('mousemove', function (e) {
    L.esri.query({
        url: 'https://trdetestarcgi01.miljodirektoratet.no/arcgis/rest/services/interne_tjenester/kommuner_fylker/MapServer/0'
    })
        .nearby(e.latlng, 1)
        .run(function (error, result) {
            if (error) {
                return;
            }
            selectionLayer.clearLayers();
            selectionLayer.addData([result.features[0]]);
            // console.log(ids);
            // selectionLayer = L.geoJSON(features, {
            //     style: {
            //         color: '#999999',
            //         weight: 1,
            //         fill: true,
            //         fillColor: '#88FF88',
            //         fillOpacity: 1.0
            //     }
            // });
            // selectionLayer.addTo(layerGroup);

            // norgeLayer.setWhere('OBJECTID=' + ids[0], function (e){
        });
});





// L.esri.query({
//     url: 'https://trdetestarcgi01.miljodirektoratet.no/arcgis/rest/services/interne_tjenester/kommuner_fylker/MapServer/0'
// })
// .where('1=1')
// // .simplify(map,0.15)
// .run(function (error, features) {
//     if (error) {
//         return;
//     }
//     kommunerGeoJSONLayer = L.geoJSON(features, {
//         style: {
//             color: '#999999',
//             weight: 1,
//             fill: true,
//             fillColor: '#FFFFFF',
//             fillOpacity: 1.0
//           }
//     });
//     kommunerGeoJSONLayer.addTo(layerGroup);
//     //map.fitBounds(kommunerLayer.getBounds());
// });



// L.esri.query({
//     url: 'https://trdetestarcgi01.miljodirektoratet.no/arcgis/rest/services/interne_tjenester/kommuner_fylker/MapServer/1'
// }).where('1=1').run(function (error, features) {
//     if (error) {
//         return;
//     }
//     fylkerLayer =  L.geoJSON(features).addTo(map);
//     fylkerLayer.addTo(layerGroup);

//     map.fitBounds(fylkerLayer.getBounds());
// });