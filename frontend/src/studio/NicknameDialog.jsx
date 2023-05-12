import React, { useContext, useEffect, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import styles from './Popup.module.css';
import TextField from '@mui/material/TextField';
import DriveFileRenameOutlineRoundedIcon from '@mui/icons-material/DriveFileRenameOutlineRounded';
import axios from 'axios';
import { AppContext } from '../AppContextProvider';

export default function NicknameDialog(props) {
    const { isNicknameDialogOpened, handleCloseNicknameDialog, studioId, socket } = props;
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const { username } = useContext(AppContext);

    const handleClose = () => {
        handleCloseNicknameDialog(false);
    };
    const [nicknameInput, setNicknameInput] = useState('');
    const [isNicknameErrorMessage, setIsNicknameErrorMessage] = useState(false);
    const [errorText, setErrorText] = useState('');

    const handleSubmit = async () => {
        const response = await axios.get(`${BASE_URL}/api/studio/${studioId}`);
        const takenNicknames = response.data[0].studioNames;
        const userPos = response.data[0].studioUsers.indexOf(username);
        const currentNickname = response.data[0].studioNames[userPos];
        const trimmedNicknameInput = nicknameInput.trim();

        if (nicknameInput == '') {
            setErrorText('Enter a new nickname or cancel');
            setIsNicknameErrorMessage(true);
        } else if (
            takenNicknames.includes(trimmedNicknameInput) &&
            trimmedNicknameInput != currentNickname
        ) {
            setErrorText('This nickname is already taken');
            setIsNicknameErrorMessage(true);
        } else {
            setIsNicknameErrorMessage(false);
            const nickname = trimmedNicknameInput;
            await axios
                .put(`${BASE_URL}/api/studio/${studioId}/${username}/nickname`, {
                    nickname: nickname,
                })
                .then((response) => handleSetChatMessages(response.data));

            handleClose();
        }
    };

    const handleSetChatMessages = (data) => {
        const { updatedMessages, nickname } = data;
        socket.emit('reload_chat_messages', {
            room: studioId,
            updatedMessages,
            nickname,
        });
    };

    const theme = createTheme({
        palette: {
            secondary: {
                main: '#CA3FF3',
            },
        },
    });

    // set the initial nickname
    useEffect(() => {
        if (username) {
            axios
                .get(`${BASE_URL}/api/studio/${studioId}/${username}/nickname`)
                .then((response) => setNicknameInput(response.data));
        }
    }, [username]);

    return (
        <Dialog
            open={isNicknameDialogOpened}
            onClose={handleCloseNicknameDialog}
            fullWidth
            maxWidth='sm'
            PaperProps={{ style: { backgroundColor: 'var(--dialogColor' } }}>
            <div className={styles.dialogHeader}>
                <DriveFileRenameOutlineRoundedIcon
                    style={{ color: 'var(--iconColor)', fontSize: 40 }}
                />
                <h1 className={styles.heading}>Edit Nickname</h1>
            </div>

            <DialogContent className={styles.dialogContent}>
                <div>
                    <ThemeProvider theme={theme}>
                        <TextField
                            color='secondary'
                            value={nicknameInput}
                            error={isNicknameErrorMessage ? true : false}
                            required
                            id='nickname'
                            label='Enter your new nickname in this studio'
                            type='text'
                            fullWidth
                            onChange={(event) => setNicknameInput(event.target.value)}
                            helperText={isNicknameErrorMessage ? errorText : ''}
                            FormHelperTextProps={{
                                style: { backgroundColor: 'var(--dialogColor)' },
                            }}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    handleSubmit();
                                }
                            }}
                            InputProps={{
                                style: { color: 'var(--headingColor)' },
                            }}
                            InputLabelProps={{
                                style: { color: 'var(--headingColor)' },
                            }}
                        />
                    </ThemeProvider>
                </div>
                <DialogActions
                    sx={{ display: 'flex', justifyContent: 'center', mt: 1.5 }}>
                    <Button
                        sx={{ fontWeight: 600, color: '#757575' }}
                        variant='contained'
                        className={styles.cancelButton}
                        onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        sx={{ fontWeight: 600 }}
                        variant='contained'
                        className={styles.createButton}
                        onClick={handleSubmit}>
                        Submit
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
}
