import * as React from 'react';
// import useAuth from "./useAuth";
import StudioCard from "./StudioCard";
import styles from './HomePage.module.css';
import Button from '@mui/material/Button';
import { style } from '@mui/system';
import SoundWavesGradient from './assets/soundwavesgradient.png';
import SearchBar from './SearchBar';


function HomePage({ code }) {
  // const accessToken = useAuth(code);
  return (
    <div className={styles.container}>
      <div className={styles.containerChild} style={{marginRight: '45px'}}>
        <div className={styles.header}>
          <h1 className={styles.headings}>My Studios</h1>
          <div className={styles.headerChild}>
            <Button variant="contained" size="large" className={styles.button}>+ Create Studio</Button>
          </div>
        </div>
        <SearchBar />
        <StudioCard />
        <StudioCard />
        <StudioCard />
        <StudioCard />
        <StudioCard />
        <StudioCard />
      </div>
      <div className={styles.containerChild}>
        <div className={styles.listeningHeader}>
          <h1 className={styles.headings}>Listening Now</h1>
          <div className={styles.headerChild}>
            <img src={SoundWavesGradient} className={styles.soundWaves}></img>
          </div>
        </div>
        <StudioCard />
        <StudioCard />
      </div>
    </div>
  );
}

export default HomePage; 