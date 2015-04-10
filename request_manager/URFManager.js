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
	startTime = Date.now(),
	champions: []
};

// used as a champions class for the champions URF data array
var champion = {
	champName: "none",
	totalPlays: 0,
	totalWins: 0,
	totalLosses: 0,
	winRate: 0,
	kda: 0,
	gold: 0
}

// rate at which server pulls challenge API data from riot (in ms)
const dataUpdateRate = 100; // 1000 is one second

// this cycle manages the server updating the URF data.
URFManager.queryCycle = setInterval(function () {

	var that = this; // hacky way to refer to the current obj in "async" calls

	var errorCallback = function (errorLog) {
		console.log("Pulling more URF data failed: " + errorLog);
	}

	var successCallBack = function(data) {
		// TODO: update the URFData according to data
	}

	// call the API Manager to get 15 games.
	APIManager.getMostRecentChallengerAPI(successCallBack, errorCallback);
}, dataUpdateRate);