async function searchSpotify(spotifyApi, query) {
    return new Promise((resolve, reject) => {
        spotifyApi
            //actually could just use search because it searches all types
            .search(query, ['track', 'episode', 'audiobook'])
            .then(function (data) {
                resolve(data.body.tracks.items);
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