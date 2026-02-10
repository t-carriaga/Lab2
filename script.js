mapboxgl.accessToken = 'pk.eyJ1IjoidGNhcnJpYWdhIiwiYSI6ImNta3lqMmN0YTA3eTMzZm9qaWwzcDN4dG8ifQ.FhKRFFY4h0NDKwgglg1J6w';

const map = new mapboxgl.Map({
	container: 'my-map', // map container ID
	style: 'mapbox://styles/mapbox/standard', // style URL
	center: [-79.39, 43.66], // starting position [lng, lat]
	zoom: 12, // starting zoom
});

// Add a data source from a GeoJSON file
map.addSource('buildings-data', {
    type: 'geojson',
    data: 'C:\Users\tyler\OneDrive\Documents\GGR472\Lab 2\data\Africa_Boundaries.geojson' // Your URL to your buildings.geojson file
});
map.addLayer({
    'id': 'buildings-point',
    'type': 'circle',
    'source': 'buildings-data',
    'paint': {
        'circle-radius': 5,
        'circle-color': '#007cbf'
}
});
