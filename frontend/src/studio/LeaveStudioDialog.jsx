import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import styles from './Popup.module.css';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import ConfirmationDialog from '../shared/ConfirmationDialog';

export default function LeaveStudioDialog({ isDialogOpened, handleCloseDialog, listeners }) {
    const [isHostErrorMessage, setIsHostErrorMessage] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

	const handleConfirmOpen = () => { setIsConfirmOpen(true); };
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

    const handleSubmitConfirm = () => { 
        setIsConfirmOpen(false)
        handleClose()
        navigate('/', { replace: true });
    };
    
    return(
        <Dialog  open={isDialogOpened} onClose={handleClose} fullWidth maxWidth="sm" PaperProps={{ style: { backgroundColor: '#F5F5F5' }}}>
            <div className={styles.dialogHeader}>
                <ExitToAppRoundedIcon style={{ color: "#757575", fontSize: "30px" }} />
                <h1 className={styles.heading}>Leave Studio</h1>
            </div>
            
            <DialogContent className={styles.dialogContent}>
                <h2 className={styles.subHeading}>Assign a new host before leaving</h2>
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
                    <Button variant="contained" sx={{ fontWeight: 600, color: '#757575'  }} className={styles.secondaryButton} onClick={() => { setNewHost(null); handleClose(); }}>Cancel</Button>
                    <Button variant="contained" sx={{ fontWeight: 600 }} className={styles.purpleButton} onClick={handleSubmit}>Leave Studio</Button>
                </DialogActions>
                <ConfirmationDialog 
                    isOpen={isConfirmOpen}
                    handleClose={() => setIsConfirmOpen(false)}
                    handleAction={() => handleSubmitConfirm}
                    message={"Are you sure you want to leave this studio?"}
                    actionText={"Leave"}/>
            </DialogContent>
        </Dialog>
    )
}

function ListenerListItem ({ listener, isNewHost, setNewHost }) {
    const handleClick = () => {
      setNewHost(listener.id);
    };
  
    return (
      <div className={styles.listenerListItem} onClick={handleClick}>
        <img src={listener.icon}/>
        <p>{listener.username}</p>
        {isNewHost ?
            <StarRoundedIcon className={styles.hostIcon} style={{ color: "#757575", fontSize: "30px" }} />
        :
            <StarBorderRoundedIcon className={styles.hostIcon} style={{ color: "#757575", fontSize: "30px" }} />
        }
      </div>
    );
  };