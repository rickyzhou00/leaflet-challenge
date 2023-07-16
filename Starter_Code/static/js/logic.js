var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5 
  });
  
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
  // Fetch data
  d3.json(
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
  ).then(function(data) {
    data.features.forEach(function(feature) {

        var lat = feature.geometry.coordinates[1];
      var lon = feature.geometry.coordinates[0];
  
      var marker = L.circleMarker([lat, lon], {
        radius: getMarkerSize(feature.properties.mag),
        color: "black",
        weight: 1,
        fillOpacity: 0.8,
        fillColor: getMarkerColor(feature.geometry.coordinates[2])
      }).addTo(myMap);
  
      marker.bindPopup(
        "Magnitude: " +
          feature.properties.mag +
          "<br>Depth: " +
          feature.geometry.coordinates[2] +
          " km"
      );
    });
  
    function getMarkerSize(magnitude) {
      return magnitude * 3;
    }
  
    function getMarkerColor(depth) {
        if (depth < 10) {
            return "#C1FFC1"; // Light green for shallow earthquakes
        } else if (depth < 30) {
            return "#00FF00"; // Green for medium-depth earthquakes
        } else if (depth < 50) {
            return "#FFFF00"; // Yellow for earthquakes with depth between 30 and 50
        } else if (depth < 70) {
            return "#FFC04D"; // Light Orange for earthquakes with depth between 50 and 70
        } else if (depth < 90) {
            return "#FFA500"; // Orange for earthquakes with depth between 70 and 90
        } else {
            return "#FF0000"; // Red for deep earthquakes with depth greater than or equal to 90
        }
    }
  
  
    var legend = L.control({ position: "bottomright" });
  
    legend.onAdd = function(map) {
      var div = L.DomUtil.create("div", "legend");
      var depths = [-10, 10, 30, 50, 70, 90];
      var labels = [];
  
      for (var i = 0; i < depths.length; i++) {
        div.innerHTML +=
          '<i style="background:' +
          getMarkerColor(depths[i] + 1) +
          '"></i> ' +
          depths[i] +
          (depths[i + 1] ? "&ndash;" + depths[i + 1] + "<br>" : "+");
      }
  
      return div;
    };
  
    legend.addTo(myMap);
  });
  