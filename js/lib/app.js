/*global $ */
var map;
// Create a new blank array for all the listing markers.
var markers = [];

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: {lat: 46.8139, lng: -71.2080}
    });

    // Locations I would want to visit while in the area that is shown on the map.
    // usually would be place in own database.
    var locations = [
        {title: 'Old Quebec', location: {lat: 46.8122, lng: -71.2065}},
        {title: 'Citadelle of Quebec', location: {lat: 46.8078, lng: -71.2069}},
        {title: 'Château Frontenac', location: {lat: 46.8120, lng: -71.2050}},
        {title: 'Basilica of Sainte-Anne-de-Beaupré', location: {lat: 47.0248, lng: -70.9280}},
        {title: 'Montmorency Falls', location: {lat: 46.8908, lng: -71.1477}},
        {title: 'Observatoire de la Capitale', location: {lat: 46.8079, lng: -71.2181}}
    ];

    // Info window content
    // usually would be place in own database with locations.
    var contentString = [
        {content: '<div class="info_content">' +
        '<h3>Old Quebec</h3>' +
        '<p> Old Quebec is a historic neighbourhood of Quebec City,' +
        ' Quebec, Canada. Comprising the Upper Town and Lower Town,' +
        ' the area is a UNESCO World Heritage Site. </p>' +
        '</div>'},
        {content: '<div class="info_content">' +
        '<h3>Citadelle of Quebec</h3>' +
        '<p>The Citadelle of Quebec, also known as La Citadelle,' +
        'is an active military installation and official residence of both the ' +
        'Canadian monarch and the Governor General of Canada.</p>' +
        '</div>'},
        {content: '<div class="info_content">' +
        '<h3>Château Frontenac</h3>' +
        '<p>The Château Frontenac is one of Canada\'s grand railway hotels,' +
        'located in Quebec City, Quebec.' +
        'It is operated as Fairmont Le Château Frontenac.</p>' +
        '</div>'},
        {content: '<div class="info_content">' +
        '<h3>Basilica of Sainte-Anne-de-Beaupré</h3>' +
        '<p>The Basilica of Sainte-Anne-de-Beaupré is a basilica set along the Saint Lawrence River in Quebec,' +
        ' Canada, 30 kilometres east of Quebec City.' +
        ' It has been credited by the Catholic Church with many miracles of curing the sick and disabled.</p>' +
        '</div>'},
        {content: '<div class="info_content">' +
        '<h3>Montmorency Falls</h3>' +
        '<p>The Montmorency Falls is a large waterfall on the Montmorency River in Quebec, Canada.' +
        ' The falls are located on the boundary between the borough of Beauport, and Boischatel,' +
        ' about 12 km from the heart of old Quebec City.</p>' +
        '</div>'},
        {content: '<div class="info_content">' +
        '<h3>Observatoire de la Capitale</h3>' +
        '<p>Viewing space on the 31st floor of the Marie-Guyart Building,' +
        ' the city\'s tallest skyscraper at 132m. </p>' +
        '</div>'}
    ];

    var LargeInfowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();
    // the flowing group uses the location array to creat an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
        // get the position from the location array.
        var position = locations[i].location;
        var title = locations[i].title;
        var content = contentString[i].content;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            content: content,
            animation: google.maps.Animation.DROP,
            id: i
        });
        // push the marker to our array of markers.
        markers.push(marker);
        // Extend the Boundaries of the map for each Marker
        bounds.extend(marker.position);
        //create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function(){
            populateInfoWindow(this, LargeInfowindow);
        });
    }
    map.fitBounds(bounds);

    document.getElementById('show-locations').addEventListener('click', showLocations);
    document.getElementById('hide-locations').addEventListener('click', hideLocations);

    // This Function populates the infowindow when the marker is clicked. We'll only allow
    // one infowindow which will open at the marker that is clicked, and populate based
    // on that markers position.
    function populateInfoWindow(marker, infowindow){
        // Check to make sure the infowindow is not already opened on this marker
        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            infowindow.setContent(marker.content);
            infowindow.open(map, marker);
            // add bounce
            marker.setAnimation(google.maps.Animation.BOUNCE);

            // Make sure the marker property is cleard if the infowindow is closed.
            infowindow.addListener('closeclick', function(){
                infowindow.marker = null;
                marker.setAnimation(null);
            });
        }
    }

    // This function will loop through the markers array and display them all.
    function showLocations() {
        var bounds = new google.maps.LatLngBounds();
        // Extend the boundaries of the map for each marker and display the marker
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
            bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);
    }
    // This function will loop through the listings and hide them all.
    function hideLocations() {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
    }
}
