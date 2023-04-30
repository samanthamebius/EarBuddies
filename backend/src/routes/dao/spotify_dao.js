import dotenv from 'dotenv';
dotenv.config();

var spotifyApi = null;

function setSpotifyApi(api) {
    spotifyApi = api;
    console.log("set api " + spotifyApi);
}

function getSpotifyApi() {
    return spotifyApi;
}

async function searchSpotify(query, thisSpotifyApi) {
    return new Promise((resolve, reject) => {
        console.log(thisSpotifyApi)
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
                console.log("Something went wrong!", err);
                reject(err);
            });
    });
}

export { searchSpotify, setSpotifyApi, getSpotifyApi };