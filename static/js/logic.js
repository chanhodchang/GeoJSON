// Add console.log to check to see if our code is working.
console.log("working");

// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	id: 'mapbox/streets-v11',
	accessToken: API_KEY
});

let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	id: 'mapbox/satellite-streets-v11',
	accessToken: API_KEY
});

let lights = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	id: 'mapbox/light-v10',
	accessToken: API_KEY
});

// Create the map object with center and zoom level.
let map = L.map('mapid', {
    center: [39.5,-98.5],
    zoom: 3,
    layers: [streets]
  });
  
// Create a base layer that holds both maps
let baseMaps = {
      'Streets': streets,
      'Satellite Streets': satelliteStreets,
      'Light': lights
};

// Create the earthquake layer for the map
let earthquakes = new L.LayerGroup();
let tectonicPlates = new L.LayerGroup();

// Create overlay to display earthquakes layer
let overlays = {
  'Earthquakes': earthquakes,
  'Tectonic Plates': tectonicPlates
};

// Add visibilty layer control to the map
L.control.layers(baseMaps, overlays).addTo(map);

// Accessing the Earthquakes GeoJSON URL.
let zipCodes = "../Resources2/us_census_zipcodes.geojson";

// Create a style for the lines.
let myStyle = {
    color: "blue",
    fillColor: 'yellow',
	weight: .5
}

// Grabbing GeoJSON data from zipcode data
d3.json(zipCodes).then(function(data) {
    console.log(data);
    L.geoJSON(data, {
        style: myStyle,
        onEachFeature: function(features, layer) {
            layer.bindPopup('<h3> ZCTA5: ' + features.properties.zcta5ce10);
        }
    }).addTo(map);
});

// This function determines the radius of the earthquake marker based on its magnitude.
// Earthquakes with a magnitude of 0 will be plotted with a radius of 1.
function getRadius(magnitude) {
    if (magnitude === 0) {
        return 1;
    }
    return magnitude * 4;
}

// This function determines the color of the circle based on the magnitude of the earthquake.
function getColor(magnitude) {
    if (magnitude > 5) {
    return '#ea2c2c';
    }
    if (magnitude > 4) {
    return '#ea822c';
    }
    if (magnitude > 3) {
    return '#ee9c00';
    }
    if (magnitude > 2) {
    return '#eecc00';   
    }
    if (magnitude > 1) {
    return '#d4ee00'
    }
    return '#98ee00'
}

// This function returns the style data for each of the earthquakes we plot on
// the map. We pass the magnitude of the earthquake into a function
// to calculate the radius.
function styleInfo(feature) {
    return {
    opacity: 1,
    fillOpacity: 1,
    fillColor: getColor(feature.properties.mag),
    color: "#000000",
    radius: getRadius(feature.properties.mag),
    stroke: true,
    weight: 0.5
    };
}