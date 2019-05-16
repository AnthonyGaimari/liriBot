require("dotenv").config();
var keys = require("./keys.js"); // Grab data from keys.js
var fs = require("fs"); // node package for reading and writing files
var request = require("request"); // node package for making http requests
var Spotify = require("node-spotify-api"); // node package that handles Spotify requests
var axios = require('axios');
var https = require('https');


var command = process.argv[2];
var term = process.argv.slice(3);
var defaultSong = 'The Sign'
var defaultBand = 'Mr. Nobody'

switch (command) {

    case "spotify":
        spotifyThisSong(term);
        break;

    case "movie":
        movieThis(term);
        break;

    case "concert":
        concertThis(term);
        break;

    case "do-what-it-says":
        doWhatItSays();
        break;

    default:
        console.log("You must pass an command [spotify, movie, do-what-it-says] and a term");
        console.log("Example node liri.js movie-this Jumanji");
        break;
}

//Spotify 
function spotifyThisSong(term) {
    // Grab or assemble the song name and store it in a variable called "song"
    var song;

    if (term != undefined) {
        song = term;
    }
    else song = defaultSong;
    // Then run a request to the Spotify API with the track title specified
    var spotify = new Spotify({
        id: keys.spotify.id,
        secret: keys.spotify.secret
    });

    spotify.search({ type: 'track', query: song, limit: 5 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        // Show the following on the console and log file:
        // * Artist(s)
        // * The song's name
        // * A preview link of the song from Spotify
        // * The album that the song is from
        var firstResult = data.tracks.items[0];
        var trackInfo = "* Track Title: " + firstResult.name +
            "* Artist(s): " + firstResult.album.artists[0].name +
            "* Preview Link: " + firstResult.external_urls.spotify +
            "* Album Name: " + firstResult.album.name

        var dataArr = trackInfo.split("*");
        for (i = 0; i < dataArr.length; i++) {
            console.log(dataArr[i].trim());
            fs.appendFile("log.txt", dataArr[i].trim() + "\n", function (err) {
                if (err) {
                    return console.log(err);
                }
            });
        }
        console.log("\n===== log.txt was updated =====");

    });
} 
	//Do What it Says 
    function doWhatItSays() {
        fs.readFile("random.txt", "utf8", function (error, data) {
            if (error) {
                console.log(error);
            }
            else {
                var randomDataArray = data.split(',');
                var command = randomDataArray[0];
                var term = randomDataArray[1];
                switch (command) {
                    case "spotify-this-song":
                        spotifyThisSong(term);
                        break;
                    case "movie-this":
                        movieThis(term);
                        break;
                }
            }
        });
    
    } 

// TestGit push