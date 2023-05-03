import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import styles from './Popup.module.css';
import TextField from '@mui/material/TextField';
import DriveFileRenameOutlineRoundedIcon from '@mui/icons-material/DriveFileRenameOutlineRounded';
import axios from 'axios';

export default function NicknameDialog({ isNicknameDialogOpened, handleCloseNicknameDialog, studioId}) {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const userId = localStorage.getItem("current_user_id");

    const handleClose = () => { handleCloseNicknameDialog(false) };
    const [nicknameInput, setNicknameInput] = useState('');
    const [isNicknameErrorMessage, setIsNicknameErrorMessage] = useState(false);

    const handleSubmit = () => {
        if (nicknameInput == '') {
            setIsNicknameErrorMessage(true);
        } else {
            setIsNicknameErrorMessage(false);
            const nickname = nicknameInput
            const nicknameResponse = axios.put(`${BASE_URL}/api/studio/${studioId}/${userId.replace(/['"]+/g, '')}/nickname`, {nickname: nickname})
            handleClose()
        }
    };

    const theme = createTheme({
        palette: {
            secondary: {
                main: '#CA3FF3',
            },
        },
    });

    return (
        <Dialog open={isNicknameDialogOpened} onClose={handleCloseNicknameDialog} fullWidth maxWidth="sm"
            PaperProps={{ style: { backgroundColor: '#F5F5F5' } }}>
            <div className={styles.dialogHeader}>
                <DriveFileRenameOutlineRoundedIcon style={{ color: "#757575", fontSize: 40 }} />
                <h1 className={styles.heading}>Edit Nickname</h1>
            </div>

            <DialogContent className={styles.dialogContent}>
                <div>
                    <ThemeProvider theme={theme}>
                        <TextField
                            color="secondary"
                            value={nicknameInput}
                            error={isNicknameErrorMessage ? true : false}
                            required
                            id="nickname"
                            label="Enter your new nickname in this studio"
                            type="text"
                            fullWidth
                            onChange={event => setNicknameInput(event.target.value)}
                            helperText={isNicknameErrorMessage ? "Enter a new nickname or cancel" : ""} />
                    </ThemeProvider>
                </div>
                <DialogActions sx={{ display: 'flex', justifyContent: 'center', mt: 1.5 }}>
                    <Button sx={{ fontWeight: 600, color: '#757575' }} variant="contained" className={styles.cancelButton} onClick={handleClose}>Cancel</Button>
                    <Button sx={{ fontWeight: 600 }} variant="contained" className={styles.createButton} onClick={handleSubmit}>Submit</Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    )

}