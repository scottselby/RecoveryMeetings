/// <reference path="../Scripts/jquery-1.7.1.js" />
/// <reference path="../Scripts/jquery-ui-1.8.20.js" />
/// <reference path="../Scripts/jquery.unobtrusive-ajax.js" />
/// <reference path="../Scripts/modernizr-2.5.3.js" />

//globals go here
var map, marker;
var googleMarkerPoints = [];


window.onload = function () {
    geoLocateMe();
};

function initializeMap(foundMe, latlong) {

    if (!foundMe) {
        //if geolocation fails center map at State & Madison - middle of Chicago       
        latlong = new google.maps.LatLng(41.882039, -87.627813);
    }

    //set map options
    var mapOptions = {
        zoom: 12,
        center: latlong,
        navigationControlOptions: { style: google.maps.NavigationControlStyle.SMALL },
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    //create map
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    //create first marker - this one is blue for user's location or the Chicago default    
    var MyLocationmarker = new google.maps.Marker({
        position: latlong,
        map: map,
        title: "My Current Location",
        icon: new google.maps.MarkerImage("http://labs.google.com/ridefinder/images/mm_20_blue.png"),
        zIndex: 1000
    });
    AddMarkers();
}

function geoLocateMe() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(geolocateSuccess, error);
    } else {
        error('not supported');
    }
}

function geolocateSuccess(position) {
    var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    initializeMap(true, latlng);
}

function error(msg) {
    // TODO: obivously need to do more here - graceful fallback to ip locating , and better alert to user
    alert(msg);
    return;
}

$(function () {
    //This makes the appropiate marker bouce on mouseover of list of meetings on right side of map
    //TODO: show user apropiate marker some other way then this stupid bounce
    $('.result').mouseenter(function () {
        var indexNum = parseInt($(this).attr('data-num'));
        googleMarkerPoints[indexNum].setAnimation(google.maps.Animation.BOUNCE);
    });
    $('.result').mouseleave(function () {
        var indexNum = parseInt($(this).attr('data-num'));
        googleMarkerPoints[indexNum].setAnimation(null);
    });
});

function AddMarkers() {

    $.ajax({
        url: "JSON/GetMarkers",
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                //add marker to map for each result
                var obj = data[i];
                var latitude = obj.Latitude;
                var longitude = obj.Longitude;
                var title = obj.Title;
                var thisLatlng = new google.maps.LatLng(latitude, longitude);
                var thismarker = new google.maps.Marker({
                    position: thisLatlng,
                    map: map,
                    title: title,
                    icon: new google.maps.MarkerImage("http://labs.google.com/ridefinder/images/mm_20_red.png")
                });

                //add to list on right side of map for each result
                var clone = $('.template').clone().removeClass('template');

                googleMarkerPoints.push(thismarker);
            }
            for (var i = 0; i <= 6; i++) {
                (function (i) {
                    google.maps.event.addListener(googleMarkerPoints[i], 'click', function () {
                        $('.result').css({ "background-color": "#fff" });
                        var selector = "div[data-num='" + i + "']";
                        $(selector).css({ "background-color": "#999" });
                    });
                })(i)
            }
        }
    });
};

function codeAddress() {
    geocoder = new google.maps.Geocoder();
    var address = document.getElementById('location').value;
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var thisLatLong = $.parseJSON(results[0].geometry.location);
            console.log(thisLatLong);
            map.setCenter(results[0].geometry.location);
            //location markers will be blue, and have the address formatted from Google geocoder, not 
            //what the user entered
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location,
                icon: new google.maps.MarkerImage("http://labs.google.com/ridefinder/images/mm_20_blue.png"),
                title: results[0].formatted_address
            });
            map.setZoom(14);

        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}
$(function () {
    $('#searchSubmit').click(function () {
        codeAddress();
        return false;
    });
});