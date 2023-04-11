import React from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
// import DialogTitle from '@mui/material/DialogTitle';
import styles from './CreateStudio.module.css';
import FileDropZone from "./FileDropZone";

export default function CreateStudioDialog({ isDialogOpened, handleCloseDialog }) {
    const handleClose = () => { handleCloseDialog(false) };

    return (
    <div>
      <Dialog fullWidth maxWidth="md" open={isDialogOpened} onClose={handleClose} PaperProps={{ style: { backgroundColor: '#F5F5F5',},}}>
        <h1 className={styles.heading}>Create Studio</h1>
        <DialogContent>
            <h2 className={styles.sectionHeading}>Studio Name<span className={styles.focusText}>*</span></h2>
          <TextField
            //autoFocus
            required
            margin="dense"
            id="name"
            label="Studio Name"
            type="email"
            fullWidth
            variant="outlined"
            className={styles.textfield}
          />
          <h2 className={styles.sectionHeading}>Cover Photo</h2>
          <FileDropZone />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Create Studio</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}