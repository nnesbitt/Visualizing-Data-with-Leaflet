var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
d3.json (url, function(data){ 
    createFeatures(data.features); 

});
function getcolor(mag){
    return mag >= 5  ? '#B10026' :
            mag >= 4  ? '#e31a1c' :
            mag >= 3  ? '#fc4e2a' :
            mag >= 2  ? '#fd8d3c' :
            mag >= 1  ? '#feb24c' :
                    '#fed976';
}
function createFeatures(earthquakeData) {
    earthquakeMarkers = []
    for (var i = 0; i < earthquakeData.length; i++) {
      earthquakeMarkers.push(
        L.circle([earthquakeData[i].geometry.coordinates[1],earthquakeData[i].geometry.coordinates[0]], {
          stroke: false,
          fillOpacity: 0.75,
          color: getcolor(earthquakeData[i].properties.mag),
          fillColor: getcolor(earthquakeData[i].properties.mag),
          radius: Math.pow(earthquakeData[i].properties.mag,3) * 1000
        }).bindPopup("<h3>" + earthquakeData[i].properties.place +
        "</h3><hr>Magnitude: " + earthquakeData[i].properties.mag +
        "<p>" + new Date(earthquakeData[i].properties.time) + "</p>")
      );
    }
    createMap(earthquakeMarkers);
  }
  function createMap(earthquakeMarkers) {
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token= ENTER API KEY");
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token= ENTER API KEY");
    
    var baseMaps = {
       "Street Map": streetmap,
       "Dark Map": darkmap
     };
    var significantEarthquakes = L.layerGroup(earthquakeMarkers);
    var overlayMaps = {
      "Earthquakes": significantEarthquakes
    };
    var myMap = L.map("map", {
      center: [
        37.09, -120.105
      ],
      zoom: 4,
      layers: [darkmap, significantEarthquakes]
    });
     L.control.layers(baseMaps, overlayMaps, {
       collapsed: false
     }).addTo(myMap);
    var legend = L.control({position: 'bottomright'});  
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
        magnitudes = [0, 1, 2, 3, 4, 5],
        labels = [];
        div.innerHTML = "Magnitude<br>"
        for (var i = 0; i < magnitudes.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getcolor(magnitudes[i]) + '"></i> ' +
                magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
    }  
    return div;
    };  
    legend.addTo(myMap);
  var title = L.control()
  title.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info'); 
      div.innerHTML = "Earthquakes which occurred in the last 7 Days"
      return div;
  };
  title.addTo(myMap);
  }