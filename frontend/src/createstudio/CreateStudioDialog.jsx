import React from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import styles from './CreateStudioDialog.module.css';
import FileDropZone from "./FileDropZone";
import ControlSwitch from "./ControlSwitch";
import Tooltip from '@mui/material/Tooltip';
import SearchBar from "../shared/SearchBar";
import SelectedGenreTag from "./SelectedGenreTag";
import UnselectedGenreTag from "./UnselectedGenreTag";

export default function CreateStudioDialog({ isDialogOpened, handleCloseDialog }) {
    const handleClose = () => { handleCloseDialog(false) };

    return (
    <div>
      <Dialog fullWidth maxWidth="md" open={isDialogOpened} onClose={handleClose} PaperProps={{ style: { backgroundColor: '#F5F5F5',},}}>
        <h1 className={styles.heading}>Create Studio</h1>
        <DialogContent>
            <h2 className={styles.sectionHeading}>Studio Name<span className={styles.focusText}>*</span></h2>
            <TextField 
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
            
            <h2 className={styles.sectionHeading}>Genres</h2>
            <SelectedGenreTag genre={"Country"}/>
            <UnselectedGenreTag genre={"Country"}/>

            
            <div className={styles.controlSection}>
                <h2 className={styles.sectionHeading}>Only I Have Control</h2>
                <Tooltip title="Only you will be able to queue, skip and pause songs." placement="right" arrow>
                    <div className={styles.switchContainer}>
                        <ControlSwitch/>
                    </div>
                </Tooltip>
            </div>
            
            <h2 className={styles.sectionHeading}>Add Listeners</h2>
            <SearchBar label={"Search using Spotify username ..."}/>
        </DialogContent>
        <DialogActions className={styles.buttons}>
          <Button variant="contained" sx={{ color: '#606060'}} className={styles.cancelButton}onClick={handleClose}>Cancel</Button>
          <Button variant="contained" className={styles.createButton} onClick={handleClose}>Create Studio</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}