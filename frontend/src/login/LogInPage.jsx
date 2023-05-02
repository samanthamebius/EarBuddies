import logos from '../assets/login/logos.png';
import styles from './LogInPage.module.css'
import * as React from 'react';
import Button from '@mui/material/Button';
import { style } from '@mui/system';

//declare the base url for the spotify authorization endpoint
const AUTH_BASE_URL = "https://accounts.spotify.com/authorize"
const CLIENT_ID = "37e7ffef26fd406abcbe2eb521d1f749"
const REDIRECT_URI = "http://localhost:5173/"
//declare what permissions you want to request from the user
const SCOPE = encodeURIComponent("user-read-playback-state user-modify-playback-state user-read-currently-playing streaming playlist-read-private playlist-read-collaborative user-read-playback-position user-read-email user-read-private playlist-modify-private playlist-modify-public")
const AUTH_URL = `${AUTH_BASE_URL}?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}&show_dialog=true`


function LogInPage() {

    return (
        <div className={styles.page}>
            <img src={logos} className={styles.logo}/>
            <h1 className={styles.brandName}>EAR BUDDIES</h1>            
            <Button variant="contained" size="large" className={styles.button}>
                 <a className={styles.link} href={AUTH_URL}>Log In Using Spotify</a>
            </Button>
        </div>
    )
} export default LogInPage