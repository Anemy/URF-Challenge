/*

This file stores data related to the API Challenge (URF Stats)
It helps to compile past games to create analytics

*/

// used for API calls
var APIManager = require('../request_manager/APIManager.js');

var URFManager = module.exports = {}

// used to compile URF data for highscores
URFManager.URFData = {
	gamesAnalyzed: 0,
	startTime: 	Date.now(),
	champions: [],
	championsDefined: false
};

// used as a champions class for the champions URF data array
var champion = function(championId) {
	var champID = championId;
	var champName = "none";
	var totalPlays = 0;
	var totalWins = 0;
	var totalLosses = 0;
	var winRate = 0;
	var kills = 0;
	var death = 0;
	var kda = 0;
	var gol = 0;
}

// Fetches necessary static data
URFManager.start = function() {
	var that = this;

	// makes the champions array have variables
	URFManager.initiateChampionData = function (champsData) {
		champsData = JSON.parse(champsData).data;
		for(champ in champsData) {
			// do something with that champ data
			var thisChamp = champsData[champ];

			console.log("Adding: " + thisChamp.name +" with id: " +thisChamp.id);

			// console.log("this champions: " + this.champions + " that.champions: " + that.champions);

			that.URFData.champions[thisChamp.id] = new champion(thisChamp.id);
			that.URFData.champions[thisChamp.id].champName = thisChamp.name;
		}
		that.URFData.championsDefined = true;
	}

	URFManager.staticChampsErrorCallback = function() {
		console.log( "ERROR with fetching static champ data");
		process.exit(1);
	}

	APIManager.getAllChampionsData(that.initiateChampionData, that.staticChampsErrorCallback);
}

// rate at which server pulls challenge API data from riot (in ms)
const dataUpdateRate = 10000; // 1000 is one second

// this cycle manages the server updating the URF data.
URFManager.queryCycle = function() {
	setInterval(function () {

		// don't update data if not all of the set up data for the champions array is filled
		if(this.URFData.championsDefined == false) {
			return;
		}

		var that = this; // hacky way to refer to the current obj in "async" calls

		var errorCallback = function (errorLog) {
			console.log("Pulling more URF data failed: " + errorLog);
		}

		var successCallBack = function(matchArraydata) {
			
			// console.log("URF Data success: " + matchArraydata);

			var innerSuccessCallBack = function(matchData) {
				matchData = JSON.parse(matchData);
				// TODO: update the URFData according to the match's data
				// console.log("Inner success. " + matchData);
				var firstItem;
				for(firstItem in matchData) {
					// gets the first element of the json
					break;
				}
				// console.log("First item: " + firstItem);
				// console.log("Match first item: " + matchData[firstItem]);
				// console.log("Match participants: " + matchData[firstItem].participants);
				// console.log("Raw participants: " + JSON.stringify(matchData.participants));
				for(player in matchData.participants) {
					var thisPlayer = matchData.participants[player];

					that.URFData.gamesAnalyzed++;
					that.URFData.champions[thisPlayer.championId].totalPlays ++;
					// console.log("Object in: " + JSON.stringify(matchData.participants[object]));
					// console.log("Stats: " + JSON.stringify(matchData.participants[object].stats));
					console.log("champID: " + matchData.participants[object].championId);
					console.log("Is winner: " + matchData.participants[object].stats.winner);
					console.log("Kills: " + matchData.participants[object].stats.kills);
					console.log("Kills: " + matchData.participants[object].stats.deaths);
					console.log("CS: " + matchData.participants[object].stats.minionsKilled);
					console.log("Gold: " + matchData.participants[object].stats.goldEarned);
				}
			}

			var matchArray = JSON.parse(matchArraydata);

			for(var i = 0; i < 2; i++) {//matchArray.length; i++) { 
				APIManager.getMatchData(matchArray[i], innerSuccessCallBack, errorCallback);
			}
		}

		// call the API Manager to get 15 game ids (sent to successCallBack).
		APIManager.getMostRecentChallengeAPI(successCallBack, errorCallback);
	}, dataUpdateRate);
}

//  $('#resultText).append('<li>' + matches[i].matchMode +'</li>');