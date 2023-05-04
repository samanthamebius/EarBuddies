import React, { useState } from "react";
import styles from './StudioPage.module.css'
import WebPlayback from "./WebPlayback";


export default function NowPlaying() {
  const accessToken = localStorage.getItem("access_token");
  return (
    <div className={styles.nowplaying}>
      {/* <SongInfo/>
      <ControlPanel/> */}
      <WebPlayback token={accessToken.replace(/['"]+/g, '')} />
    </div>
  );
}

