import React from "react";
import styles from './StudioPage.module.css'
import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';

import pause_btn from '../assets/now_playing/pause_btn.png'
import play_btn from '../assets/now_playing/play_btn.png'
import next_btn from '../assets/now_playing/next_btn.png'
import prev_btn from '../assets/now_playing/prev_btn.png'
import VolumeDown from '../assets/now_playing/volume_down.png'
import VolumeUp from '../assets/now_playing/volume_up.png'

import album_artwork from '../assets/now_playing/album_artwork_PLACEHOLDER.png'
import artist_profile from '../assets/now_playing/artist_profile_PLACEHOLDER.png'

import { styled, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

export default function NowPlaying() {
  
  return (
    <div className={styles.nowplaying}>
      <SongInfo/>
      <ControlPanel/>
    </div>
  );
}

function SongInfo() {
  return (
    <div>

        <div className={styles.song}>
          <h3>champagne problems</h3>
        </div>
        
        <div className={styles.artist}>
          <img className={styles.artistImg} src={artist_profile}/>
          <div className={styles.artistName}>Taylor Swift</div>
        </div>

        <div className={styles.artwork}>
          <img className={styles.albumArtwork} src={album_artwork}/>
      </div>
    </div>

  )
}

function ControlPanel() {

  const [isPlaying, setPlaying] = useState(false);

  return (
    <div className={styles.controlPanel}>
      <div className={styles.playbackCntrls}>
        <img className={styles.changeSongBtn} src={prev_btn}/>
        <img className={styles.playBtn} src={isPlaying ? pause_btn : play_btn }
              onClick={() => setPlaying(!isPlaying)} />
        <img className={styles.changeSongBtn} src={next_btn}/>
      </div>
      <TimeSlider/>
      <VolumeSlider/>
      
    </div>
  )
}

export function VolumeSlider() {
  const [value, setValue] = React.useState(30);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={styles.volume}>
      <Box fullwidth>
        <Stack spacing={2} direction="row" sx={{ m: 1 }} alignItems="center">
          <img src={VolumeDown} className={styles.volIcon}/>
          <Slider className={styles.slider} aria-label="Volume" value={value} onChange={handleChange} />
          <img src={VolumeUp} className={styles.volIcon}/>
        </Stack>
     </Box>
    </div>
  );
}

export function TimeSlider() {

  const duration = 200; //seconds
  const [position, setPosition] = React.useState(32);

  const TinyText = styled(Typography)({
    fontSize: '0.75rem',
    opacity: 0.38,
    fontWeight: 500,
    letterSpacing: 0.2,
  });

  function formatDuration(value) {
    const minute = Math.floor(value / 60);
    const secondLeft = value - minute * 60;
    return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
  }

  return (
    <div className={styles.time}>
      <Slider
          aria-label="time-indicator"
          size="small"
          value={position}
          min={0}
          step={1}
          max={duration}
          onChange={(_, value) => setPosition(value)}
          sx={{
            height: 4,
            '& .MuiSlider-thumb': {
              width: 8,
              height: 8,
              transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
              '&:before': {
                boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
              },
              '&:hover, &.Mui-focusVisible': {
              },
              '&.Mui-active': {
                width: 20,
                height: 20,
              },
            },
            '& .MuiSlider-rail': {
              opacity: 0.28,
            },
          }}
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: -2,
          }}
        >
          <TinyText>{formatDuration(position)}</TinyText>
          <TinyText>-{formatDuration(duration - position)}</TinyText>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: -1,
          }}
        ></Box>
    </div>
  )
}

