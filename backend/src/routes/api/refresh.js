import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from "cors";
import bodyParser from "body-parser";
import SpotifyWebApi from "spotify-web-api-node";
import { setAccessToken } from '../dao/spotify_dao';

const router = express.Router();
router.use(cors())
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

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
      setAccessToken(spotifyApi, access_token)
    })
    .catch(err => {
      console.log(err)
      res.sendStatus(400)
    })
})


export default router;