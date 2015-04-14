/* .URFData puller @author Rhys */

// auto search at start for URF Data
var currentlySearching = true;

// manage the searching... at start
var searchingDots = 0;
var searchingAnimation;

$(document).ready(function() {

	currentlySearching = true;

	console.log("Making request...");

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
			// console.log("data callback");

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
			$('.searching').text(messageToDisplay);//messageToDisplay);
			$('.searching').css('display', 'none');

			// call to parse the returned match data
			parseURFData(JSON.parse(data));
			// $('.resultText').text(data);
		}
	);
});

var URFDataArray = [];
var tableSortResponderAllowed = false;
var descending = true;

var displayTable = function () {
	var htmlToAdd = "";

	htmlToAdd += "<table>";

	htmlToAdd += "<tr>";
	htmlToAdd += '<td></td>';
	htmlToAdd += '<td><a id="championName" class="tableColTitle">Champion</a></td>';
	htmlToAdd += '<td><a id="winRate" class="tableColTitle">Win Ratio</a></td>';
	htmlToAdd += '<td><a id="plays" class="tableColTitle">Plays</a></td>';
	htmlToAdd += '<td><a id="kda" class="tableColTitle">Kill/Death</a></td>';
	htmlToAdd += '<td><a id="avgGold" class="tableColTitle">Average Gold</a></td>';
	htmlToAdd += '<td><a id="avgCS" class="tableColTitle">Average CS</a></td>';
	htmlToAdd += "</tr>";

	for(var champion = 0; champion < URFDataArray.length; champion++) {
		htmlToAdd += "<tr>";
		// console.log("This champ: " + matchData.champions[champion].champName);
		// add image here
		htmlToAdd += '<td class="champImg"><img class="champImg" src="http://ddragon.leagueoflegends.com/cdn/5.2.1/img/champion/' + URFDataArray[champion].champName + '.png"/></td>';
		htmlToAdd += '<td style="text-align: left; padding-left: 52px;">' + URFDataArray[champion].champName + "</td>";
		htmlToAdd += '<td>' + URFDataArray[champion].winRate + '</td>';
		htmlToAdd += '<td>' + URFDataArray[champion].totalPlays + '</td>';
		htmlToAdd += '<td>' + URFDataArray[champion].kda + '</td>';
		htmlToAdd += '<td>' + URFDataArray[champion].averageGold + '</td>';
		htmlToAdd += '<td>' + URFDataArray[champion].averageCS + '</td>';
		
		htmlToAdd += '</tr>';
	}

	htmlToAdd += "</table>";
	$('.champTable').html(htmlToAdd);

	if(tableSortResponderAllowed == false) {
		$('.tableColTitle').click(function(event) {
			// if(event.target.id == "championName") {
			// 	URFDataArray.sort(function(a,b) {
			// 		if(desending)
			// 	}
			// }
			// else {
			// 	URFDataArray.sort(function(a,b) {
			// 		descending
			// 	}
			// }

			// displayTable();
		});
	}

	tableSortResponderAllowed = true;
}

var parseURFData = function (matchData) {
	var parsedData = "";
	// console.log("data");

	$('.gamesAnalyzed').text(matchData.gamesAnalyzed + " Games Analyzed.");

	for(champion in matchData.champions) {
		// console.log("\n\nData 2: " + matchData[matchArray]);

		if(matchData.champions[champion] != "null" && matchData.champions[champion] != null) {
			URFDataArray.push(matchData.champions[champion]);
		}
	}

	displayTable();
}