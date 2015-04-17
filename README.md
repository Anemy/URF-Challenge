# URF Challenge

An application which provides insights into a URF win ratios for champions in League of Legends.

This repo contains the mobile app, web app, and server for the URF Challenge Statistics.

Check out the Web app here:
http://vowb.net:4000/URF

Here are some screenshots!
(Scroll to the bottom for more info and how to run it :)

___
![Alt text](http://i.imgur.com/lNFfUGV.png)
![Alt text](http://i.imgur.com/PpnoR4L.png)
![Alt text](http://i.imgur.com/zvTMmLV.png)
![Alt text](http://i.imgur.com/7jcvudp.jpg)
___

Run the server on your localhost (with Node.js installed) using the command:
npm start

If you'd like to have the server pull data from the API for you, rather than use our compiled URF Data you can change the variable APIManager.fetchNewData at the top of request_manager/APIManager.js  to true.
You'll notice it will error unless you set an environment variable with your api key like so:
export riotAPIKey=YOUR_RIOT_API_KEY


From there you will be able to connect to the web app locally.
You can run the iOS app through xCode (It isn't published on the iOS store yet).

My API End points:
http://vowb.net:4000/URFData

## URF Data
### - GET  /URFData

Returns the server's total compiled URF Data as JSON

###### Format:
| Variable Name     | Type      	| Description  												|
| ----------------- |:------------- |:--------------------------------------------------------- |
|**gamesAnalyzed** 	| int 			| The total amount of games the server has analyzed 		|
|**startTime** 		| int 			| The start time of the server's analysis (epoch)			|
|**champions**		| array 		| Contains an array of champion objects						|
|**champion**		| object 		| Contains fields relating to a specific champion (below)	|

###### Champion Object:
| Variable Name     | Type      	| Description  											|
| ----------------- |:------------- |:----------------------------------------------------- |
|**champName** 		| String 		| String relating to a champion's id 					|
|**champID** 		| int 			| Riot's API champion ID								|
|**totalPlays** 	| int 			| The number of games a champion has been played in		|
|**totalWins** 		| int 			| The number of games a champion has won in				|
|**totalLosses** 	| int 			| The number of games a champion has lost in			|
|**winRate** 		| double 		| A ratio of wins to losses								|
|**kills** 			| int 			| Total kills for all games								|
|**assists** 		| int 			| Total assists for all games							|
|**deaths** 		| int 			| Total deaths for all games							|
|**averageKills** 	| double 		| Average kills per game								|
|**averageAssists** | double 		| Average assists per game								|
|**averageDeaths** 	| double 		| Average deaths per game								|
|**kda** 			| double 		| A ratio of average kills + assists to death			|
|**gold** 			| int 			| Total gold earned by a champion 						|
|**averageGold** 	| double 		| Average gold earned by champion each game				|
|**cs** 			| int 			| Total cs earned by champion 							|
|**averageCS** 		| double 		| Average cs earned by champion each game				|

### - GET  /playerData?name={summoner_name}

Currently just returns the requested summoner's past 10 matches as JSON (under development)
Will be used to return nemesis data.

---
###### By Rhys Howell & George Lo
https://github.com/Anemy
https://github.com/twgeolo