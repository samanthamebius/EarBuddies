import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from "cors";
import bodyParser from "body-parser";
import SpotifyWebApi from "spotify-web-api-node";
import mongoose from 'mongoose';
import { User } from '../../database/schema';

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

      res.json({
        access_token: access_token,
        refresh_token: refresh_token,
        expires_in: expires_in,
      });
      spotifyApi.setAccessToken(access_token)


      spotifyApi.getMe()
        .then(async function (data) {
          const user = await User.find({ username: data.body.id })
          // check to see if user in db
          if (user.length === 0) {
            // check to see if user has a profile pic
            const newUser = new User({
              username: data.body.id,
              userDisplayName: data.body.display_name,
              profilePic: `${data.body.images.length === null ? "" : data.body.images[0].url}`,
              userIsActive: true,
              userStudios: [],
            });
            await newUser.save()
          } else {
            const updateUser = await User.findOneAndUpdate({ username: data.body.id }, { userIsActive: true })
          }

        })
        .catch(function (err) {
          console.log('Something went wrong!', err)
        })
    })
})

export default router;