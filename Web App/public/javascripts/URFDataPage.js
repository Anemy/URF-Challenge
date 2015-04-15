/* .URFData puller @author Rhys */

// auto search at start for URF Data
var currentlySearching = true;

// manage the searching... at start
var searchingDots = 0;
var searchingAnimation;

$(document).ready(function() {

	currentlySearching = true;

	// console.log("Making request...");

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
var descending = false;
var lastColClicked = "none";

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// used to return the champion name after some calcs (EX: LeBlanc -> Leblanc)
var getAPIName = function (champName) {
	champName.replace('.', '');
	if(champName.indexOf(' ') != -1) {
		return champName.replace(' ', '');
	}
	else if(champName.indexOf('\'') != -1) {
		if(champName == "Cho'Gath" || champName == "Kha'Zix" || champName == "Vel'Koz") {
			return capitalizeFirstLetter(champName.replace('\'', '').toLowerCase());
		}
		return capitalizeFirstLetter(champName.replace('\'', ''));
	}
	else {
		return capitalizeFirstLetter(champName.toLowerCase());
	}
}

var displayTable = function () {
	var htmlToAdd = "";

	htmlToAdd += "<table>";

	htmlToAdd += "<tr>";
	htmlToAdd += '<td></td>';
	htmlToAdd += '<td><a id="championName" class="tableColTitle">Champion</a></td>';
	htmlToAdd += '<td><a id="winRate" class="tableColTitle">Win %</a></td>';
	htmlToAdd += '<td><a id="plays" class="tableColTitle">Plays</a></td>';
	htmlToAdd += '<td><a id="kda" class="tableColTitle">Kill/Death</a></td>';
	htmlToAdd += '<td><a id="avgGold" class="tableColTitle">Average Gold</a></td>';
	htmlToAdd += '<td><a id="avgCS" class="tableColTitle">Average CS</a></td>';
	htmlToAdd += "</tr>";

	for(var champion = 0; champion < URFDataArray.length; champion++) {
		htmlToAdd += "<tr>";
		// console.log("This champ: " + matchData.champions[champion].champName);
		// add image here
		htmlToAdd += '<td class="champImg"><img class="champImg" src="http://ddragon.leagueoflegends.com/cdn/5.7.2/img/champion/' + getAPIName(URFDataArray[champion].champName) + '.png" onError="this.onerror=null;this.src=\'https://cdn.leagueoflegends.com/riotbar/prod/1.4.9/images/bar/icon-game-lol.png?1428716565\';"/></td>';
		htmlToAdd += '<td style="text-align: left; padding-left: 70px;">' + URFDataArray[champion].champName + "</td>";
		htmlToAdd += '<td>' + (100*URFDataArray[champion].winRate).toPrecision(4) + '</td>';
		htmlToAdd += '<td>' + URFDataArray[champion].totalPlays + '</td>';
		htmlToAdd += '<td>' + URFDataArray[champion].kda.toPrecision(4) + '</td>';
		htmlToAdd += '<td>' + URFDataArray[champion].averageGold.toPrecision(7) + '</td>';
		htmlToAdd += '<td>' + URFDataArray[champion].averageCS.toPrecision(4) + '</td>';
		
		htmlToAdd += '</tr>';
	}

	htmlToAdd += "</table>";
	$('.champTable').html(htmlToAdd);

	$('.URFStatsPage').css('height', $('.champTable').height() + 220);

	// if(tableSortResponderAllowed == false) {
		$('.tableColTitle').click(function(event) {
			if(lastColClicked == event.target.id.toString()) {
				// console.log("Switch up the descend");
				descending = !descending;
			}
			lastColClicked = event.target.id.toString();

			if(event.target.id == "championName") { 

				console.log("Sort by champ name");

				URFDataArray.sort(function(a,b) {

					// console.log("Champion name: " + a.champName);

					var toReturn = a.champName.toString().localeCompare(b.champName.toString());
					// console.log("Local compare: " + toReturn);

					if(!descending) {
						toReturn = -toReturn;
					}

					return toReturn;
				});
			}
			else {
				URFDataArray.sort(function(a,b) {
					var toReturn = 0;
					if(event.target.id == "winRate") {
						toReturn = a.winRate - b.winRate;
					}
					else if(event.target.id == "plays") {
						toReturn = a.totalPlays - b.totalPlays;
					}
					else if(event.target.id == "kda") {
						toReturn = a.kda - b.kda;
					}
					else if(event.target.id == "avgGold") {
						toReturn = a.averageGold - b.averageGold;
					}
					else if(event.target.id == "avgCS") {
						toReturn = a.averageCS - b.averageCS;
					}

					if(!descending) {
						toReturn = -toReturn;
					}

					return toReturn;
					// descending
				});
			}

			displayTable();
		});
	// }

	// tableSortResponderAllowed = true;
}

var parseURFData = function (matchData) {
	var parsedData = "";
	// console.log("data");

	$('.gamesAnalyzed').text(matchData.gamesAnalyzed + " Games Analyzed.");

	for(champion in matchData.champions) {
		// console.log("\n\nData 2: " + matchData[matchArray]);

		if(matchData.champions[champion] != "null" && matchData.champions[champion] != null) {
			// matchData.champions[champion].winRate = Math.floor(Math.random() * 100);
			URFDataArray.push(matchData.champions[champion]);
		}
	}

	displayTable();
}