import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import styles from './Popup.module.css';

import leaveIcon from "../assets/studio/leaveGroupIcon.png"
import crownedIcon from "../assets/studio/hostCrownIcon.png";
import uncrownedIcon from "../assets/studio/hollowCrownIcon.png";

export default function LeaveStudioDialog({ isDialogOpened, handleCloseDialog, listeners }) {
    const [isHostErrorMessage, setIsHostErrorMessage] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

	const handleConfirmOpen = () => {
		setIsConfirmOpen(!isConfirmOpen);
	};

    const handleClose = () => { handleCloseDialog(false) };
    const handleSubmit = () => {
        if (newHost === null) {
            setIsHostErrorMessage(true);
        } else {
            setIsHostErrorMessage(false);
            handleConfirmOpen();
        }
      };
    const [ newHost, setNewHost] = useState(null);
    
    return(
        <Dialog  open={isDialogOpened} onClose={handleClose} fullWidth maxWidth="sm" PaperProps={{ style: { backgroundColor: '#F5F5F5',},}}>
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
                {isHostErrorMessage && <p className={styles.helperText}>You must select a host</p> }
                <DialogActions sx={{ display: 'flex', justifyContent: 'center', mb: 1.5 }}>
                    <Button variant="contained" sx={{ color: '#606060'}} className={styles.greyButton} onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" className={styles.purpleButton} onClick={handleSubmit}>Leave Studio</Button>
                </DialogActions>
                <ConfirmLeave 
                    isConfirmDialogOpened={isConfirmOpen}
					handleCloseConfirmDialog={() => setIsConfirmOpen(false)}
                    handleClose={handleClose}/>
            </DialogContent>
        </Dialog>
    )
}

function ListenerListItem ({ listener, isNewHost, setNewHost }) {
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

function ConfirmLeave ({ isConfirmDialogOpened, handleCloseConfirmDialog, handleClose}) {
    const navigate = useNavigate();
    const handleCloseConfirm = () => { handleCloseConfirmDialog(false) };
    const handleSubmitConfirm = () => { 
        handleCloseConfirm()
        handleClose()
        navigate('/', { replace: true });
    };

    return (
    <Dialog  open={isConfirmDialogOpened} onClose={handleCloseConfirm} fullWidth maxWidth="sm" PaperProps={{ style: { backgroundColor: '#F5F5F5',},}}>
            <div className={styles.dialogHeader}>
                <img className={styles.headerIcon} src={leaveIcon}/>
                <h1 className={styles.heading}>Leave Studio</h1>
            </div>
            
            <DialogContent className={styles.dialogContent}>
                <h2 className={styles.subheading}>Are you sure you want to leave</h2>

                <DialogActions sx={{ display: 'flex', justifyContent: 'center', mb: 1.5 }}>
                    <Button variant="contained" sx={{ color: '#606060'}} className={styles.greyButton} onClick={handleCloseConfirm}>Cancel</Button>
                    <Button variant="contained" className={styles.purpleButton} onClick={handleSubmitConfirm}>Leave Studio</Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
}