# URF Challenge

An application which provides insights into a URF win ratios for champions in League of Legends 


My API End points:
(Currently only hosted on local host - will update with server later once I have a server running)

## URF Data
### - GET  /URFData

Returns the server's total compiled URF Data as JSON

###### Format:
| Variable Name     | Type      	| Description  												|
| ----------------- |:------------- |:--------------------------------------------------------- |
|**gamesAnalyzed** 	| int 			| The total amount of games the server has analyzed 		|
|**startTime** 		| int 			| The start time of the server's analysis 					|
|**champions**		| array 		| Contains an array of champion objects						|
|**champion**		| object 		| Contains fields relating to a specific champion (below)	|

###### Champion Object:
| Variable Name     | Type      	| Description  											|
| ----------------- |:------------- |:----------------------------------------------------- |
|**champName** 		| String 		| String relating to a champion's id 					|
|**totalPlays** 	| int 			| The number of games a champion has been played in		|
|**totalWins** 		| int 			| The number of games a champion has won in				|
|**totalLosses** 	| int 			| The number of games a champion has lost in			|
|**winRate** 		| double 		| A ratio of wins to losses								|
|**kills** 			| double 		| Average kills per game								|
|**deaths** 		| double 		| Average deaths per game								|
|**kda** 			| double 		| A ratio of kills to death								|
|**gold** 			| double 		| Average gold earned by champion each game				|

### - GET  /playerData?name={summoner_name}

Returns either server's total compiled URF Data as JSON

###### Format:
