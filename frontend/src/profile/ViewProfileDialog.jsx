import styles from './ViewProfileDialog.module.css';
import React, { useEffect, useState, useRef } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import InputAdornment from '@mui/material/InputAdornment';


export default function ViewProfileDialog({ isViewProfileOpen, handleViewProfileClose }) {
    const [displayName, setDisplayName] = useState('username'); 
    const [isInDisplayName, setInDisplayName] = useState(false);
    
    const toggleInDisplayName = () => { setInDisplayName(!isInDisplayName) };

    return(
        <div>
            <Dialog fullWidth maxWidth="sm" open={isViewProfileOpen} onClose={handleViewProfileClose} PaperProps={{ style: { backgroundColor: '#F5F5F5',},}}>
                <h1 className={styles.heading}>View Profile</h1>
                <DialogContent>
                    <h2 className={styles.sectionHeading}>Display Name</h2>
                    <TextField 
                        onMouseEnter={toggleInDisplayName} 
                        onMouseLeave={toggleInDisplayName}
                        value={displayName}
                        required
                        margin="dense"
                        id="name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        onChange={event => setDisplayName(event.target.value)}
                        className={styles.textfield}
                        autoComplete="off"
                        InputProps={{
                            endAdornment: <InputAdornment position="end">
                                <EditRoundedIcon style={{ color: isInDisplayName ? "#B03EEE" : "#757575"}}/>
                                </InputAdornment>,
                        }}
                    />
                    <h2 className={styles.sectionHeading}>Display Photo</h2>
                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'center', mb: 1.5 }} className={styles.buttons}>
                <Button sx={{ fontWeight: 600, color: '#757575' }} variant="contained" className={styles.cancelButton} onClick={handleViewProfileClose}>Close</Button>
                <Button sx={{ fontWeight: 600 }} variant="contained" className={styles.createButton} onClick={handleViewProfileClose}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}