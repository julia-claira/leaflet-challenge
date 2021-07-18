

//Functions
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
      fillColor: depthColor(earthQuakeInfo[i].depth),
      weight: 1,
      // Setting our circle's radius equal to the output of our markerSize function
      // This will make our marker's size proportionate to its population
      radius: 2*(1.4*earthQuakeInfo[i].size),
    }).addTo(myMap);//.bindPopup("<h1>" + cities[i].name + "</h1> <hr> <h3>Population: " + cities[i].population + "</h3>").addTo(myMap);
}

/*Setup*/


/*Legend specific*/
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70, 90],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + depthColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);

})