/* This is the routing for basic webpages (landing, sign up, about, etc.) */

var express = require('express');
var url = require('url');
var router = express.Router();

var APIManager = require('../request_manager/APIManager.js');
var URFManager = require('../request_manager/URFManager.js');
URFManager.start();

/* GET player data */
router.get('/playerData*', function(req, res, next) {
	console.log("Req url: " + req.url);
	var queryData = url.parse(req.url, true).query;
    if(queryData.name) {
		// console.log("Requested: " + queryData.name);

		// used when there's an error. Just returns whatever and doesn't try to do more things.
		var errorCallback = function (data) {
			res.status(400);
			res.end(data);
		}


		// used when there's a succcessful request for summoner data (it does more with the data)
		var callback = function (data) {

			// parses the data and gets the summoner ID to give to generate the match history for the client
			var jsonData = JSON.parse(data);
			var username;
			for(username in jsonData) {
				// gets the first element of the json
				break;
			}
			console.log("Summoner id: " + jsonData[username].id);

			var innerCallback = function (innerData) {
				res.status(200);
				res.end(innerData);
			}

			// Calls to get the match history for the requested successful user
			APIManager.getMatchHistory(jsonData[username].id, innerCallback, errorCallback);
		}

		// requests the API manager to get the summoner data, tells it to use the above callbacks accordingly
		APIManager.getSummonerData(queryData.name, callback, errorCallback);
    }
}); 

/* GET URF Stats data */
router.get('/URFData', function(req, res, next) {

	// used when there's an error. Just returns whatever and doesn't try to do more things.
	var errorCallback = function (data) {
		res.end(data);
	}

	// console.log("Sending them: " + JSON.stringify(URFManager.URFData));

	// sends back the API Manager's compiled URF stats
	res.end(JSON.stringify(URFManager.URFData));

	// // used when there's a succcessful request for URF data (it does more with the data)
	// var callback = function (data) {
	// 	// Calls to get the match history for the requested successful user
	// 	APIManager.getMatchHistory(jsonData[username].id, innerCallback, errorCallback);
	// }

	// // requests the API manager to get the summoner data, tells it to use the above callbacks accordingly
	// APIManager.getSummonerData(queryData.name, callback, errorCallback);
}); 


/* GET about page */
router.get('/about', function (req, res, next) {

	res.render('about', {title: 'League Nemesis About'});
});

/* GET home page. */
router.get('/*', function (req, res, next) {
	// var queryData = url.parse(req.url, true).query;

    res.render('index', { title: 'League Nemesis'});
});

module.exports = router;
 