"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var fs = require("fs");
var cors = require("cors");
var app = express();
app.use(express.json());
app.use(cors());
var port = 3000;
var rawData = fs.readFileSync("./data.json").toString();
console.log("Loaded movie data into memory...");
var movies = JSON.parse(rawData);
var splitEmoji = function (string) {
    var _a;
    var regex = /\p{RI}\p{RI}|\p{Emoji}(\p{EMod}|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?(\u{200D}\p{Emoji}(\p{EMod}|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?)*|./gus;
    return Array.from((_a = string.match(regex)) !== null && _a !== void 0 ? _a : []);
};
var getAllMovies = function () {
    return movies;
};
var filterMoviesByEmojis = function (selectedEmojis) {
    return movies.filter(function (movie) {
        var movieEmojis = splitEmoji(movie.emojiSummary);
        return selectedEmojis.every(function (selectedEmoji) {
            return movieEmojis.includes(selectedEmoji);
        });
    });
};
app.get('/all-movies', function (req, res) {
    res.set("Access-Control-Allow-Origin", "*");
    res.json(getAllMovies());
});
app.post("/filter-movies", function (req, res) {
    var emojiList = req.body;
    var filteredMovies = filterMoviesByEmojis(emojiList);
    console.log(emojiList);
    res.set("Content-Type", "application/json");
    res.set("Access-Control-Allow-Origin", "*");
    res.json(filteredMovies);
});
app.listen(port, function () {
    console.log("Example app listening on port ".concat(port, "..."));
});
