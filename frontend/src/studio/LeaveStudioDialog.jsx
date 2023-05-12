import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

/**
 * Dialog for user to leave studio.
 * @param {boolean} isLeaveDialogOpened - A boolean indicating whether the leave studio dialog is open.
 * @param {Function} handleCloseLeaveDialog - A function used to close the leave studio dialog.
 * @param {Array} studioUsers - An array of objects representing the users in the studio.
 * @param {string} studio_id - A string representing the ID of the studio.
 * @returns {JSX.Element} - Returns a JSX element representing the LeaveStudioDialog component.
 */
export default function LeaveStudioDialog({
	isLeaveDialogOpened,
	handleCloseLeaveDialog,
	studioUsers,
	studio_id,
}) {
	const navigate = useNavigate();
	const [isHostErrorMessage, setIsHostErrorMessage] = useState(false);
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const handleClose = () => {
		handleCloseLeaveDialog(false);
	};
	const [newHost, setNewHost] = useState(null);
	const user_id = localStorage.getItem('current_user_id');

	const handleSubmit = () => {
		if (newHost === null) {
			setIsHostErrorMessage(true);
		} else {
			setIsHostErrorMessage(false);
			setIsConfirmOpen(true);
		}
	};

	const handleSubmitConfirm = () => {
		axios.put(`${BASE_URL}/api/studio/${studio_id}/newHost/${newHost}`);
		setIsConfirmOpen(false);
		handleClose();
		const user = JSON.parse(user_id);
		axios.put(`${BASE_URL}/api/studio/${studio_id}/leave/${user}`);
		navigate('/', { replace: true });
	};

	return (
		<Dialog
			open={isLeaveDialogOpened}
			onClose={handleClose}
			fullWidth
			maxWidth='sm'
			PaperProps={{ style: { backgroundColor: 'var(--dialogColor)' } }}>
			<div className={styles.dialogHeader}>
				<ExitToAppRoundedIcon
					style={{ color: 'var(--iconColor)', fontSize: '30px' }}
				/>
				<h1 className={styles.heading}>Leave Studio</h1>
			</div>

			<DialogContent className={styles.dialogContent}>
				<h2 className={styles.subHeading}>Assign a new host before leaving</h2>
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
						Leave Studio
					</Button>
				</DialogActions>
				<ConfirmationDialog
					isOpen={isConfirmOpen}
					handleClose={() => setIsConfirmOpen(false)}
					handleAction={handleSubmitConfirm}
					message={'Are you sure you want to leave this studio?'}
					actionText={'Leave'}
				/>
			</DialogContent>
		</Dialog>
	);
}
