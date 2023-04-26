import { spotifyApi } from '../api/login'

var thisSpotifyApi = null;

async function setAccessToken(spotifyApi, access_token) {
    console.log("setting token")
    thisSpotifyApi = spotifyApi;
    thisSpotifyApi.setAccessToken(access_token);
}

async function searchSpotify(query) {
    return new Promise((resolve, reject) => {
        thisSpotifyApi.search(query, ['track', 'episode', 'audiobook'])
            .then(function (data) {
                console.log('Search by "Love"', data.body.tracks.items[0].album.images[0].url);
                // want an image to show (from album)
                // song name
                // artist name
                // spotify id
            })
            .catch(function (err) {
                console.log("Something went wrong!", err);
                reject(err);
            });
    });
}

export { searchSpotify, setAccessToken };