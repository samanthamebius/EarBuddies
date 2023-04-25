import spotifyApi from '../api/login.js';

async function searchSpotify(query) {
    return new Promise((resolve, reject) => {
        spotifyApi.search(query, ['track', 'episode', 'audiobook'])
            .then(function (data) {
                console.log('Search by "Love"', data.body);
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

export { searchSpotify };