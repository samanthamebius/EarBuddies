import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import SpotifyWebApi from "spotify-web-api-node";
import { getUser, loginUser, setUserActive } from '../../dao/user_dao';
import { setSpotifyApi } from '../../dao/spotify_dao';
import { setStudioStatus } from '../../dao/studio_dao';

const router = express.Router();
/**
 * @route POST api/login
 * @desc Login to Spotify and add user to database if not already in it
 * @param {string} code - The code returned from Spotify's auth server
 * @returns {object} - The access token, refresh token, and expiration time
 * @throws {400} - If there is an error logging in
 */
router.post("/", async (req, res) => {
  const code = req.body.code;
  const spotifyApi = new SpotifyWebApi({
		redirectUri: process.env.REDIRECT_URI,
		clientId: process.env.CLIENT_ID,
		clientSecret: process.env.CLIENT_SECRET,
  });
  try {
    //exchange code for access token
    const data = await spotifyApi.authorizationCodeGrant(code);
    const access_token = data.body.access_token;
    const refresh_token = data.body.refresh_token;
    const expires_in = data.body.expires_in;

    //set spotify api connection to be used throughout app
    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);
    setSpotifyApi(spotifyApi);

    //set user active
    const username = await loginUser(spotifyApi, data);
    await setUserActive(username);
    const user = await getUser(username);
    user.userStudios.forEach(async (studio) => {
      await setStudioStatus(studio);
    });

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