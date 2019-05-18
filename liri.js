require("dotenv").config();
var keys = require("./keys.js"); // Get data from keys.js
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
    // get or assemble the song name and store it in a variable called "song"
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

// OMDB Movie Exercise
function movieThis(term) {
   
    var movieName = 'Who Am I?';
    if (term != undefined) {
        movieName = term;
    }
    // Then run a request to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&plot=short&apikey=40e9cece";
    // Then create a request to the queryUrl
    request(queryUrl, function (error, response, body) {
        // If the request is successful
        if (!error && response.statusCode === 200) {
            var movieData = JSON.parse(body);
            // Show the following on the console and log file:
            // * Movie Title.
            // * Year the movie came out.
            // * IMDB Rating of the movie.
            // * Rotten Tomatoes Rating of the movie.
            // * Country where the movie was produced.
            // * Language of the movie.
            // * Plot of the movie.
            // * Actors in the movie.
            var movieInfo = "* Movie Title: " + movieData.Title +
                "* The movie's Release Year is: " + movieData.Year +
                "* The movie's IMDB Rating is: " + movieData.Ratings[0].Value +
                "* The movie's Rotten Tomatoes Rating is: " + movieData.Ratings[1].Value +
                "* The movie was produced in: " + movieData.Country +
                "* The movie's Language is: " + movieData.Language +
                "* The movie's Plot is: " + movieData.Plot +
                "* The movie's Actors include: " + movieData.Actors;

            var dataArr = movieInfo.split("*");
            for (i = 0; i < dataArr.length; i++) {
                console.log(dataArr[i].trim());
                fs.appendFile("log.txt", dataArr[i].trim() + "\n", function (err) {
                    if (err) {
                        return console.log(err);
                    }
                });
            }
            console.log("\n===== log.txt was updated with Movie info! =====");
        }
        else {
            console.log(error);
        }
    });

} 


function concertThis(term) {
    if (!term) {
        term = defaultBand;
    }

    else
        console.log("Requested Artist: " + term.join(' '));
    // console.log("key: " + keys.bands.key);
    var queryUrl = 'https://rest.bandsintown.com/artists/' + term + '/events?app_id=codingbootcamp'

    axios.get(queryUrl).then(function (response) {
        console.log(response);

    })
};