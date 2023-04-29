import styles from './ConfirmationDialog.module.css';
import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';

export default function ConfirmationDialog({ isOpen, handleClose, handleAction, message, actionText }) {
    return(
        <div>
            <Dialog fullWidth maxWidth='sm' open={isOpen} onClose={handleClose} PaperProps={{ style: { backgroundColor: '#F5F5F5',},}}>
                <DialogContent>
                    <div className={styles.icon}>
                        <ErrorOutlineRoundedIcon fontSize={'large'} style={{ color: '#B03EEE'}}/>
                    </div>
                    <h2 style={{display: 'flex', justifyContent: 'center'}} className={styles.sectionHeading}>{message}</h2>
                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'center', mb: 1.5 }} className={styles.buttons}>
                <Button sx={{ fontWeight: 600 }} variant='contained' className={styles.primaryButton} onClick={handleClose}>Cancel</Button>
                <Button sx={{ fontWeight: 600, color: '#757575'  }} variant='contained' className={styles.secondaryButton} onClick={handleAction}>{actionText}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}