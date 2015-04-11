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
};

URFManager.championsDefined = false;


// used as a champions class for the champions URF data array
var champion = function(championId) {
	this.champID = championId;
	this.champName = "none";

	this.totalPlays = 0;

	this.totalWins = 0;
	this.totalLosses = 0;
	this.winRate = 0;

	this.kills = 0;
	this.deaths = 0;
	this.averageKills = 0.0;
	this.averageDeaths = 0.0;
	this.kda = 0.0;

	this.gold = 0;
	this.averageGold = 0.0;

	this.cs = 0;
	this.averageCS = 0.0;
}

// Fetches necessary static data
URFManager.start = function() {
	var that = this;

	// makes the champions array have variables
	URFManager.initiateChampionData = function (champsData) {
		champsData = JSON.parse(champsData).data;

		// populate the champions array
		for(champ in champsData) {
			// do something with that champ data
			var thisChamp = champsData[champ];

			// console.log("Adding: " + thisChamp.name +" with id: " +thisChamp.id);

			that.URFData.champions[thisChamp.id] = new champion(thisChamp.id);
			that.URFData.champions[thisChamp.id].champName = thisChamp.name;

			// console.log("Adding champ name: " + that.URFData.champions[thisChamp.id].champName);
		}
		that.championsDefined = true;

		// start the data collecting cycle
		that.queryCycle();
	}

	URFManager.staticChampsErrorCallback = function() {
		console.log( "ERROR with fetching static champ data");
		process.exit(1);
	}

	APIManager.getAllChampionsData(that.initiateChampionData, that.staticChampsErrorCallback);
}

// rate at which server pulls challenge API data from riot (in ms)
const dataUpdateRate = 1010 * 60 * 5; // 1000 is one second (so we do every five minutes so we dget new challenge games)
const amountOfGamesAnalyzedPerCall = 10;
const gameAnalyzedPerCallRate = 4000; // delay between each call to analyze a game

// this cycle manages the server updating the URF data.
URFManager.queryCycle = function() {
	var that = this; // hacky way to refer to the current obj in "async" calls

	var queryInterval = setInterval(function () {

		// don't update data if not all of the set up data for the champions array is filled
		if(that.championsDefined == false) {
			return;
		}

		var errorCallback = function (errorLog) {
			console.log("Pulling more URF data failed: " + errorLog);
		}

		var successCallBack = function(matchArraydata) {
			
			// console.log("URF Data success: " + matchArraydata);

			var innerSuccessCallBack = function(matchData) {
				matchData = JSON.parse(matchData);

				that.URFData.gamesAnalyzed++;

				// parse champ data for each player in the game
				for(player in matchData.participants) {
					var thisPlayer = matchData.participants[player];

					that.URFData.champions[thisPlayer.championId].totalPlays ++;

					// console.log("Adding new data for champ: " + that.URFData.champions[thisPlayer.championId].champName +
					// 			" totalPlays: " + that.URFData.champions[thisPlayer.championId].totalPlays);

					// console.log("Is a winner: "+thisPlayer.winner);
					if(thisPlayer.stats.winner == true) {
						// console.log("Win time!");
						that.URFData.champions[thisPlayer.championId].totalWins ++;
					}
					else {
						// console.log("Lose time!");
						that.URFData.champions[thisPlayer.championId].totalLosses ++;
					}

					// update total stats
					that.URFData.champions[thisPlayer.championId].kills += thisPlayer.stats.kills;
					that.URFData.champions[thisPlayer.championId].deaths += thisPlayer.stats.deaths;
					that.URFData.champions[thisPlayer.championId].cs += thisPlayer.stats.minionsKilled;
					that.URFData.champions[thisPlayer.championId].gold += thisPlayer.stats.goldEarned;

					// TODO calculate winrate + kda ratios + averages: kills deaths gold cs

					// winrate
					that.URFData.champions[thisPlayer.championId].winRate = that.URFData.champions[thisPlayer.championId].totalWins / 
																				that.URFData.champions[thisPlayer.championId].totalPlays;

					// kill / death
					that.URFData.champions[thisPlayer.championId].kda = that.URFData.champions[thisPlayer.championId].kills / 
																				that.URFData.champions[thisPlayer.championId].deaths;

					// kill + death avg
					that.URFData.champions[thisPlayer.championId].averageKills = that.URFData.champions[thisPlayer.championId].kills / 
																				that.URFData.champions[thisPlayer.championId].totalPlays;
					that.URFData.champions[thisPlayer.championId].averageDeaths = that.URFData.champions[thisPlayer.championId].deaths / 
																				that.URFData.champions[thisPlayer.championId].totalPlays;

					// gold avg
					that.URFData.champions[thisPlayer.championId].averageGold = that.URFData.champions[thisPlayer.championId].gold / 
																				that.URFData.champions[thisPlayer.championId].totalPlays;

					// cs avg
					that.URFData.champions[thisPlayer.championId].averageCS = that.URFData.champions[thisPlayer.championId].cs / 
																				that.URFData.champions[thisPlayer.championId].totalPlays;
				}
			}

			var matchArray = JSON.parse(matchArraydata);

			// for(var i = 0; i < amountOfGamesAnalyzedPerCall; i++) { // matchArray.length; i++) { 

			var currentGameToAnalyze = 0;
			// makes a call to analyze each game returned by the API challenge at a certain interval (to avoid overload)
			var gameAnalyzeInterval = setInterval(function() {
				// console.log("Analyzing game: " + currentGameToAnalyze);

				APIManager.getMatchData(matchArray[currentGameToAnalyze], innerSuccessCallBack, errorCallback);

				currentGameToAnalyze ++;

				// end the analyze loop
				if(currentGameToAnalyze >= amountOfGamesAnalyzedPerCall || currentGameToAnalyze >= matchArray.length) {
					clearInterval(gameAnalyzeInterval);
					gameAnalyzeInterval = 0;
				}
			}, gameAnalyzedPerCallRate);
		}

		// call the API Manager to get 15 game ids (sent to successCallBack).
		APIManager.getMostRecentChallengeAPI(successCallBack, errorCallback);
	}, dataUpdateRate);
}