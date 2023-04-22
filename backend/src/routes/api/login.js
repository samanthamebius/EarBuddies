import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from "cors";
import bodyParser from "body-parser";
import SpotifyWebApi from "spotify-web-api-node";
import mongoose from 'mongoose';
import { loginUser } from '../../database/user_dao';

const router = express.Router();
router.use(cors())
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))
await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });
/**
 * @route POST api/login
 * @desc Login to Spotify and add user to database if not already in it
 * @access Public
 * @param {string} code - The code returned from Spotify's auth server
 * @returns {object} - The access token, refresh token, and expiration time
 */

router.post("/", (req, res) => {
  const code = req.body.code
  console.log("in login.js " + code)
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  })
  spotifyApi
    .authorizationCodeGrant(code)
    .then(function (data) {
      const access_token = data.body.access_token;
      const refresh_token = data.body.refresh_token;
      const expires_in = data.body.expires_in;
      
      console.log('setting access token')
      spotifyApi.setAccessToken(access_token);
      user_id = loginUser(spotifyApi, data);
      console.log('user_id: ' + user_id)

      res.json({
        access_token: access_token,
        refresh_token: refresh_token,
        expires_in: expires_in,
        user_id: user_id,
      });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

export default router;