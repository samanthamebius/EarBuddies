import styles from './StudioPage.module.css'
import * as React from "react";

import TaylorSwiftImg from '../assets/taylorswift.png';

import ProfilePicImg1 from '../assets/profilepic1.png';
import ProfilePicImg2 from '../assets/profilepic2.png';
import ProfilePicImg3 from '../assets/profilepic3.png';
import ProfilePicImg4 from '../assets/profilepic4.png';
import ProfilePicImg5 from '../assets/profilepic5.png';
import ProfilePicImg6 from '../assets/profilepic6.png';
import ListenerIcons from '../shared/ListenerIcons';

import AddListenerIcon from '../assets/addListenerIcon.png';

const studioName = "Software Swifties"
const backgroundImage = TaylorSwiftImg;
const hostImage = ProfilePicImg1;
const isListening = true;

const listenersImages = [ProfilePicImg1, ProfilePicImg2, ProfilePicImg3, ProfilePicImg4, ProfilePicImg5, ProfilePicImg6]; 
const listenersActive = [true, true, false, false, true, false];

export default function Banner() {
  listenersImages.push(AddListenerIcon)
  listenersActive.push(true)
  
  return (
    <div className={styles.banner} style={backgroundImage ? {backgroundImage: `url(${backgroundImage})`} : {backgroundColor: '#797979'}}>
      <div className={styles.bannerCardContent}>
        <div className={styles.bannerStudioNameSection}>
          <h1 className={styles.bannerStudioName}>{studioName}</h1>
        </div>
        <div className={styles.bannerlisteners}>
        <ListenerIcons isListening={isListening} profileImages={listenersImages} profileStatus={listenersActive}/>                        
        </div>
      </div>
    </div>
  );
}