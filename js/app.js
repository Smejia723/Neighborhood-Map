/*global $ */
var map;
// Create a new blank array for all the listing markers.
var markers = [];

// Declaring Global clientID & secret
var clientID;
var clientSecret;

// database of for all the listings
var locations = [
    {
        title: 'Old Quebec',
        location: {lat: 46.8122, lng: -71.2065},
        content: '<div class="info_content">' +
        '<h3>Old Quebec</h3>' +
        '<p> Old Quebec is a historic neighbourhood of Quebec City,' +
        ' Quebec, Canada. Comprising the Upper Town and Lower Town,' +
        ' the area is a UNESCO World Heritage Site.' +
        ' - <b>Wikipedia</b></p>' +
        '</div>',
        VenueId:'53150dcae4b0e72a36ebae0c',
        url: 'https://en.wikipedia.org/wiki/Old_Quebec'
    },
    {
        title: 'Citadelle of Quebec',
        location: {lat: 46.8078, lng: -71.2069},
        content: '<div class="info_content">' +
        '<h3>Citadelle of Quebec</h3>' +
        '<p>The Citadelle of Quebec, also known as La Citadelle,' +
        'is an active military installation and official residence of both the ' +
        'Canadian monarch and the Governor General of Canada.' +
        ' - <b>Wikipedia</b></p>' +
        '</div>',
        VenueId: '4bed64929868a593c5495d46',
        url: 'https://en.wikipedia.org/wiki/Citadelle_of_Quebec'
    },
    {
        title: 'Château Frontenac',
        location: {lat: 46.8120, lng: -71.2050},
        content: '<div class="info_content">' +
        '<h3>Château Frontenac</h3>' +
        '<p>The Château Frontenac is one of Canada\'s grand railway hotels,' +
        ' located in Quebec City, Quebec.' +
        'It is operated as Fairmont Le Château Frontenac.'+
        ' - <b>Wikipedia</b></p>' +
        '</div>',
        VenueId:'4b697539f964a52028a32be3',
        url: 'https://en.wikipedia.org/wiki/Ch%C3%A2teau_Frontenac'
    },
    {
        title: 'Basilica of Sainte-Anne-de-Beaupré',
        location: {lat: 47.0248, lng: -70.9280},
        content: '<div class="info_content">' +
        '<h3>Basilica of Sainte-Anne-de-Beaupré</h3>' +
        '<p>The Basilica of Sainte-Anne-de-Beaupré is a basilica set along the Saint Lawrence River in Quebec,' +
        ' Canada, 30 kilometres east of Quebec City.' +
        ' It has been credited by the Catholic Church with many miracles of curing the sick and disabled.' +
        ' - <b>Wikipedia</b></p>' +
        '</div>',
        VenueId:'4bae4857f964a520f19c3be3',
        url: 'https://en.wikipedia.org/wiki/Basilica_of_Sainte-Anne-de-Beaupr%C3%A9'
    },
    {
        title: 'Montmorency Falls',
        location: {lat: 46.8908, lng: -71.1477},
        content: '<div class="info_content">' +
        '<h3>Montmorency Falls</h3>' +
        '<p>The Montmorency Falls is a large waterfall on the Montmorency River in Quebec, Canada.' +
        ' The falls are located on the boundary between the borough of Beauport, and Boischatel,' +
        ' about 12 km from the heart of old Quebec City.' +
        ' - <b>Wikipedia</b></p>' +
        '</div>',
        VenueId:'4e97050e29c2e086372ea60d',
        url: 'https://en.wikipedia.org/wiki/Montmorency_Falls'
    },
    {
        title: 'Observatoire de la Capitale',
        location: {lat: 46.8079, lng: -71.2181},
        content: '<div class="info_content">' +
        '<h3>Observatoire de la Capitale</h3>' +
        '<p>Viewing space on the 31st floor of the Marie-Guyart Building,' +
        ' the city\'s tallest skyscraper at 132m.' +
        ' - <b>Wikipedia</b></p>' +
        '</div>',
        VenueId:'4b4a1197f964a520907926e3',
        url:'https://en.wikipedia.org/wiki/%C3%89difice_Marie-Guyart'
    }
];


var ViewModel = function() {
    var self = this;

    this.locationsList = ko.observableArray(locations);

    this.title = ko.observableArray('');
    this.location = ko.observableArray('');
    this.content = ko.observableArray('');
    this.VenueId = ko.observableArray('');
    this.url = ko.observableArray(locations.wiki);

    var LargeInfowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();
    // the flowing group uses the location array to creat an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
        // get the position from the location array.
        position = locations[i].location;
        title = locations[i].title;
        content = locations[i].content;
        VenueId = locations[i].VenueId;
        // Create a marker per location, and put into markers array.
        marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            content: content,
            VenueId: VenueId,
            animation: google.maps.Animation.DROP,
            id: i
        });
        //identify Marker by location
        location.marker = marker;
        // push the marker to our array of markers.
        markers.push(marker);
        // Extend the Boundaries of the map for each Marker
        bounds.extend(marker.position);
        //create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function(){
            populateInfoWindow(this, LargeInfowindow);
        });
    }

    self.setClick = function(location){
        google.maps.event.trigger(location.marker, 'click')
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
            // add bounce
            marker.setAnimation(google.maps.Animation.BOUNCE);

            // FourSquare api
            var CLIENT_ID_Foursquare ='?client_id=AZZZH2MEFC5BGFHTCSY2UFTNEHMCMRNBDDAA2SFHE2NYDPJE'

            var CLIENT_SECRET_Foursquare = '&client_secret=YA255BIRGIDJPQ5R31KGMUZ34XCRVYW2FBIR1D3S1TRJ4ILZ'

            // Make AJAX request to Foursquare
            function foursquarePicture(){
                $.ajax({
                    type: "Get",
                    dataType: 'jsonp',
                    jsonp: "callback",
                    cache: false,
                    // to make call to Foursquare includes link, venueid of location,
                    // client id and secret and finally date of api update until date.
                    url: 'https://api.foursquare.com/v2/venues/' + marker.VenueId + '/photos' +
                    CLIENT_ID_Foursquare + CLIENT_SECRET_Foursquare + "&v=20182601",
                    success: function(response) {
                        console.log(response);
                        console.log(response.response);
                        var photo_data = response.response.photos.items[i] || "";
                        var pictureURL =  photo_data.prefix + '300x300' +  photo_data.suffix;
                        var picture =('<img class="bgimg" src="' + pictureURL +' "> ');
                        infowindow.setContent(
                            '<div>' + marker.content + '</div>' + '<div>' + picture + '</div>' +
                            '<img src="images/Powered-by-Foursquare-one-color-300.png" alt="">'
                            );
                        infowindow.open(map, marker);
                        if(!response.rating){
                            response.rating = 'no ratings in foursqare';
                        }
                    }
                });
            }
            // api request failed gives the user a responce.
            var foursquareRequestTimeout = setTimeout(function() {
            alert("Failed to load Foursquare photos");
            }, 3000);
            foursquarePicture();
            clearTimeout(foursquareRequestTimeout);
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

// This function calls on google map to open on your location designated.
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: {lat: 46.8139, lng: -71.2080}
    });
    ko.applyBindings(new ViewModel());
}