//Function for depth color
function depthColor(value){
    var myColor;
    if (value<10) myColor="#c3fe0f";
    else if (value>=10 && value <30)myColor="#fefe0f";
    else if (value>=30 && value <50)myColor="#fec30f";
    else if (value>=50 && value <70)myColor="#fe870f";
    else if (value>=70 && value <90)myColor="#fe4b0f";
    else {myColor="#ff0f0f"};

    return myColor;
}

// Creating map object
var myMap = L.map("map", {
    center: [35.7, -95.95],
    zoom: 4,
    });
  
// Adding tile layer to the map
var grayscale=L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
    }).addTo(myMap);

var sat=L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
    }).addTo(myMap);

var street=L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v10",
    accessToken: API_KEY
    }).addTo(myMap);
  
// Store API query variables
var baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var plates="PB2002_plates.json";
//call for tectonic plates if I do the optional part
/*d3.json(plates).then(function(response) {
    console.log(response);
});*/
  
// Grab the data with d3
d3.json(baseURL).then(function(response) {
  
    // Create a new marker cluster group
    var earthQuakeInfo=[];
    
    for (var i = 0; i < response.features.length; i++) {
        var location = response.features[i].geometry;
        var size = response.features[i].properties.mag;
        // Check for location property
        if (location) {
        // Add a new marker to the cluster group
        earthQuakeInfo.push({'location':[location.coordinates[1], location.coordinates[0]],
            'depth':location.coordinates[2],'size':size});
        };
    }

    // Loop through the earthquakes array and create one marker for each city object
    for (var i = 0; i < earthQuakeInfo.length; i++) {
    
        var me= L.circleMarker(earthQuakeInfo[i].location, {
            fillOpacity: 0.75,
            color: "black",
            fillColor: depthColor(earthQuakeInfo[i].depth),//calls the color function for depth
            weight: 1,
            // This will make our marker's size proportionate to magnitude
            radius: 2*(1.7*earthQuakeInfo[i].size),
         }).bindPopup("<h2>" + earthQuakeInfo[i].location + "</h2> <hr>" +"<h3>Magnitude: " + 
            earthQuakeInfo[i].size + "</h3>" +"<h3>Depth: " + 
            earthQuakeInfo[i].depth + "</h3>").addTo(myMap);
    };

    //Legend
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            depths = [-10, 10, 30, 50, 70, 90],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        div.innerHTML="<h4>Depth</h4>"
        for (var i = 0; i < depths.length; i++) {
            div.innerHTML +=
                '<i style="background:' + depthColor(depths[i] + 1) + '"></i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap);

    var baseLayers = {
        "Satellite": sat,
        "Streets": street,
        "Grayscale": grayscale
    };
    
    /*var overlays = {
        "Marker": marker,
        "Roads": roadsLayer
    };*/
    
    L.control.layers(baseLayers).addTo(myMap);

}); 