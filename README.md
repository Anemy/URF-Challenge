# URF Challenge

An application which provides insights into a URF win ratios for champions in League of Legends.

Run the server on your localhost (with Node.js installed) using the command:
npm start

My API End points:
(Currently only hosted on local host - will update with server later once I have a server running)

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

###### Format:

---
By Rhys 