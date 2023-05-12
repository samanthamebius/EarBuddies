import styles from './ConfirmationDialog.module.css';
import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';

/**
 * Renders a dialog box with an error icon, a message, and two buttons for confirming or canceling an action.
 * @param {boolean} isOpen - Indicates whether the dialog box is open or not.
 * @param {Function} handleClose - Function to close the dialog box.
 * @param {Function} handleAction - Function to execute the action after confirming.
 * @param {string} message: The message to display in the dialog box.
 * @param {string} actionText: The text to display on the action button.
 * @returns Rendered Confirmation Dialog.
 */
export default function ConfirmationDialog({
	isOpen,
	handleClose,
	handleAction,
	message,
	actionText,
}) {
	return (
		<div>
			<Dialog
				fullWidth
				maxWidth='sm'
				open={isOpen}
				onClose={handleClose}
				PaperProps={{ style: { backgroundColor: 'var(--dialogColor)' } }}>
				<DialogContent>
					<div className={styles.icon}>
						<ErrorOutlineRoundedIcon
							fontSize={'large'}
							style={{ color: '#B03EEE' }}
						/>
					</div>
					<h2
						style={{ display: 'flex', justifyContent: 'center' }}
						className={styles.sectionHeading}>
						{message}
					</h2>
				</DialogContent>

				<DialogActions
					sx={{ display: 'flex', justifyContent: 'center', mb: 1.5 }}
					className={styles.buttons}>
					<Button
						sx={{ fontWeight: 600, color: '#757575' }}
						variant='contained'
						className={styles.secondaryButton}
						onClick={handleClose}>
						Cancel
					</Button>
					<Button
						sx={{ fontWeight: 600 }}
						variant='contained'
						onClick={handleAction}>
						{actionText}
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
