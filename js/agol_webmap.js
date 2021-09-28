// to draw a different webmap, just append its id instead
// webmap.html?id=d143b33f1a02421d86b6a4ca1d7b7cd0

// var webmapId = 'd143b33f1a02421d86b6a4ca1d7b7cd0'; // Default WebMap ID
var webmapId = '616a7cc9a0f84ee98b48ce1aee1420fe'; // Foreslått vern

// getIdfromUrl();

var webmap = L.esri.webMap(webmapId, { map: L.map('map') });

webmap.on('load', function () {
    var overlayMaps = {};
    webmap.layers.forEach(function (l) {
        overlayMaps[l.title] = l.layer;
    });
    L.control.layers({}, overlayMaps, {
        position: 'bottomleft'
    }).addTo(webmap._map);
});

// function getIdfromUrl() {
//     var urlParams = location.search.substring(1).split('&');
//     for (var i = 0; urlParams[i]; i++) {
//         var param = urlParams[i].split('=');
//         if (param[0] === 'vernRestriksjonId') {
//             webmapId = param[1];
//         }
//     }
// }