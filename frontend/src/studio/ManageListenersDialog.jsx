import React from 'react';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import styles from './Popup.module.css';
import GroupsIcon from '@mui/icons-material/Groups';
import AddListenersBlock from '../shared/AddListenersBlock';

/**
 * Dialog component for managing listeners in the studio.
 * @param {boolean} isManListDialogOpened - A boolean indicating whether the dialog is open or not.
 * @param {Function} handleCloseManListDialog  - A function to close the dialog.
 * @param {object} studio - An object representing the studio whose listeners are being managed.
 * @returns {JSX.Element} - A JSX element representing the ManageListenersDialog component.
 */
export default function ManageListenersDialog({
	isManListDialogOpened,
	handleCloseManListDialog,
	studio,
}) {
	const handleClose = () => {
		handleCloseManListDialog(false);
		window.location.reload();
	};

	return (
		<Dialog
			open={isManListDialogOpened}
			onClose={handleCloseManListDialog}
			fullWidth
			maxWidth='sm'
			PaperProps={{
				style: { padding: '20px', backgroundColor: 'var(--dialogColor)' },
			}}>
			<div className={styles.dialogHeader}>
				<GroupsIcon style={{ color: 'var(--iconColor)', fontSize: 40 }} />
				<h1 className={styles.heading}>Manage Listeners</h1>
			</div>

			<AddListenersBlock studio={studio} />

			<DialogContent className={styles.dialogContent}>
				<DialogActions
					sx={{ display: 'flex', justifyContent: 'center', mt: 1.5 }}>
					<Button
						sx={{ fontWeight: 600, color: '#757575' }}
						variant='contained'
						className={styles.cancelButton}
						onClick={handleClose}>
						Close
					</Button>
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
}
