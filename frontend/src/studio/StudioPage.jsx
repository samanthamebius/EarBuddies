import React from "react";

import styles from './StudioPage.module.css';

import Banner from "./Banner";
import Chat from "./Chat";
import NowPlaying from "./NowPlaying";
import Queue from "./Queue";


function StudioPage() {
  
  return (
    <div className={styles.studio}>
      <Banner/>
      <NowPlaying/>
      <Queue/>
      <Chat/>
    </div>
  );
}

export default StudioPage;