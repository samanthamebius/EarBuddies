import logos from './assets/login/logos.png';
import styles from './LogInPage.module.css'
import * as React from 'react';
import Button from '@mui/material/Button';
import { style } from '@mui/system';

function LogInPage() {

    return (
        <div className={styles.page}>
            <img src={logos} className={styles.logo}/>
            <h1>EAR BUDDIES</h1>            
            <Button variant="contained" size="large" className={styles.button}>
                 Log in using Spotify
            </Button>
        </div>
    )
} export default LogInPage