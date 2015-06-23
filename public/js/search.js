$(function() {


//verifies that we've reached the search page
	console.log('search page active')
//value for the input box
	var value;

//when clicking on the input empties the list and empties the input
	$( "#searchinput" ).focus(function(){

	$('ul').empty();
	$( "#searchinput" ).val("")
})

//sets up the values for the autocomplete
	$( "#searchinput" ).autocomplete({
  	source: [ "arson", "assault", "fraud", "vandalism", "larceny/theft", "vehicle theft", "suspicious occ", "warrants" ],	
  	messages: {
        noResults: '',
        results: function() {}
    },
//when an item is selected clicks the search button to run ajax and 
//deselects the search input box
    select: function(event, ui) { 
    	$('#search').click();
   		 $( "#searchinput" ).blur();
    },

		});


// if enter is selected on the keyboard 
// clear the input box
// deselect the input box
$('#searchinput').keypress(function (e) {
 var key = e.which;
 if(key == 13)  // the enter key code
  {
    $('#search').click();
    $( "#searchinput" ).blur();

  }
});   


	$('#search').click(function(e){

 //clicking on the search empty the list
		$('ul').empty();
 //assign the input box value into variable
		value = $('#searchinput').val();
		console.log(value);
 //call the function/ ajax call with value
		getResults(value);

	})






	function getResults(query)
	{


	$.ajax({
      type: 'GET',
      //updated URL for the JSON call
      url: 'https://data.sfgov.org/resource/ritf-b9ki.json?category=' + query,
      dataType: 'json'
    }).done(function(data) {
      //loop through the data and append all the data to the DOM
    
    	data.forEach(function(item){

    $('ul').append("<li >Crime: " + item.descript + "</li>")
   $('ul').append("<li >Time: " + item.time + "</li>")
   $('ul').append("<li >Date: " + item.date + "</li>")
   $('ul').append("<li>Long: " + item.location.longitude + "</li>")
   $('ul').append("<li >Lat: " + item.location.latitude + "</li>")
   $('ul').append("<li >Res: " + item.resolution + "</li>")

     })
	})
}


});