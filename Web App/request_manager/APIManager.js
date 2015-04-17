/* This javascript regulates and limits requests made to the Riot API */

// package for HTTP requests
var request = require('request');

var APIManager = module.exports = {
	// contains requests to the API made recently, used to control limits
	// each varaible is the time it was sent
	recentRequests: []
}

// Make this variable true if you'd like to pull all of the data from the API (it compiles it overtime)
APIManager.fetchNewData = false;

if(APIManager.fetchNewData) {
	console.log("The server will pull URF Challenge data from the riot API.");

	// Gets the environemental variable which holds your API key (this is on github so I don't want to post mine)
	APIManager.API_Key = process.env.riotAPIKey;

	if(APIManager.API_Key == undefined) {
		console.log("API Key undefined. Please set the environemental variable or hardcode it. Now crashing.");
		APIManager.YOU_NEED_A_API_KEY_ENVIRONMENT_VARIABLE_NAMED_riotAPIKey();
	}
}
else {
	console.log("The server will use already compiled URF Challenge data from the riot API.");
}

// console.log("Your api key: " + process.env.riotAPIKey);

APIManager.APILimitPerTenMinutes = 499;
APIManager.APILimitPerTenSeconds = 9;

// change this to pull data from another region
APIManager.region = "na";

// used to check if a user can make a request to the API (they aren't over the limit)
// returns true if allowed and also updates recent requests
APIManager.checkAllowedRequest = function() {
	// First just purge old requests (> 10 minutes)
	for(var i = this.recentRequests.length - 1; i >= 0; i++) {
		if(Date.now() - this.recentRequests[i] > 1000 * 60 * 10) {
			// remove the element > 10 minutes old
			this.recentRequests.splice(i, 1);
		}
		else {
			// stop checking if the time isn't over 10 minutes
			break;
		}
	}

	var requestsInLast10Seconds = 0;
	var requestsInLast10Minutes = this.recentRequests.length;

	// computes requests done in last 10 seconds
	for(var i = 0; i < this.recentRequests.length; i++) {
		if(Date.now() - this.recentRequests[i] < 12*1000) {
			requestsInLast10Seconds++;
		}
		else {
			// stop checking if the time is over 10 seconds
			break;
		}
	}

	// Checks if the user is over the API limit (should we allow or not)
	if(requestsInLast10Minutes < this.APILimitPerTenMinutes && requestsInLast10Seconds < this.APILimitPerTenSeconds) {
		this.recentRequests.unshift(Date.now());

		return true;
	}

	return false;
}

// makes a request to a passed url
// calls the callback for the data from the request or an error string
APIManager.makeRequest = function (url, callback, errorCallback) {

	if(!this.checkAllowedRequest()) {
		// console.log("No allowed req");
		errorCallback("overload");
	}

	// console.log("Making request to: " + url);

	request( url , function (error, response, body) {
		if (!error && response.statusCode == 200) {
			callback(body);
		}
		else {
			// console.log("Response: " + JSON.stringify(response));
			// console.log("Status code: " + response.statusCode);
			if(response == undefined || response.statusCode == undefined) {
				errorCallback("error");
			}
			else if(response.statusCode == 500) {
				errorCallback("error");
			}
			else if(response.statusCode == 429) {
				// console.log("Overload their side.");
				errorCallback("overload");
			}
			else if(response.statusCode == 404) {
				errorCallback("not found");
			}
			else {
				errorCallback("error");
			}
		}
	});
}

// used to call API for summoner data
APIManager.getSummonerData = function (summonerName, callback, errorCallback) {
	// console.log("retrieving summoner Data");
	summonerData = this.makeRequest("https://na.api.pvp.net/api/lol/" + this.region + "/v1.4/summoner/by-name/" + summonerName + "?api_key=" + this.API_Key , callback, errorCallback);
	// console.log("Returning data: " + summonerData);
	// return summonerData;
	
}

// gets a summoner's most recent 10 games. (gameIDs)
APIManager.getMatchHistory = function (summonerID, callback, errorCallback) {
	matchHistoryData = this.makeRequest("https://na.api.pvp.net/api/lol/" + this.region + "/v2.2/matchhistory/" + summonerID + "?api_key="+this.API_Key, callback, errorCallback);
}

// Retrieves individual match's data
APIManager.getMatchData = function (matchID, callback, errorCallback) {
	challengerAPIData = this.makeRequest('https://na.api.pvp.net/api/lol/na/v2.2/match/' + matchID + '?includeTimeline=false&api_key=' + this.API_Key, callback, errorCallback);
}

APIManager.getChallengeAPI = function (beginDate, callback, errorCallback) {
	challengerAPIData = this.makeRequest("https://na.api.pvp.net/api/lol/na/v4.1/game/ids?beginDate=" + beginDate + "&api_key=" + this.API_Key, callback, errorCallback);
}

// used to get the Challenge API acceptable time A DAY AGO
APIManager.getTruncatedFiveMinTime = function(timeVar) {

	// var fromtimevar = new Date(timeVar.getFullYear(),1,1,4,55); // 4:55

    timeVar.setSeconds(0);//,0);
    timeVar.setMilliseconds(0);
    timeVar.setDate(timeVar.getDate() - 1); // get the day before, because those games are over.
    if(timeVar.getDate() == -1) {
    	// TODO: actually give the right day for this edge case
    	timeVar.setDate(28);
    }
    // console.log("Minutes before: " + timeVar.getMinutes());
    timeVar.setMinutes(timeVar.getMinutes() - (timeVar.getMinutes()%5));
    // console.log("Minutes after: " + timeVar.getMinutes());


    return timeVar.getTime();
}

// calls the API challenge with a time stamp of one day ago grounded to the nearest 5 minute
APIManager.getMostRecentChallengeAPI = function (callback, errorCallback) {

	var currentTime = new Date(); // .parseDate();

	var pullTime = (this.getTruncatedFiveMinTime(currentTime)*0.001);//+200;

	// console.log("Date:Hours:Minutes:Seconds:Milliseconds  |  " + currentTime.getDate() + " : " + currentTime.getHours() + " : " + currentTime.getMinutes() + " : " + currentTime.getSeconds() + " : " + currentTime.getMilliseconds());

	// console.log("Request: https://na.api.pvp.net/api/lol/na/v4.1/game/ids?beginDate=" + pullTime + "&api_key=" + this.API_Key);

	this.makeRequest("https://na.api.pvp.net/api/lol/na/v4.1/game/ids?beginDate=" + pullTime + "&api_key=" + this.API_Key, callback, errorCallback);
}

// used to fetch the static data of all champions in the game (names etc.)
APIManager.getAllChampionsData = function(callback, errorCallback) {
	this.makeRequest("https://na.api.pvp.net/api/lol/static-data/na/v1.2/champion?api_key=" + this.API_Key, callback, errorCallback);
}

// TODO: 40 requests for summoner data is allowed per call. optomize (build up?)

/*
Example Requests:

API Challenge (list of games since epoch) (URF)
https://na.api.pvp.net/api/lol/na/v4.1/game/ids?beginDate=1428314700&api_key=

Get Match id (with timeline false)
https://na.api.pvp.net/api/lol/na/v2.2/match/1786138920?includeTimeline=false&api_key=

Get list of all static champions
https://na.api.pvp.net/api/lol/static-data/na/v1.2/champion?api_key=

*/


