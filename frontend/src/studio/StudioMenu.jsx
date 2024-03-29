import styles from './StudioMenu.module.css';
import React, { useState } from 'react';
import LeaveStudioDialog from './LeaveStudioDialog';
import NicknameDialog from './NicknameDialog';
import ManageListenersDialog from './ManageListenersDialog';
import AssignNewHostDialog from './AssignNewHostDialog';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import DriveFileRenameOutlineRoundedIcon from '@mui/icons-material/DriveFileRenameOutlineRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import GroupsIcon from '@mui/icons-material/Groups';
import VideogameAssetRoundedIcon from '@mui/icons-material/VideogameAssetRounded';
import VideogameAssetOffRoundedIcon from '@mui/icons-material/VideogameAssetOffRounded';
import GroupRemoveRoundedIcon from '@mui/icons-material/GroupRemoveRounded';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ConfirmationDialog from '../shared/ConfirmationDialog';

/**
* A StudioMenu component that displays menu options for controlling the studio.
* @param {boolean} controlEnabled - Whether control is enabled for the studio.
* @param {function} handleControlToggle - The function to handle toggling control for the studio.
* @param {function} handleDelete - The function to handle deleting the studio.
* @param {boolean} isHost - Whether the current user is the host of the studio.
* @param {string} id - The ID of the studio.
* @param {Object} studio - The studio object.
* @param {Array} studioUsers - An array of users in the studio.
* @param {boolean} isAloneInStudio - Whether the current user is the only one in the studio.
* @param {Object} socket - The socket object.
* @returns {JSX.Element} - The StudioMenu component JSX.
*/
export default function StudioMenu({
	controlEnabled,
	handleControlToggle,
	handleDelete,
	isHost,
	id,
	studio,
	studioUsers,
	isAloneInStudio,
	socket,
}) {
	const [isOpen, setOpen] = useState(null);
	const open = Boolean(isOpen);
	const [isLeaveOpen, setIsLeaveOpen] = useState(false);
	const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
	const [isConfirmLeaveOpen, setConfirmleaveOpen] = useState(false);
	const [isNicknameOpen, setIsNicknameOpen] = useState(false);
	const [isManListOpen, setIsManListOpen] = useState(false);
	const [isAssignOpen, setIsAssignOpen] = useState(false);

	const [isInLeave, setInLeave] = useState(false);
	const [isInEdit, setInEdit] = useState(false);
	const [isInManList, setInManList] = useState(false);
	const [isInDelete, setInDelete] = useState(false);
	const [isInAssign, setIsInAssign] = useState(false);
	const [isInEnable, setIsInEnable] = useState(false);
	const navigate = useNavigate();

	const handleClick = (event) => {
		setOpen(event.currentTarget);
	};

	{/* Handle hover styling */}

	const enterLeave = () => {
		setInLeave(true);
	};
	const enterEdit = () => {
		setInEdit(true);
	};
	const enterManList = () => {
		setInManList(true);
	};
	const enterDelete = () => {
		setInDelete(true);
	};
	const enterAssign = () => {
		setIsInAssign(true);
	};
	const enterEnable = () => {
		setIsInEnable(true);
	};

	const leaveLeave = () => {
		setInLeave(false);
	};
	const leaveEdit = () => {
		setInEdit(false);
	};
	const leaveManList = () => {
		setInManList(false);
	};
	const leaveDelete = () => {
		setInDelete(false);
	};
	const leaveAssign = () => {
		setIsInAssign(false);
	};
	const leaveEnable = () => {
		setIsInEnable(false);
	};

	{/* Handle dialog states */}

	const handleClose = () => {
		setOpen(null);
		setInLeave(false);
		setInEdit(false);
		setInManList(false);
		setInDelete(false);
	};

	const handleLeaveOpen = () => {
		setIsLeaveOpen(true);
	};
	const handleConfirmDeleteOpen = () => {
		setConfirmDeleteOpen(true);
	};
	const handleLeaveConfirmation = () => {
		setConfirmleaveOpen(true);
	};
	const handleNicknameOpen = () => {
		setIsNicknameOpen(true);
	};
	const handleAssignOpen = () => {
		setIsAssignOpen(true);
	};
	const handleManListOpen = () => {
		setIsManListOpen(true);
	};

	const handleLeaveStudio = () => {
		const user_id = localStorage.getItem('current_user_id');
		axios.put(`${BASE_URL}/api/studio/${id}/leave/${user_id}`);
		navigate('/', { replace: true });
	};

	return (
		<div>
			<LeaveStudioDialog
				isHost={isHost}
				isLeaveDialogOpened={isLeaveOpen}
				handleCloseLeaveDialog={() => setIsLeaveOpen(false)}
				studioUsers={studioUsers}
				studio_id={id}
			/>
			<AssignNewHostDialog
				isAssignDialogOpened={isAssignOpen}
				handleCloseAssignDialog={() => setIsAssignOpen(false)}
				studioUsers={studioUsers}
				studio_id={id}
				socket={socket}
			/>
			<ConfirmationDialog
				isOpen={isConfirmDeleteOpen}
				handleClose={() => setConfirmDeleteOpen(false)}
				handleAction={() => {
					handleClose;
					handleDelete();
				}}
				message={'Are you sure you want to delete this studio?'}
				actionText={'Delete'}
			/>
			<ConfirmationDialog
				isOpen={isConfirmLeaveOpen}
				handleClose={() => setConfirmleaveOpen(false)}
				handleAction={() => {
					handleClose;
					handleLeaveStudio();
				}}
				message={'Are you sure you want to leave this studio?'}
				actionText={'Leave'}
			/>
			<NicknameDialog
				isNicknameDialogOpened={isNicknameOpen}
				handleCloseNicknameDialog={() => setIsNicknameOpen(false)}
				studioId={id}
				socket={socket}
			/>
			<ManageListenersDialog
				isManListDialogOpened={isManListOpen}
				handleCloseManListDialog={() => setIsManListOpen(false)}
				studio={studio}
			/>
			<div
				onClick={handleClick}
				className={styles.menuButton}>
				<MoreVertRoundedIcon style={{ color: 'white', fontSize: '30px' }} />
			</div>
			<Menu
				autoFocus={false}
				anchorEl={isOpen}
				open={open}
				onClose={handleClose}
				PaperProps={{ style: { backgroundColor: 'var(--dialogColor)' } }}>
				<MenuItem
					className={styles.menu_item}
					onClick={handleNicknameOpen}
					onMouseEnter={enterEdit}
					onMouseLeave={leaveEdit}>
					<DriveFileRenameOutlineRoundedIcon
						className={styles.icon}
						style={{ color: isInEdit ? '#B03EEE' : 'var(--iconColor)' }}
					/>
					<p className={styles.menu_title}>Edit Nickname</p>
				</MenuItem>

				<MenuItem
					style={{
						display: !isHost ? 'none' : 'flex',
					}}
					className={styles.menu_item}
					onClick={() => {
						handleClose;
						handleControlToggle();
					}}
					onMouseEnter={enterEnable}
					onMouseLeave={leaveEnable}>
					{!controlEnabled ? (
						<>
							<VideogameAssetOffRoundedIcon
								className={styles.icon}
								style={{
									color: isInEnable ? '#B03EEE' : 'var(--iconColor)',
								}}
							/>
							<p className={styles.menu_title}>Disable Control</p>
						</>
					) : (
						<>
							<VideogameAssetRoundedIcon
								className={styles.icon}
								style={{
									color: isInEnable ? '#B03EEE' : 'var(--iconColor)',
								}}
							/>
							<p className={styles.menu_title}>Enable Control</p>
						</>
					)}
				</MenuItem>

				<MenuItem
					style={{ display: isHost || !controlEnabled ? 'flex' : 'none' }}
					className={styles.menu_item}
					onClick={handleManListOpen}
					onMouseEnter={enterManList}
					onMouseLeave={leaveManList}>
					<GroupsIcon
						className={styles.icon}
						style={{ color: isInManList ? '#B03EEE' : 'var(--iconColor)' }}
					/>
					<p className={styles.menu_title}>Manage Listeners</p>
				</MenuItem>

				<MenuItem
					style={{
						display: !isHost || isAloneInStudio ? 'none' : 'flex',
					}}
					className={styles.menu_item}
					onClick={handleAssignOpen}
					onMouseEnter={enterAssign}
					onMouseLeave={leaveAssign}>
					<StarRoundedIcon
						className={styles.icon}
						style={{ color: isInAssign ? '#B03EEE' : 'var(--iconColor)' }}
					/>
					<p className={styles.menu_title}>Assign a New Host</p>
				</MenuItem>

				<MenuItem
					style={{ display: isAloneInStudio ? 'none' : 'flex' }}
					className={styles.menu_item}
					onClick={isHost ? handleLeaveOpen : handleLeaveConfirmation}
					onMouseEnter={enterLeave}
					onMouseLeave={leaveLeave}>
					<ExitToAppRoundedIcon
						className={styles.icon}
						style={{ color: isInLeave ? '#B03EEE' : 'var(--iconColor)' }}
					/>
					<p className={styles.menu_title}>Leave Studio</p>
				</MenuItem>

				<MenuItem
					style={{ display: isHost ? 'flex' : 'none' }}
					className={styles.menu_item}
					onClick={handleConfirmDeleteOpen}
					onMouseEnter={enterDelete}
					onMouseLeave={leaveDelete}>
					<GroupRemoveRoundedIcon
						className={styles.icon}
						style={{ color: isInDelete ? '#B03EEE' : 'var(--iconColor)' }}
					/>
					<p className={styles.menu_title}>Delete Studio</p>
				</MenuItem>
			</Menu>
		</div>
	);
}
