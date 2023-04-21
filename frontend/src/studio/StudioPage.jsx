import React from "react";

import styles from './StudioPage.module.css';

import Banner from "./Banner";
import Chat from "./Chat";
import NowPlaying from "./NowPlaying";
import SongSelection from "./SongSelection";
import LeaveStudioDialog from "./LeaveStudioDialog"


function StudioPage() {
  
  return (
    <div className={styles.studio}>
      <Banner/>
      <NowPlaying/>
      <SongSelection/>
      <Chat/>
      <LeaveStudioDialog />
    </div>
  );
}

export default StudioPage;