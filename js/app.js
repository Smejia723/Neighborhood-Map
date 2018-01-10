/*global $ */
var map;
    function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: {lat: 46.8139, lng: -71.2080}
    });
}


/*
                var geocoder = new google.maps.Geocoder();
                document.getElementById('submit').addEventListener('click', function() {
                geocodeAddress(geocoder, map);
                });
            }
        </script>
*/