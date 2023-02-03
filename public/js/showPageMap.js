mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/outdoors-v12', // style URL
    center: langLat, // starting position [lng, lat]
    zoom: 9, // starting zoom
});

const nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-left');

const popup = new mapboxgl.Popup({ offset: 25 })
    .setHTML(
        `<h4>${campground.title}</h4><p>${campground.location}</p>`
    )
    

const marker1 = new mapboxgl.Marker({ color: 'black', rotation: 45, draggable: true })
    .setLngLat(langLat)
    .setPopup(popup)
    .addTo(map);