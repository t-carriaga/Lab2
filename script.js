mapboxgl.accessToken = 'pk.eyJ1IjoidGNhcnJpYWdhIiwiYSI6ImNta3lqMmN0YTA3eTMzZm9qaWwzcDN4dG8ifQ.FhKRFFY4h0NDKwgglg1J6w';

const map = new mapboxgl.Map({
	container: 'my-map', // map container ID
	style: 'mapbox://styles/tcarriaga/cml8ikct8000f01sagb0iebdc', // style URL
	center: [14, 5], // starting position [lng, lat]
	zoom: 2, // starting zoom
});

//Pop Up Set Up
const Country_popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
    offset: [0, -20]
})

let hoveredPolygonId = null;

map.on('load', () => {

 //Opens Pop up when website is launched   
const popup = new mapboxgl.Popup({ closeOnClick: false })
    .setLngLat([14, 5])
    .setHTML(
                '<h1>African Countries and Capital Cities</h1><p>Hover Above Each Country to learn their Names!</p>')
    .addTo(map);

//Adds Global Capital City Points Data
 map.addSource('Capital-Cities', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/t-carriaga/Lab2/main/data/Capital_Cities.geojson',
        // Format for raw data link in online repo whilst still working on website - 'https://raw.githubusercontent.com/yourusername/respoitoryname/main/yourfile.geojson'
        // Update to following format once website is published - //'https://yourusername.github.io/repositoryname/yourfile.geojson'
    });

//Adds Country Point Data
 map.addSource('Countries', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/t-carriaga/Lab2/main/data/Africa_Boundaries.geojson',
        promoteId: 'OBJECTID'
        // Format for raw data link in online repo whilst still working on website - 'https://raw.githubusercontent.com/yourusername/respoitoryname/main/yourfile.geojson'
        // Update to following format once website is published - //'https://yourusername.github.io/repositoryname/yourfile.geojson'
    });

// 2. VISUALIZE DATA LAYERS
    // Visualizes City Points
    map.addLayer({
        id: 'Cities-Circles',
        type: 'circle',
        source: 'Capital-Cities',
        paint: {
            'circle-radius': 5,
            'circle-color': 'red',
            "circle-stroke-color": "white", 
            "circle-stroke-width": 2,
        }
    });
    // Visualizes Country Polygons
    map.addLayer({
        id: 'Countries-fills',
        type: 'fill',
        source: 'Countries',
        layout: {},
        paint: {
                'fill-color': 'green',
                'fill-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    1,
                    0.25 // This Boolean will set up the change the opacity of the circle when hovered t
                    //Adapted From: https://docs.mapbox.com/mapbox-gl-js/example/hover-styles/
                ]
        }
    });

    // Visualizes Country Borders
    map.addLayer({
        'id': 'Countries-borders',
        'type': 'line',
        'source': 'Countries',
        'layout': {},
        'paint': {
            'line-color': 'green',
            'line-width': 2
        }
    });

    //3. DETECT WHEN MOUSE HOVERS COUNTRY
         // Identifies whey mouse cursor is above a country, then changes "hoveredPolygonId" to change opacity later
        map.on('mousemove', 'Countries-fills', (e) => {
    if (e.features.length > 0) {
        if (hoveredPolygonId !== null) {
            map.setFeatureState(
                { source: 'Countries', id: hoveredPolygonId },
                { hover: false }
            );
        }
        hoveredPolygonId = e.features[0].id;
        map.setFeatureState(
            { source: 'Countries', id: hoveredPolygonId },
            { hover: true }
        );
    }
    });
        //When the cursor crosess a border to a new country, returns  "hoveredPolygonId" to normal
        map.on('mouseleave', 'Countries-fills', () => {
        if (hoveredPolygonId !== null) {
            map.setFeatureState(
                { source: 'Countries', id: hoveredPolygonId },
                { hover: false }
            );
        hoveredPolygonId = null;
        }
    });

    // 4. VISUALIZE COUNTRY HOVERS
        //Shows Change In Opacity When Hovered
        map.on('mousemove', 'Countries-fills', (e) => {
        if (e.features.length > 0) {
        if (hoveredPolygonId !== null) {
            map.setFeatureState(
                { source: 'Countries', id: hoveredPolygonId },
                { hover: false }
            );
        }
        hoveredPolygonId = e.features[0].id;
        map.setFeatureState(
            { source: 'Countries', id: hoveredPolygonId },
            { hover: true }
        );
        }
        });

        //Shows Return to Normal Opacity
        map.on('mouseleave', 'Countries-fills', () => {
        if (hoveredPolygonId !== null) {
            map.setFeatureState(
                { source: 'Countries', id: hoveredPolygonId },
                { hover: false }
            );
        }
        hoveredPolygonId = null;
        });

        //Shows Country Label
        // Adapted From: https://docs.mapbox.com/mapbox-gl-js/example/hover-tooltip/
        map.addInteraction('Country-fills-mousemove', {
        type: 'mousemove',
        target: {
            layerId: 'Countries-fills'
            },
            handler: (e) => {
                // Position the popup at the cursor location and show it
                Country_popup
                    .setLngLat(e.lngLat)
                    .setHTML(
                        `<strong>${e.feature.properties.NAME_0}</strong>`
                    )
                    .addTo(map);
            }
        });

        // Remove Vountry Label
        map.on('mouseleave', 'Countries-fills', () => {
            Country_popup.remove();
        });

});






