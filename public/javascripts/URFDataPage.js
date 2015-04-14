/* .URFData puller @author Rhys */

// auto search at start for URF Data
var currentlySearching = true;

// manage the searching... at start
var searchingDots = 0;
var searchingAnimation;

$(document).ready(function() {

	currentlySearching = true;

	// sets the Searching... animation running
	searchingAnimation = setInterval(function() {
		var dotsToAdd = "";
		var spacesToAdd = "";
		for(var i = 0; i < searchingDots; i++) {
			spacesToAdd += " ";
			dotsToAdd += ".";
		}

		$('.searching').text(spacesToAdd + "Searching" + dotsToAdd);

		searchingDots++;
		if(searchingDots > 4) {
			searchingDots = 0;
		}
	}, 180);

	// does a get request to the server for URF data
	$.get(
		"/URFData",
		{},
		function(data) {
			currentlySearching = false;

			var messageToDisplay = "Error!!!";
			var searchSuccess = false;

			// data has data from the server as a response to summoner name
			if(data == "error") {
				messageToDisplay = "Server error.";
			}
			else if(data == "not found") {
				messageToDisplay = "Summoner not found.";
			}
			else if(data == "overload") {
				messageToDisplay = "Too much server activity, please refresh and try again.";
			}
			else {
				messageToDisplay = "";//Success! Please choose a match:";
				
				searchSuccess = true;
			}

			clearInterval(searchingAnimation);
			searchingAnimation = null;

			// sets the text of the description to the response
			$('.searching').text(data);//messageToDisplay);

			// call to parse the returned match data
			parseURFData(JSON.parse(data));
			// $('.resultText').text(data);
		}
	);
});

var parseURFData = function (matchData) {
	var parsedData = "";

	// worked = false;
	// make the variable matchArray contain the array of Matches
	// for(matchArray in matchData) {
	// 	worked = true;
	// 	// console.log("Data: " + matchArray);
	// 	// console.log("\n\nData 2: " + matchData[matchArray]);
	// 	break;
	// }

	$('.gamesAnalyzed').text(matchData.gamesAnalyzed + " Games Analyzed.");

	// if(!worked) {
	// 	$('.searchDescription').text("No match history found.");
	// 	return;
	// }

	// for(var i = 0; i < matchData[matchArray].length; i++) {
	// 	// queueType
	// 	parsedData += "Match " + i + ": " + matchData[matchArray][i].queueType + "    |    \n";// matchData[matchArray]

	// 	// parsedData += JSON.stringify(matchData[matchArray][0]);

	// 	// break;
	// }

	// parsedData += matchArray[0];

	// $('.resultText').text(parsedData);
}