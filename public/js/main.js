$(function() {



// var arson = 0
// var fraud = 0
// var assault = 0
// var vandalism = 0
// var theft = 0
//var pieData = []



	function loadAllCrimes() {
    console.log("load all crimes")
      $.ajax({
      type: 'GET',
      url: 'https://data.sfgov.org/resource/ritf-b9ki.json',
      dataType: 'json'
    }).done(function(data) {

console.log('ran ajax')
// add markers to the map
//loops through the data and determines an
  data.forEach(function(item) {
    //console.log(item.category)
    console.log('counting items')
    if(item.category == "ARSON")
{

pieData[0].value +=1

}
    else if(item.category == "FRAUD")
{
pieData[1].value +=1

}
else if(item.category == "LARCENY/THEFT")
{

pieData[4].value +=1
}
else if(item.category == "ROBBERY")
{
pieData[4].value +=1
}
else if(item.category == "BURGLARY")
{
pieData[4].value +=1
}
else if(item.category == "VEHICLE THEFT")
{
pieData[4].value +=1
}
else if(item.category == "ASSAULT")
{
pieData[2].value +=1
}
else if(item.category == "VANDALISM")
{
pieData[3].value +=1
}


  })
  })
}
	

//loadAllCrimes()


	var barChartData = {
		labels : ["Arson","Fraud","Assault","Vandalism","Theft"],
		datasets : [
			{
				fillColor : "rgba(220,220,220,0.5)",
				strokeColor : "rgba(220,220,220,0.8)",
				highlightFill: "rgba(220,220,220,0.75)",
				highlightStroke: "rgba(220,220,220,1)",
				data : [2,24,92,50,355]
			}
		]

	}
	window.onload = function(){
		var ctx = document.getElementById("canvas").getContext("2d");
		window.myBar = new Chart(ctx).Bar(barChartData, {
			responsive : true
		});
	}

// var pieData = [
// 				{
// 					value: 2,
// 					color:"#F7464A",
// 					highlight: "#FF5A5E",
// 					label: "arson"
// 				},
// 				{
// 					value: 24,
// 					color: "#46BFBD",
// 					highlight: "#5AD3D1",
// 					label: "fraud"
// 				},
// 				{
// 					value: 92,
// 					color: "#FDB45C",
// 					highlight: "#FFC870",
// 					label: "assault"
// 				},
// 				{
// 					value: 50,
// 					color: "#949FB1",
// 					highlight: "#A8B3C5",
// 					label: "vandalism"
// 				},
// 				{
// 					value: 355,
// 					color: "#4D5360",
// 					highlight: "#616774",
// 					label: "theft"
// 				}

// 			];

// 			window.onload = function(){
// 				console.log("drawing chart")
// 				var ctx = document.getElementById("chart-area").getContext("2d");
// 				window.myPie = new Chart(ctx).Pie(pieData);
// 			};

	});