// Creating map object
var myMap = L.map("map", {
    center: [40.7, -95.95],
    zoom: 4
  });
  
  // Adding tile layer to the map
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);
  
  // Store API query variables
  var baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  //var date = "$where=created_date between'2016-01-01T00:00:00' and '2017-01-01T00:00:00'";
  //var complaint = "&complaint_type=Rodent";
  //var limit = "&$limit=10000";
  
  // Assemble API query URL
  //var url = baseURL + date + complaint + limit;
  
  // Grab the data with d3
  d3.json(baseURL).then(function(response) {
    console.log(response);
    // Create a new marker cluster group

    var earthQuakeInfo=[];
    // Loop through data
    for (var i = 0; i < response.features.length; i++) {
  
      // Set the data location property to a variable
      var location = response.features[i].geometry;
      var size = response.features[i].properties.mag;
  
      // Check for location property
      if (location) {
  
        // Add a new marker to the cluster group and bind a pop-up
        earthQuakeInfo.push({'location':[location.coordinates[1], location.coordinates[0]],
            'depth':location.coordinates[2],'size':size});
      };

  
    }
    console.log(earthQuakeInfo);
    // Loop through the cities array and create one marker for each city object
    for (var i = 0; i < earthQuakeInfo.length; i++) {
    
    L.circleMarker(earthQuakeInfo[i].location, {
      fillOpacity: 0.75,
      color: "black",
      fillColor: "purple",
      weight: 1,
      // Setting our circle's radius equal to the output of our markerSize function
      // This will make our marker's size proportionate to its population
      radius: 2*(1.4*earthQuakeInfo[i].size),
    }).addTo(myMap);//.bindPopup("<h1>" + cities[i].name + "</h1> <hr> <h3>Population: " + cities[i].population + "</h3>").addTo(myMap);
}
})
/*
    // Set up the legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      var limits = geojson.options.limits;
      var colors = geojson.options.colors;
      var labels = [];
  
      // Add min & max
      var legendInfo = "<h1>Median Income</h1>" +
        "<div class=\"labels\">" +
          "<div class=\"min\">" + limits[0] + "</div>" +
          "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
        "</div>";
  
      div.innerHTML = legendInfo;*/