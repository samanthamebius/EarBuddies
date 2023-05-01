import React from "react";
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import styles from './Popup.module.css';
import TextField from '@mui/material/TextField';
import DriveFileRenameOutlineRoundedIcon from '@mui/icons-material/DriveFileRenameOutlineRounded';

export default function NicknameDialog({ isNicknameDialogOpened, handleCloseNicknameDialog }) {
    const handleClose = () => { handleCloseNicknameDialog(false) };

    const handleSubmit = () => {
        handleClose()
    };

    return (
        <Dialog  open={isNicknameDialogOpened} onClose={handleCloseNicknameDialog} fullWidth maxWidth="sm"
        PaperProps={{ style: { backgroundColor: '#F5F5F5' }}}>
        <div className={styles.dialogHeader}>
            <DriveFileRenameOutlineRoundedIcon className={styles.icon} style={{ color:  "#757575" }} />
            <h1 className={styles.heading}>Edit Nickname</h1>
        </div>
        
        <DialogContent className={styles.dialogContent}>
            <div>
                <TextField 
                    id="nickname"
                    label="Enter your nickname in this studio"
                    type="text"
                    fullWidth/>
            </div>
            <div >
                <Button onClick={handleClose} className={styles.greyButton}
                sx={{mt: 2, mr: 1, p: 1}}>Cancel</Button>
                <Button onClick={handleSubmit} className={styles.purpleButton}
                sx={{mt: 2, ml: 1, p: 1}} >Submit</Button>
            </div>
        </DialogContent>
    </Dialog>
    )

}