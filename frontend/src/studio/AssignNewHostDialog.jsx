import React from 'react';
import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import styles from './Popup.module.css';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import ConfirmationDialog from '../shared/ConfirmationDialog';
import axios from 'axios';
import NewHostSelection from './NewHostSelection';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AssignNewHostDialog({
    isAssignDialogOpened,
    handleCloseAssignDialog,
    studioUsers,
    studio_id,
    socket,
}) {
    const [isHostErrorMessage, setIsHostErrorMessage] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isHelperTextMessage, setIsHelperTextMessage] = useState(false);
    const handleClose = () => {
        handleCloseAssignDialog(false);
        window.location.reload();
    };
    const [newHost, setNewHost] = useState(null);

    const handleSubmit = () => {
        if (newHost === null) {
            setIsHostErrorMessage(true);
        } else {
            setIsHostErrorMessage(false);
            setIsConfirmOpen(true);
        }
    };

    const handleCancel = () => {
        setIsConfirmOpen(false);
        setIsHelperTextMessage(false);
    };

    const handleSubmitConfirm = async () => {
        // axios.put(`${BASE_URL}/api/studio/${studio_id}/newHost/${newHost}`);
        socket.emit('send_new_host', { room: studio_id, newHost: newHost });
        const current_user_id = JSON.parse(localStorage.getItem('current_user_id'));
    };

    useEffect(() => {
        socket.on('receive_new_host', async (data) => {
            const current_user_id = JSON.parse(localStorage.getItem('current_user_id'));
            if (data === current_user_id) {
                await axios.put(`${BASE_URL}/api/studio/${studio_id}/newHost/${data}`);
            }
            const studio = await axios.get(`${BASE_URL}/api/studio/${studio_id}`);
            setIsConfirmOpen(false);
            handleClose();
        });
    }, [socket, newHost]);

    return (
        <Dialog
            open={isAssignDialogOpened}
            onClose={handleClose}
            fullWidth
            maxWidth='sm'
            PaperProps={{ style: { backgroundColor: 'var(--dialogColor)' } }}>
            <div className={styles.dialogHeader}>
                <ExitToAppRoundedIcon style={{ color: '#757575', fontSize: '30px' }} />
                <h1 className={styles.heading}>Assign a New Host</h1>
            </div>

            <DialogContent className={styles.dialogContent}>
                <h2 className={styles.subHeading}>
                    Choose another listener to be a host
                </h2>
                <h2 className={styles.subsubHeading}>
                    Note: the user must be currently active in this studio to successfully
                    be set as host
                </h2>
                <NewHostSelection
                    newHost={newHost}
                    setNewHost={setNewHost}
                    isHostErrorMessage={isHostErrorMessage}
                    studioUsers={studioUsers}
                    studio_id={studio_id}
                />

                <DialogActions
                    sx={{ display: 'flex', justifyContent: 'center', mb: 1.5 }}>
                    <Button
                        variant='contained'
                        sx={{ fontWeight: 600, color: '#757575' }}
                        className={styles.secondaryButton}
                        onClick={() => {
                            setNewHost(null);
                            handleClose();
                        }}>
                        Cancel
                    </Button>
                    <Button
                        variant='contained'
                        sx={{ fontWeight: 600 }}
                        className={styles.purpleButton}
                        onClick={handleSubmit}>
                        Assign New Host
                    </Button>
                </DialogActions>
                <ConfirmationDialog
                    isOpen={isConfirmOpen}
                    handleClose={handleCancel}
                    handleAction={handleSubmitConfirm}
                    message={'Are you sure you want to give up your role as host?'}
                    actionText={'Yes'}
                    isHelperTextMessage={isHelperTextMessage}
                    helperMessage={'Please select a valid host'}
                />
            </DialogContent>
        </Dialog>
    );
}
