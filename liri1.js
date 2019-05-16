require("dotenv").config();
var keys = require("./keys.js");
var moment  = require("moment");
var axios = require("axios");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var input = process.argv[3];
switch (command) {
    case "concert-this":
        #();
        break;
    case "spotify-this-song":
        songRequest(input);
        break;
    case "movie-this":
        #();
        break;
    case "do-what-it-says":
        #();
        break;
    default:
        console.log("Invalid operation");
}

function songRequest (songTitle) {
console.log(songTitle);
}