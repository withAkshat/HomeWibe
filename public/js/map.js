
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/outdoors-v12', // style URL
    center: [77.2088, 28.6139], // starting position
    zoom: 13 // starting zoom
});

map.addControl(new mapboxgl.FullscreenControl());
    
