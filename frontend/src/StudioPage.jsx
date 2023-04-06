import React from "react";

import styles from './studio/StudioPage.module.css';

import Banner from "./studio/Banner";
import Chat from "./Studio/Chat";
import NowPlaying from "./studio/NowPlaying";
import Queue from "./studio/Queue";


function StudioPage() {
  
  return (
    <div>
      <Banner/>
      <NowPlaying/>
      <Queue/>
      <Chat/>
    </div>
  );
}

export default StudioPage;