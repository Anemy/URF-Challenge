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

console.log("CurrentTime: " + currentTime);

var getTruncatedFiveMinTime = function(timeVar) {
	timeVar *= 0.01;
	timeVar = Math.floor(timeVar);
	timeVar *= 100;
	return timeVar;
}


// rate at which server pulls challenge API data from riot (in ms)
const dataUpdateRate = 100; // 1000 is one second

// this cycle manages the server updating the URF data.
URFManager.queryCycle = setInterval(function () {
	var errorCallback = function (errorLog) {
		console.log("Pulling more URF data failed: " + errorLog);
	}

	var successCallBack = function(data) {

	}

	APIManager.getMostRecentChallengerAPI(pullTime, );
}, dataUpdateRate);