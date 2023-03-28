import * as dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
import express from 'express';
import cors from "cors";
import bodyParser from "body-parser";
import SpotifyWebApi from "spotify-web-api-node";

const router = express.Router();

router.use(cors())
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

//refresh token every hour so that user does not have to re-login
router.post("/refresh", (req, res) => {
    //print out the refresh token
    console.log(req.body.refreshToken)
    
  const refreshToken = req.body.refreshToken
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken,
  })

  spotifyApi
    .refreshAccessToken()
    .then(data => {
      res.json({
        accessToken: data.body.accessToken,
        expiresIn: data.body.expiresIn,
      })
    })
    .catch(err => {
      console.log(err)
      res.sendStatus(400)
    })
})

router.get("/test", (req, res) => {
  res.send("Hello, World");
})

router.post("/login", (req, res) => {
  console.log(req.body.code)
  //print url of post request
  console.log(req.url)

  const code = req.body.code
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  })

  spotifyApi
    .authorizationCodeGrant(code)
    .then(data => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      })
    })
    .catch(err => {
      res.sendStatus(400)
    })
})

export default router;