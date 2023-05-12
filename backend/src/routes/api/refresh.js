import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import SpotifyWebApi from "spotify-web-api-node";

const router = express.Router();

/**
 * @route POST api/refresh
 * @desc Refresh the access token
 * @param {string} refresh_token - The refresh token
 * @returns {object} - The access token and expiration time
 * @throws {400} - If there is an error refreshing the token
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
      spotifyApi.setAccessToken(data.body['access_token']);
      spotifyApi.setExpiresIn(data.body['expires_in']);
    })
    .catch(err => {
      console.log(err)
      res.sendStatus(400)
    })

})

export default router;