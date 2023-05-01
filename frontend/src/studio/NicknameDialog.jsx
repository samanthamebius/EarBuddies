import React from "react";
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
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
            <DriveFileRenameOutlineRoundedIcon style={{ color:  "#757575", fontSize:40}} />
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
            <DialogActions sx={{ display: 'flex', justifyContent: 'center', mt: 1.5 }}>
                <Button sx={{ fontWeight: 600, color: '#757575' }} variant="contained" className={styles.cancelButton} onClick={handleClose}>Cancel</Button>
                <Button sx={{ fontWeight: 600 }} variant="contained" className={styles.createButton} onClick={handleSubmit}>Submit</Button>
            </DialogActions>
        </DialogContent>
    </Dialog>
    )

}