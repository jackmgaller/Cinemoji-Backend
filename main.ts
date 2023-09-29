import { Request, Response, Express } from "express";

const express = require("express");
const fs = require("fs");
const cors = require("cors");

type Movie = {
    "posterLink": string;
    "rank": string;
    "trend": string;
    "title": string;
    "year": string;
    "genre": string;
    "votes": string;
    "rating": string;
    "emojiSummary": string,
    "index": string
};

const app: Express = express();
app.use(express.json());
app.use(cors());

const port = 3000;

const rawData = fs.readFileSync("./data.json").toString();
console.log("Loaded movie data into memory...")

const movies = JSON.parse(rawData) as Movie[];

const splitEmoji = (string: string): string[] => {
    let regex = /\p{RI}\p{RI}|\p{Emoji}(\p{EMod}|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?(\u{200D}\p{Emoji}(\p{EMod}|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?)*|./gus;

    return Array.from(string.match(regex) ?? []);
}

const getAllMovies = (): Movie[] => {
    return movies;
}

const filterMoviesByEmojis = (selectedEmojis: string[]): Movie[] => {
    return movies.filter(movie => {
        const movieEmojis = splitEmoji(movie.emojiSummary);

        return selectedEmojis.every((selectedEmoji) => {
            return movieEmojis.includes(selectedEmoji);
        })
    });
}

app.get('/all-movies', (req: Request, res: Response) => {

    res.set("Access-Control-Allow-Origin", "*");
    res.json(getAllMovies()); 
});

app.post("/filter-movies", (req: Request, res: Response) => {
    const emojiList: string[] = req.body;
    const filteredMovies = filterMoviesByEmojis(emojiList);

    console.log(emojiList);

    res.set("Content-Type", "application/json");
    res.set("Access-Control-Allow-Origin", "*");
    res.json(filteredMovies);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}...`)
});