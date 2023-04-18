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

/**
 * @route POST api/login
 * @desc Login to Spotify
 * @access Public
 * @param {string} code - The code returned from Spotify's auth server
 * @returns {object} - The access token, refresh token, and expiration time
 */

router.post("/", (req, res) => {
  const code = req.body.code
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  })
  spotifyApi
    .authorizationCodeGrant(code)
    .then(function(data) {
        var access_token = data.body['access_token']
        var refresh_token = data.body['refresh_token']
        var expires_in = data.body['expires_in']
        spotifyApi.setAccessToken(access_token)
    
        spotifyApi.getMe()
          .then(function(data) {
          var spotifyId = data.body.id
          console.log('User data request success! Id is ' + spotifyId)

          })
          .catch(function(err) {
            console.log('Something went wrong!', err)
          })
      })
})

export default router;