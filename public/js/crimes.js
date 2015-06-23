$(function() {

var image = 'images/me.png';


//clicking on the getcrimes button loads crimes function
$('#data').on('click', function(e){
  loadCrimes();
})

$('#all').on('click', function(e){
  loadAllCrimes()
})

//todo: add a view all crimes button to view all crimes
//without posting them to the DB

//variables for the map and the data
var map = 0;
var data;

//verifies that the jquery is working
	console.log('welcome to the crime map')

//start the app by loading the map 
	 function initialize() {
    var mapCanvas = document.getElementById('map-canvas');
    var mapOptions = {
      center: new google.maps.LatLng(37.7876973, -122.3973736),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(mapCanvas, mapOptions);
  }

//function for adding a marker with an additional 
//name attribute to add to the info window
    function addMarker(lat,lng,name,img) {

//creates an infowindow for the app (tooltip popup box)
    	var infowindow = new google.maps.InfoWindow({
      content: name
  });

//creates a point for the map
    var myLatlng = new google.maps.LatLng(lat,lng);

//creates a marker at the point
//todo: add a custom marker image based on an 'image' attribute in function?
 	  var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      title: 'Hello World!',
      icon: img
  	});
  	//infowindow.open(map,marker);
    //adds the info window without opening it
  	addInfoWindow(marker, name);
  	}

    //sets up the event listener for the infowindow so that 
    //on click we can open the window 
  	  function addInfoWindow(marker, title) {
    var infowindow = new google.maps.InfoWindow({
      content: title
    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(marker.get('map'), marker);
    });
  }


var arr = [];
var lng = 0;
var lat = 0;


//setup for getting the users location from 
//the browser
// todo: make it quicker
var x = document.getElementById("demo");

$('#myloc').click(function(e)
{
	
	getLocation();
	
})


//function for getting the location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

//shows position and adds a marker at the 'me' position

function showPosition(position) {
 //x.innerHTML = "<ul><li class='list-group-item list-group-item-success>Longitude: " + position.coords.latitude + "</li><li class='list-group-item list-group-item-success>Longitude: " + position.coords.longitude + "</li></ul>";
    lat = position.coords.latitude;
    
    lng = position.coords.longitude;

//todo add a url in the me marker to show my image/url
    addMarker(lat,lng,"me",image)
}


//stackoverflow found function for getting distance 
//between two points from longitude/ latitude

var rad = function(x) {
  return x * Math.PI / 180;
};

var getDistance = function(lat1,long1,lat2,long2) {
	// console.log(lat2)
	// console.log(long2)
  var R = 6378137; // Earth’s mean radius in meter
  var dLat = rad(lat2 - lat1);
  var dLong = rad(long2 - long1);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d/1000; // returns the distance in km
};


//function for the ajax call for loading the crimes from API
//and also sorting and returning + outputting the first 10 nearest
//crimes in addition to posting them to the database
function loadCrimes()
{
  console.log("load crimes")
  $.ajax({
      type: 'GET',
      url: 'https://data.sfgov.org/resource/ritf-b9ki.json',
      dataType: 'json'
    }).done(function(data) {

  //push each item into an array for easy sorting
  console.log("pushing data")
	data.forEach(function(item) {
  arr.push([getDistance(item.location.latitude,item.location.longitude,lat,lng), item])
	})
             
	//sort the items by distance
	arr.sort(function(x,y){
	return(x[0] - y[0])
	})
	console.log("sorted the array")
  //console.log(arr)
	//output the items on the ui
	for(var i = 0; i < 10; i++)
	{
    console.log("starting for loop")
	data = {crime: {name: arr[i][1].descript,vote:0, resolution:arr[i][1].resolution}};

$.ajax({
  type: 'POST',
  url: '/crimes',
  data: data,
  dataType: 'json'
})

//todo build this with handlebars!
   		addMarker(Number(arr[i][1].location.latitude),Number(arr[i][1].location.longitude),arr[i][1].descript + " " + "resolution: " + arr[i][1].resolution)
	$('ul').append("<li class='list-group-item list-group-item-success'>" + i + "</li>")
	$('ul').append("<li class='list-group-item list-group-item-success'>Distance from you: " + arr[i][0] + "</li>")
	$('ul').append("<li class='list-group-item list-group-item-success'>Crime: " + arr[i][1].descript + "</li>")
   $('ul').append("<li class='list-group-item list-group-item-success'>Time: " + arr[i][1].time + "</li>")
   $('ul').append("<li class='list-group-item list-group-item-success'>Date: " + arr[i][1].date + "</li>")
   $('ul').append("<li class='list-group-item list-group-item-success'>Long: " + arr[i][1].location.longitude + "</li>")
   $('ul').append("<li class='list-group-item list-group-item-success'>Lat: " + arr[i][1].location.latitude + "</li>")
   $('ul').append("<li class='list-group-item list-group-item-success'>Res: " + arr[i][1].resolution + "</li>")
      }
    })
  }

  function loadAllCrimes() {
    console.log("load all crimes")
      $.ajax({
      type: 'GET',
      url: 'https://data.sfgov.org/resource/ritf-b9ki.json',
      dataType: 'json'
    }).done(function(data) {

  // add markers to the map
  data.forEach(function(item) {
  addMarker(Number(item.location.latitude),Number(item.location.longitude),item.descript + " " + "resolution: " + item.resolution + " " + item.date)

  })
  })
}
//runs the main function 
initialize();
})

