import React, { useState, useEffect } from "react";
import styles from '../studio/Popup.module.css';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';

export default function ListenerListItem ({ listener }) {
  
    return (
      <div className={styles.listenerListItem}>
        <img src={listener.profilePic}/>
        <p>{listener.userDisplayName}</p>
         <StarRoundedIcon className={styles.hostIcon} style={{ color: "#757575", fontSize: "30px" }} />
    
      </div>
    );
};