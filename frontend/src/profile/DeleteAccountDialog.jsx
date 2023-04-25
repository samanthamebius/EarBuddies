import styles from './ViewProfileDialog.module.css';
import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';

export default function DeleteAccountDialog({ isDeleteAccountOpen, handleDeleteAccountClose }) {

    return(
        <div>
            <Dialog fullWidth maxWidth='sm' open={isDeleteAccountOpen} onClose={handleDeleteAccountClose} PaperProps={{ style: { backgroundColor: '#F5F5F5',},}}>
                <DialogContent>
                    <div className={styles.icon}>
                        <ErrorOutlineRoundedIcon fontSize={'large'} style={{ color: '#B03EEE'}}/>
                    </div>
                    <h2 style={{display: 'flex', justifyContent: 'center'}} className={styles.sectionHeading}>Are you sure you want to delete your Ear Buddies Account?</h2>
                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'center', mb: 1.5 }} className={styles.buttons}>
                <Button sx={{ fontWeight: 600 }} variant='contained' className={styles.createButton} onClick={handleDeleteAccountClose}>Cancel</Button>
                <Button sx={{ fontWeight: 600, color: '#757575'  }} variant='contained' className={styles.cancelButton} onClick={handleDeleteAccountClose}>Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}