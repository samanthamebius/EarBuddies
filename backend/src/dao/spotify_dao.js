var spotifyApi = null;

function setSpotifyApi(api) {
  spotifyApi = api;
}

function getSpotifyApi() {
  return spotifyApi;
}


export { setSpotifyApi, getSpotifyApi }