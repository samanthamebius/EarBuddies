import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from "cors";
import bodyParser from "body-parser";
import SpotifyWebApi from "spotify-web-api-node";
import mongoose from 'mongoose';
import { loginUser, setUserActive } from '../../dao/user_dao';
import { setSpotifyApi } from '../../dao/spotify_dao';

const router = express.Router();
router.use(cors())
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))
await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });
const spotifyApi = new SpotifyWebApi({
  redirectUri: process.env.REDIRECT_URI,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});


/**
 * @route POST api/login
 * @desc Login to Spotify and add user to database if not already in it
 * @access Public
 * @param {string} code - The code returned from Spotify's auth server
 * @returns {object} - The access token, refresh token, and expiration time
 */
router.post("/", async (req, res) => {
  const code = req.body.code;
  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const access_token = data.body.access_token;
    const refresh_token = data.body.refresh_token;
    const expires_in = data.body.expires_in;

    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);
    setSpotifyApi(spotifyApi);
    const username = await loginUser(spotifyApi, data);
    await setUserActive(username);

    res.json({
      access_token: access_token,
      refresh_token: refresh_token,
      expires_in: expires_in,
      user_id: username,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

export default router;
export { spotifyApi };