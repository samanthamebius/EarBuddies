import { spotifyApi } from '../api/login'
import dotenv from 'dotenv';
dotenv.config();
import { refreshAccessToken } from '../api/refresh';

var thisSpotifyApi = null;

async function setAccessToken(spotifyApi, access_token, refresh_token) {
    console.log("setting token")
    thisSpotifyApi = spotifyApi;
    thisSpotifyApi.setRefreshToken(refresh_token);
    thisSpotifyApi.setAccessToken(access_token);
}

async function searchSpotify(query, refresh_token) {
    if (thisSpotifyApi == null) {
        thisSpotifyApi = spotifyApi;
        thisSpotifyApi.setRefreshToken(refresh_token);
        console.log(refresh_token.replace(/['"]+/g, ''));
        console.log("spotify api not set")
        refreshAccessToken(thisSpotifyApi, refresh_token.replace(/['"]+/g, ''));
    }
    return new Promise((resolve, reject) => {
        thisSpotifyApi.search(query, ['track', 'episode', 'audiobook'])
            .then(function (data) {
                const results = [];
                for (var i = 0; i < data.body.tracks.items.length; i++) {
                    const track = {
                        name: data.body.tracks.items[i].name,
                        image: data.body.tracks.items[i].album.images[0].url,
                        artists: [],
                        id: data.body.tracks.items[i].id,
                        type: "track"
                    }
                    for (var j = 0; j < data.body.tracks.items[i].artists.length; j++) {
                        track.artists.push(data.body.tracks.items[i].artists[j].name);
                    }
                    results.push(track);
                }
                for (var i = 0; i < data.body.episodes.items.length; i++) {
                    const episode = {
                        name: data.body.episodes.items[i].name,
                        image: data.body.episodes.items[i].images[0].url,
                        id: data.body.episodes.items[i].id,
                        type: "episode"
                    }
                    results.push(episode);
                }
                for (var i = 0; i < data.body.audiobooks.items.length; i++) {
                    const audiobook = {
                        name: data.body.audiobooks.items[i].name,
                        image: data.body.audiobooks.items[i].images[0].url,
                        id: data.body.audiobooks.items[i].id,
                        authors: [],
                        type: "audiobook"
                    }
                    for (var j = 0; j < data.body.audiobooks.items[i].authors.length; j++) {
                        audiobook.authors.push(data.body.audiobooks.items[i].authors[j].name);
                    }
                    if (!data.body.audiobooks.items[i].explicit) {
                        results.push(audiobook);
                    }
                }
                resolve(results);
            })
            .catch(function (err) {
                if (err.statusCode == 401) {
                    console.log("refreshing token");
                    refreshAccessToken(thisSpotifyApi, refresh_token.replace(/['"]+/g, ''));
                }
                console.log("Something went wrong!", err);
                reject(err);
            });
    });
}

export { searchSpotify, setAccessToken };