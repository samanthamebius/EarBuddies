import React from "react";
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import styles from './Popup.module.css';
import TextField from '@mui/material/TextField';

export default function NicknameDialog({ isDialogOpened, handleCloseDialog }) {
    const handleClose = () => { handleCloseDialog(false) };

    const handleSubmit = () => {
        handleClose()
    };

    return (
        <Dialog  open={isDialogOpened} onClose={handleClose} fullWidth maxWidth="sm"
        PaperProps={{ style: { backgroundColor: '#F5F5F5' }}}>
        <div className={styles.dialogHeader}>
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
        </DialogContent>
    </Dialog>
    )

}