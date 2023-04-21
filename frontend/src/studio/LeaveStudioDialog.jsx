import React from "react";
import { useState } from "react";
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import styles from './Popup.module.css';

import leaveIcon from "../assets/studio/leaveGroupIcon.png"
import crownedIcon from "../assets/studio/hostCrownIcon.png";
import uncrownedIcon from "../assets/studio/hollowCrownIcon.png";

export default function LeaveStudioDialog({ isDialogOpened, handleCloseDialog, listeners }) {
    const handleClose = () => { handleCloseDialog(false) };
    const handleSubmit = () => {
        if (newHost === null) {
          alert('Please crown a member before submitting.');
          return;
        }
        // TODO: Do something with the new host/return to home
      };
    const [ newHost, setNewHost] = useState(null);
    
    return(
        <Dialog  open={isDialogOpened} onClose={handleClose} fullWidth maxWidth="md" PaperProps={{ style: { backgroundColor: '#F5F5F5',},}}>
            <div className={styles.dialogHeader}>
                <img className={styles.headerIcon} src={leaveIcon}/>
                <h1 className={styles.heading}>Leave Studio</h1>
            </div>
            
            <DialogContent className={styles.dialogContent}>
                <h2 className={styles.subheading}>Assign a new host before leaving</h2>

                <div className={styles.listenerList}>
                    {listeners.map((listener) => (
                        <ListenerListItem key={listener.id} 
                            listener={listener} 
                            isNewHost={listener.id === newHost}
                            setNewHost={setNewHost}
                        />
                    ))}
                </div>
                <DialogActions sx={{ display: 'flex', justifyContent: 'center', mb: 1.5 }}>
                    <Button variant="contained" sx={{ color: '#606060'}} className={styles.greyButton} onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" className={styles.purpleButton} onClick={handleSubmit}>Leave Studio</Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    )
}

function ListenerListItem ({ listener, isNewHost, setNewHost }) {

    // const [isCrowned, setIsCrowned] = useState(false);
  
    const handleClick = () => {
      setNewHost(listener.id);
    };
  
    const crownIcon = isNewHost ? crownedIcon : uncrownedIcon;
  
    return (
      <div className={styles.listenerListItem}>
        <img src={listener.icon}/>
        <p>{listener.username}</p>
        <img src={crownIcon} className={styles.listenerListItemCrown} onClick={handleClick} />
      </div>
    );
  };