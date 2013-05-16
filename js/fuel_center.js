var map,
    currentPosition,
    directionsDisplay, 
    directionsService;
    var map, places, iw;
    var markers = [];
    var autocomplete;

    function initialize(lat, lon)
    {
         $('#map_canvas').css({height:(screen.height-200)}); 
        directionsDisplay = new google.maps.DirectionsRenderer(); 
        directionsService = new google.maps.DirectionsService();

        currentPosition = new google.maps.LatLng(lat, lon);

        map = new google.maps.Map(document.getElementById('map_canvas'), {
           zoom: 15,
           center: currentPosition,
           mapTypeId: google.maps.MapTypeId.ROADMAP
         });

        places = new google.maps.places.PlacesService(map);

        directionsDisplay.setMap(map);

         var currentPositionMarker = new google.maps.Marker({
            position: currentPosition,
            map: map,
            title: "Current position"
        });

        var infowindow = new google.maps.InfoWindow();
        google.maps.event.addListener(currentPositionMarker, 'click', function() {
            infowindow.setContent("Current position: latitude: " + lat +" longitude: " + lon);
            infowindow.open(map, currentPositionMarker);
        });

        google.maps.event.addListener(map, 'tilesloaded', function(){
            google.maps.event.clearListeners(map, 'tilesloaded');
            google.maps.event.addListener(map, 'zoom_changed', search);
            google.maps.event.addListener(map, 'dragend', search);
            search();
        });


    }

    function locError(error) {
        // initialize map with a static predefined latitude, longitude
       initialize(59.3426606750, 18.0736160278);
    }

    function locSuccess(position) {
        initialize(position.coords.latitude, position.coords.longitude);
    }

    function calculateRoute(destiny) {                
        var targetDestination = destiny;                    
        if (currentPosition && currentPosition != '' && targetDestination && targetDestination != '') {
            var request = {
                origin:currentPosition, 
                destination:targetDestination,
                travelMode: google.maps.DirectionsTravelMode["DRIVING"]
            };

            directionsService.route(request, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setPanel(document.getElementById("directions_inner"));
                    directionsDisplay.setOptions( {
                         suppressMarkers: true ,
                         preserveViewport: true,
                          draggable: true,
                          suppressInfoWindows: false
                     } );
                    directionsDisplay.setDirections(response);                        
                    
                    $("#results").show();
                    
                }
                else {
                    $("#results").hide();
                }
            });
        }
        else {
            $("#results").hide();
        }
        
    }

    function tilesLoaded() {
        google.maps.event.clearListeners(map, 'tilesloaded');
        google.maps.event.addListener(map, 'zoom_changed', search);
        google.maps.event.addListener(map, 'dragend', search);
        search();
    }

     function search() {
        var type = 'gas_station';
        var search = {
          bounds: map.getBounds()
        };

        if (type != 'establishment') {
          search.types = [type];
        }

        places.search(search, function(results, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            clearMarkers();
            for (var i = 0; i < results.length; i++) {
              var image = 'images/pin.png'; 
              markers[i] = new google.maps.Marker({
                position: results[i].geometry.location,
                icon: image


                //animation: google.maps.Animation.DROP
              });
              google.maps.event.addListener(markers[i], 'click', getDetails(results[i], i));
              setTimeout(dropMarker(i), i * 100);
             
            }
          }
        });
}

function clearMarkers() {
for (var i = 0; i < markers.length; i++) {
  if (markers[i]) {
    markers[i].setMap(null);
    markers[i] == null;
  }
}
}

function dropMarker(i) {
return function() {
  markers[i].setMap(map);
}
}




function getDetails(result, i) {
    var end = new google.maps.LatLng(result.geometry.location.Ya, result.geometry.location.Za);
    
    return function() {
      places.getDetails({
        reference: result.reference
      }, showInfoWindow(i, end));             
    }
}

function showInfoWindow(i, end) {
  calculateRoute(end);
  $directions_width =  $("#directions").width();
  $dir_width = ($(document).width()- $directions_width)/2;
  $(".direction_close").css({left:$("#directions").width()-20+'px', position: 'relative'});
  $("#directions").css({left: $dir_width+'px', top: '150px'}).show();
 // $('.direction_close').css("")


  
    

    

    /*
    return function(place, status) {

      if (iw) {
        iw.close();
        iw = null;
      }

      if (status == google.maps.places.PlacesServiceStatus.OK) {
        iw = new google.maps.InfoWindow({
          content: getIWContent(place, i)
        });
        iw.open(map, markers[i]);

      }
    } */
}

function getIWContent(place, i) {
   var content = '<li">';
    content += '<img class="placeIcon" src="' + place.icon + '">';
    content += '<div style="border:0;width:100%;"><b><a href="' + place.url + '">' + place.name + '</a></b></div>';
    content += '<div style="border:0;width:100%;">'+place.formatted_address+'</div>';
    content += '<div><b><a href="#" onclick="getDirection('+place.geometry.location.Ya +','+ place.geometry.location.Za+')"> Directon</a></b></div>';
    content += '</li>';
    return content;
}

function getDirection(lat, lon){
    var end = new google.maps.LatLng(lat, lon);
    calculateRoute(end);
}


$(document).live("pageshow", "#fuel-center", function() {
    navigator.geolocation.getCurrentPosition(locSuccess, locError);
      // $("#directions").wrap('<div class="content" data-role="content" />');
    $(".direction_close a").click(function(){
        $("#directions").hide();
    })
});


$(document).live("pagecreate", "#fuel-center", function() {
   
});
