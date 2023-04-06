import React from "react";

import styles from './studio/StudioPage.module.css';

import Banner from "./studio/Banner";
import Chat from "./studio/Chat";
import NowPlaying from "./studio/NowPlaying";
import Queue from "./studio/Queue";


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