import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from "cors";
import bodyParser from "body-parser";
import SpotifyWebApi from "spotify-web-api-node";

const router = express.Router();
router.use(cors())
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))


async function refreshAccessToken(thisSpotifyApi, refresh_tokenSet) {
  console.log("refresh token in refresh: " + refresh_tokenSet)
  thisSpotifyApi.refreshAccessToken()
    .then(function (data) {
      var access_token = data.body['access_token']
      var expires_in = data.body['expires_in']
      thisSpotifyApi.setAccessToken(access_token)
      console.log('The access token has been refreshed!')
    })
    .catch(err => {
      console.log(err)
    })
}

/**
 * @route POST api/refresh
 * @desc Refresh the access token
 * @access Public
 * @param {string} refresh_token - The refresh token
 * @returns {object} - The access token and expiration time
 */
router.post("/", (req, res) => {
  const refresh_token = req.body.refresh_token
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refresh_token,
  })

  spotifyApi
    .refreshAccessToken()
    .then(function (data) {
      var access_token = data.body['access_token']
      var expires_in = data.body['expires_in']
      spotifyApi.setAccessToken(access_token)
      console.log('The access token has been refreshed!')
    })
    .catch(err => {
      console.log(err)
      res.sendStatus(400)
    })

})


export default router;
export { refreshAccessToken }