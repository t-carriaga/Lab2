mapboxgl.accessToken = 'pk.eyJ1IjoidGNhcnJpYWdhIiwiYSI6ImNta3lqMmN0YTA3eTMzZm9qaWwzcDN4dG8ifQ.FhKRFFY4h0NDKwgglg1J6w';

const map = new mapboxgl.Map({
	container: 'my-map', // map container ID
	style: 'mapbox://styles/tcarriaga/cml8ikct8000f01sagb0iebdc', // style URL
	center: [14, 5], // starting position [lng, lat]
	zoom: 2, // starting zoom
});

const Country_popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
    offset: [0, -20]
})

let hoveredPolygonId = null;

map.on('load', () => {

const popup = new mapboxgl.Popup({ closeOnClick: false })
    .setLngLat([14, 5])
    .setHTML(
                '<h1>African Countries and Capital Cities</h1><p>Hover Above Each Country to learn their Names!</p>')
    .addTo(map);

 map.addSource('Capital-Cities', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/t-carriaga/Lab2/main/data/World_Cities2.geojson',
        promoteId: 'OBJECTID'
        // Format for raw data link in online repo whilst still working on website - 'https://raw.githubusercontent.com/yourusername/respoitoryname/main/yourfile.geojson'
        // Update to following format once website is published - //'https://yourusername.github.io/repositoryname/yourfile.geojson'
    });

 map.addSource('Countries', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/t-carriaga/Lab2/main/data/Africa_Boundaries.geojson',
        promoteId: 'OBJECTID'
        // Format for raw data link in online repo whilst still working on website - 'https://raw.githubusercontent.com/yourusername/respoitoryname/main/yourfile.geojson'
        // Update to following format once website is published - //'https://yourusername.github.io/repositoryname/yourfile.geojson'
    });

// 2. VISUALIZE DATA LAYERS
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
                    0.25
                ]
        }
    });

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

        map.on('mouseleave', 'Countries-fills', () => {
        if (hoveredPolygonId !== null) {
            map.setFeatureState(
                { source: 'Countries', id: hoveredPolygonId },
                { hover: false }
            );
        hoveredPolygonId = null;
        }
    });

    // 3. VISUALIZE COUNTRY HOVERS
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

        map.on('mouseleave', 'Countries-fills', () => {
        if (hoveredPolygonId !== null) {
            map.setFeatureState(
                { source: 'Countries', id: hoveredPolygonId },
                { hover: false }
            );
        }
        hoveredPolygonId = null;
        });

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

        // Use a standard Mapbox GL JS event listener for mouseleave to hide the popup
        map.on('mouseleave', 'Countries-fills', () => {
            Country_popup.remove();
        });

});






