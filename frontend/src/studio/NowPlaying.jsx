import React from "react";
import styles from './StudioPage.module.css'
import { useState } from 'react';

import pause_btn from '../assets/now_playing/pause_btn.png'
import play_btn from '../assets/now_playing/play_btn.png'

export default function NowPlaying() {
  
  return (
    <div className={styles.nowplaying}>
      <label className={styles.greyheading}>Now Playing</label>
      <ControlPanel/>
    </div>
  );
}

function ControlPanel() {

  const [isPlaying, setPlaying] = useState(false);

  return (
    <div>

      <img className={styles.playBtn} src={isPlaying ? pause_btn : play_btn }
            onClick={() => setPlaying(!isPlaying)} />
    </div>
  )
}