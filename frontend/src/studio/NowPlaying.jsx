import React from "react";
import styles from './StudioPage.module.css'
import { useState } from 'react';

import pause_btn from '../assets/now_playing/pause_btn.png'
import play_btn from '../assets/now_playing/play_btn.png'

import album_artwork from '../assets/now_playing/album_artwork_PLACEHOLDER.png'
import artist_profile from '../assets/now_playing/artist_profile_PLACEHOLDER.png'

export default function NowPlaying() {
  
  return (
    <div className={styles.nowplaying}>
      <label className={styles.greyheading}>Now Playing</label>
      <SongInfo/>
      <ControlPanel/>
    </div>
  );
}

function SongInfo() {
  return (
    <div className={styles.songInfo}>
      <img className={styles.albumArtwork} src={album_artwork}/>
      <h1>champagne problems</h1>
      <div>
        <img src={artist_profile}/>
        <h2>Taylor Swift</h2>
      </div>
    </div>
  )
}

function ControlPanel() {

  const [isPlaying, setPlaying] = useState(false);

  return (
    <div className={styles.controlPanel}>
      <img className={styles.playBtn} src={isPlaying ? pause_btn : play_btn }
            onClick={() => setPlaying(!isPlaying)} />
    </div>
  )
}