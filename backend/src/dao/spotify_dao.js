var spotifyApi = null;

function setSpotifyApi(api) {
  spotifyApi = api;
  console.log("Spotify API set");
}

function getSpotifyApi() {
  return spotifyApi;
}


export { setSpotifyApi, getSpotifyApi }