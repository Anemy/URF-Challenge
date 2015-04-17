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
			// $('.searching').css('display', 'none');

			// call to parse the returned match data
			parseURFData(JSON.parse(data));
			// $('.resultText').text(data);
		}
	);

	// called when a user types into the search box. Filters the data
	$('.searchBox').keyup(function(keyEvent) {
		var searchTerm = $('.searchBox').val();
		// console.log("Searching for: " + searchTerm);

		if(searchTerm.length == 0) {
			useFilteredData = false;
		}
		else {
			useFilteredData = true;

			filteredURFData = [];
			for(var champion = 0; champion < URFDataArray.length; champion++) {
				if(URFDataArray[champion].champName.toLowerCase().indexOf(searchTerm.toLowerCase()) != -1) {
					// console.log(URFDataArray[champion].champName);
					filteredURFData.push(URFDataArray[champion]);
				}
			}
		}

		displayTable();
	});
});

// contains the URF champion data from the server
var URFDataArray = [];
// contains a filtered array of the URF Data based on the search bar
var filteredURFData = [];
var useFilteredData = false; 

// for sorting the champions
var descending = false;
var lastColClicked = "none";

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// used to return the champion name after some calcs (EX: LeBlanc -> Leblanc)
var getAPIName = function (champName) {
	if(champName == "Dr. Mundo") {
		return "DrMundo";
	}

	champName.replace('.', '');
	if(champName == "Wukong") {
		return "MonkeyKing";
	}
	else if(champName == "Fiddlesticks") {
		return "FiddleSticks";
	}
	else if(champName.indexOf(' ') != -1) {
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


// builds the table to display with all of the champion data based on URFDataArray
var displayTable = function () {
	var htmlToAdd = "";

	htmlToAdd += "<table>";

	htmlToAdd += "<tr>";
	htmlToAdd += '<td></td>';
	htmlToAdd += '<td><a id="championName" class="tableColTitle">Champion<div id="swap1" class="swapImage"/></a></td>';
	htmlToAdd += '<td><a id="winRate" class="tableColTitle">Win %<div id="swap2" class="swapImage"/></a></td>';
	htmlToAdd += '<td><a id="plays" class="tableColTitle">Plays<div id="swap3" class="swapImage"/></a></td>';
	htmlToAdd += '<td><a id="kda" class="tableColTitle">Kill/Death<div id="swap4" class="swapImage"/></a></td>';
	htmlToAdd += '<td><a id="avgGold" class="tableColTitle">Average Gold<div id="swap5" class="swapImage"/></a></td>';
	htmlToAdd += '<td><a id="avgCS" class="tableColTitle">Average CS<div id="swap6" class="swapImage"/></a></td>';
	htmlToAdd += "</tr>";

	if(!useFilteredData) {
		for(var champion = 0; champion < URFDataArray.length; champion++) {
			htmlToAdd += "<tr>";
			// console.log("This champ: " + matchData.champions[champion].champName);
			// add image here
			htmlToAdd += '<td class="champImg"><img class="champImg" src="http://ddragon.leagueoflegends.com/cdn/5.7.2/img/champion/' + getAPIName(URFDataArray[champion].champName) + '.png" onError="this.onerror=null;this.src=\'https://cdn.leagueoflegends.com/riotbar/prod/1.4.9/images/bar/icon-game-lol.png?1428716565\';"/></td>';
			htmlToAdd += '<td style="text-align: left; padding-left: 70px;">' + URFDataArray[champion].champName + "</td>";
			htmlToAdd += '<td>' + (100*URFDataArray[champion].winRate).toPrecision(4) + '</td>';
			htmlToAdd += '<td>' + URFDataArray[champion].totalPlays + '</td>';
			htmlToAdd += '<td>' + URFDataArray[champion].kda.toPrecision(4) + '</td>';
			htmlToAdd += '<td>' + URFDataArray[champion].averageGold.toPrecision(6) + '</td>';
			htmlToAdd += '<td>' + URFDataArray[champion].averageCS.toPrecision(4) + '</td>';
			
			htmlToAdd += '</tr>';
		}
	}
	else {
		for(var champion = 0; champion < filteredURFData.length; champion++) {
			htmlToAdd += "<tr>";
			// console.log("This champ: " + matchData.champions[champion].champName);
			// add image here
			htmlToAdd += '<td class="champImg"><img class="champImg" src="http://ddragon.leagueoflegends.com/cdn/5.7.2/img/champion/' + getAPIName(filteredURFData[champion].champName) + '.png" onError="this.onerror=null;this.src=\'https://cdn.leagueoflegends.com/riotbar/prod/1.4.9/images/bar/icon-game-lol.png?1428716565\';"/></td>';
			htmlToAdd += '<td style="text-align: left; padding-left: 70px;">' + filteredURFData[champion].champName + "</td>";
			htmlToAdd += '<td>' + (100*filteredURFData[champion].winRate).toPrecision(4) + '</td>';
			htmlToAdd += '<td>' + filteredURFData[champion].totalPlays + '</td>';
			htmlToAdd += '<td>' + filteredURFData[champion].kda.toPrecision(4) + '</td>';
			htmlToAdd += '<td>' + filteredURFData[champion].averageGold.toPrecision(6) + '</td>';
			htmlToAdd += '<td>' + filteredURFData[champion].averageCS.toPrecision(4) + '</td>';
			
			htmlToAdd += '</tr>';
		}
	}

	htmlToAdd += "</table>";
	$('.champTable').html(htmlToAdd);

	$('.URFStatsPage').css('height', $('.champTable').height() + 220);

	$('.tableColTitle').mouseleave(function(event) { 
		$('#swap1, #swap2, #swap3, #swap4, #swap5, #swap6').removeClass('hover');
	});

	// pretty crude way of doing hover over the little items
	$('.tableColTitle').mouseenter(function(event) {
		var targetName = event.target.id.toString();
		// console.log("Hovertime target: " + targetName);

		// $('#swap1, #swap2, #swap3, #swap4, #swap5, #swap6').removeClass('hover');

		if(targetName == "championName") {
			$('#swap1').addClass('hover');
		}
		else if(targetName == "winRate") {
			$('#swap2').addClass('hover');
		}
		else if(targetName == "plays") {
			$('#swap3').addClass('hover');
		}
		else if(targetName == "kda") {
			$('#swap4').addClass('hover');
		}
		else if(targetName == "avgGold") {
			$('#swap5').addClass('hover');
		}
		else if(targetName == "avgCS") {
			$('#swap6').addClass('hover');
		}
	});

	// handles sorting based on the column clicked
	$('.tableColTitle').click(function(event) {
		if(lastColClicked == event.target.id.toString()) {
			// console.log("Switch up the descend");
			descending = !descending;
		}
		lastColClicked = event.target.id.toString();

		arrayToSort = URFDataArray;
		if(useFilteredData) {
			arrayToSort = filteredURFData;
		}

		if(event.target.id == "championName" || event.target.id == "swap1") { 

			// console.log("Sort by champ name");

			arrayToSort.sort(function(a,b) {

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
			arrayToSort.sort(function(a,b) {
				var toReturn = 0;
				if(event.target.id == "winRate" || event.target.id == "swap2") {
					toReturn = a.winRate - b.winRate;
				}
				else if(event.target.id == "plays" || event.target.id == "swap3") {
					toReturn = a.totalPlays - b.totalPlays;
				}
				else if(event.target.id == "kda" || event.target.id == "swap4") {
					toReturn = a.kda - b.kda;
				}
				else if(event.target.id == "avgGold" || event.target.id == "swap5") {
					toReturn = a.averageGold - b.averageGold;
				}
				else if(event.target.id == "avgCS" || event.target.id == "swap6") {
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