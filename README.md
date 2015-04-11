# URF Challenge

An application which provides insights into a URF win ratios for champions in League of Legends 


My API End points:
(Currently only hosted on local host - will update with server later once I have a server running)

## URF Data
### - GET  /URFData

Returns the server's total compiled URF Data as JSON

###### Format:
| Variable Name     | Type      	| Description  											|
| ----------------- |:------------- |:----------------------------------------------------- |
|**gamesAnalyzed** 	| int 			| The total amount of games the server has analyzed 	|
|**startTime** 		| int 			| The start time of the server's analysis 				|
|**champions**		| array 		| Contains an array of champion objects					|

### - GET  /playerData?name={summoner_name}

Returns either server's total compiled URF Data as JSON

###### Format:
