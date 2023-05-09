import React, {useState} from 'react';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import styles from './Popup.module.css';

import GroupsIcon from '@mui/icons-material/Groups';
import AddListenersBlock from '../shared/AddListenersBlock';

export default function ManageListenersDialog({ isManListDialogOpened, handleCloseManListDialog }) {

    const handleClose = () => { handleCloseManListDialog(false) };

    return (
        <Dialog  open={isManListDialogOpened} onClose={handleCloseManListDialog} fullWidth maxWidth="sm"
        PaperProps={{ style: { backgroundColor: '#F5F5F5' }}}>
        <div className={styles.dialogHeader}>
            <GroupsIcon style={{ color:  "#757575", fontSize:40}} />
            <h1 className={styles.heading}>Manage Listeners</h1>
        </div>

        <AddListenersBlock/>
        
        <DialogContent className={styles.dialogContent}>
            <DialogActions sx={{ display: 'flex', justifyContent: 'center', mt: 1.5 }}>
                <Button sx={{ fontWeight: 600, color: '#757575' }} variant="contained" className={styles.cancelButton} 
                onClick={handleClose}>Close</Button>
            </DialogActions>
        </DialogContent>
    </Dialog>
    );
}