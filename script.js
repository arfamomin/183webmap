mapboxgl.accessToken = 'pk.eyJ1IjoiYXJmYW1vbWluIiwiYSI6ImNscGwwYzZlMDAxaHgyanA1cWUzY2ExN3YifQ.z5jXdp6__K-B2oj1rpNOJw';

const map = new mapboxgl.Map({
    container: 'map',
    center: [-122.27, 37.87],
    zoom: 13,
    style: 'mapbox://styles/arfamomin/cmh9cuq2f00px01r5h1e5e1ss',
})

let hoveredID = null;

map.on("load", function() {
    map.addSource("points-data", {
        type: "geojson",
        data: "https://raw.githubusercontent.com/arfamomin/c183webmap/refs/heads/main/data/183data.geojson"
    })

    map.addLayer({
        id: "points-layer",
        type: 'circle',
        source: 'points-data',
        paint: {
            'circle-color': [
                'case', 
                ['boolean', ['feature-state', 'hover'], false],
                '#c01d1d',
                '#401dc0'
            ],
            'circle-radius': 5,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
        }
    })

    map.on("click", 'points-layer', (e) =>{
        const coordinates = e.features[0].geometry.coordinates.slice();
        const properties = e.features[0].properties;

        const popupContent = `
            <div>
                <h3>${properties.Landmark}</h3>
                <p><strong>Architect & Date:</strong> ${properties.Architect_amp_Date}</p>
                <p><strong>Designated:</strong> ${properties.Designated}</p>
            </div>
        `;

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(popupContent)
            .addTo(map);
    })

    map.on('mouseenter', 'points-layer', () => {
        map.getCanvas().style.cursor = 'pointer';
        if (e.features.length > 0) {

                if (hoveredId !== null) {
                    map.setFeatureState(
                        { source: 'points-data', id: hoveredID},
                        { hover: false }
                    );
                }
                hoveredID = e.features[0].id;
                map.setFeatureState(
                    { source: 'points-data', id: hoveredID },
                    { hover: true }
                );
            }
    });

    map.on('mouseleave', 'points-layer', () => {
        map.getCanvas().style.cursor = '';
        
        if (hoveredID !== null) {
            map.setFeatureState(
                { source: 'points-data', id: hoveredID },
                { hover: false }
            );
        }
        hoveredID = null;
    });
})