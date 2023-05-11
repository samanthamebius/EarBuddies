import styles from "./StudioPage.module.css";
import React, { useState, useEffect } from "react";
import LeaveStudioDialog from "./LeaveStudioDialog";
import NicknameDialog from "./NicknameDialog";
import ManageListenersDialog from "./ManageListenersDialog";
import AssignNewHostDialog from "./AssignNewHostDialog";
import ProfilePicImg1 from "../assets/profilepic1.png";
import ListenerIcons from "../shared/ListenerIcons";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import DriveFileRenameOutlineRoundedIcon from '@mui/icons-material/DriveFileRenameOutlineRounded';
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import GroupsIcon from '@mui/icons-material/Groups';
import VideogameAssetRoundedIcon from '@mui/icons-material/VideogameAssetRounded';
import VideogameAssetOffRoundedIcon from '@mui/icons-material/VideogameAssetOffRounded';
import GroupRemoveRoundedIcon from '@mui/icons-material/GroupRemoveRounded';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ConfirmationDialog from "../shared/ConfirmationDialog";

// TO DO: get if user is host or not
// const isHost = false;

const hostImage = ProfilePicImg1;
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL ?? "";

export default function Banner({ id, studio, socket }) {
	const navigate = useNavigate();

	if (!studio) {
		return <p>Could not load studio</p>;
	}

	const studioName = studio.studioName;
	const backgroundImage = IMAGE_BASE_URL + studio.studioPicture;

	const isHost = (studio.studioHost === localStorage.getItem("current_user_id").replace(/"/g, ''));

	const handleDelete = () => {
		axios.delete(`${BASE_URL}/api/studio/${id}`).then((res) => {
			console.log(res);
		});
		navigate("/");
		window.location.reload(false);
	};

	const users = studio.studioUsers;
	const isAlone = (users.length <= 1) ? true : false;
	const isListening = studio.studioIsActive;

	return (
		<div
			className={styles.banner}
			style={{ backgroundImage: `url(${backgroundImage})` }}
		>
			<h1 className={styles.bannerStudioName}>{studioName}</h1>

			<div className={styles.bannerlisteners}>
				<ListenerIcons
					studioUsers={users}
					isListening={isListening}
					isHomeCard={false}
				/>
			</div>
			<div className={styles.bannerDropdownKebab}>
				<DropdownKebab
					handleDelete={handleDelete}
					id={id}
					studio={studio}
					socket={socket}
					isHost={isHost}
					studioUsers={users}
					isAloneInStudio={isAlone}
				/>
			</div>
		</div>
	);
}

export function DropdownKebab({
	handleDelete,
	isHost,
	id,
	studio,
	studioUsers,
	isAloneInStudio,
	socket
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
	const navigate = useNavigate();
		
	const handleClick = (event) => { 
		setOpen(event.currentTarget); 
	};

	const enterLeave = () => {
		setInLeave(true);
	};
	const enterEdit = () => {
		setInEdit(true);
	};
	const enterManList = () => { 
		setInManList(true) 
	};
	const enterDelete = () => {
		setInDelete(true);
	};
	const enterAssign = () => {
		setIsInAssign(true);
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
	const handleManListOpen = () => { setIsManListOpen(true); };

	const handleLeaveStudio = () => {
		const user_id = localStorage.getItem("current_user_id");
		axios.put(`${BASE_URL}/api/studio/${id}/leave/${user_id}`);
        navigate('/', { replace: true });
	};

	//TODO: DELETE THIS
	const handleTestClick = () => {
		console.log("test");
		const newHost = studioUsers[1].user_id;
		axios.put(`${BASE_URL}/api/studio/${id}/new_host/${newHost}`);
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
			/>
			<ConfirmationDialog
				isOpen={isConfirmDeleteOpen}
				handleClose={() => setConfirmDeleteOpen(false)}
				handleAction={() => {
					handleClose;
					handleDelete();
				}} //TO DO: replace with delete functionality
				message={"Are you sure you want to delete this studio?"}
				actionText={"Delete"}
			/>
			<ConfirmationDialog
				isOpen={isConfirmLeaveOpen}
				handleClose={() => setConfirmleaveOpen(false)}
				handleAction={() => {
					handleClose;
					handleLeaveStudio();
				}} //TO DO: replace with leave functionality
				message={"Are you sure you want to leave this studio?"}
				actionText={"Leave"}
			/>
			<NicknameDialog
				isNicknameDialogOpened={isNicknameOpen}
				handleCloseNicknameDialog={() => setIsNicknameOpen(false)}
				studioId={id}
				socket={socket}/>
			<ManageListenersDialog
				isManListDialogOpened={isManListOpen}
				handleCloseManListDialog={() => setIsManListOpen(false)} 
				studio={studio} />
			<div onClick={handleClick} className={styles.dropdownButton}>
			<MoreVertRoundedIcon style={{ color: "white", fontSize: "30px" }} />
			</div>
			<Menu
				autoFocus={false}
				anchorEl={isOpen}
				open={open}
				onClose={handleClose}
			>
				{/* TODO: DELETE THIS */}
				<MenuItem
					onClick={handleTestClick}>
					<p className={styles.menu_title}>Test button</p>
				</MenuItem>
				<MenuItem
					className={styles.menu_item}
					onClick={handleNicknameOpen}
					onMouseEnter={enterEdit}
					onMouseLeave={leaveEdit}
				>
					<DriveFileRenameOutlineRoundedIcon
						className={styles.icon}
						style={{ color: isInEdit ? "#B03EEE" : "#757575" }}
					/>
					<p className={styles.menu_title}>Edit Nickname</p>
				</MenuItem>

				<MenuItem
					style={{ display: "flex" }}
					className={styles.menu_item}
					onClick={handleManListOpen}
					onMouseEnter={enterManList} 
                    onMouseLeave={leaveManList}>
					<GroupsIcon className={styles.icon} style={{ color: isInManList ? "#B03EEE" : "#757575" }} />
					<p className={styles.menu_title}>Manage Listeners</p>
				</MenuItem>

				<MenuItem
					style={{ display: (!isHost || isAloneInStudio) ? "none" : "flex" }}
					className={styles.menu_item}
					onClick={handleAssignOpen}
					onMouseEnter={enterAssign}
					onMouseLeave={leaveAssign}
				>
					<StarRoundedIcon
						className={styles.icon}
						style={{ color: isInAssign ? "#B03EEE" : "#757575" }}
					/>
					<p className={styles.menu_title}>Assign a New Host</p>
				</MenuItem>

				<MenuItem
					style={{ display: isAloneInStudio ? "none" : "flex" }}
					className={styles.menu_item}
					onClick={isHost ? handleLeaveOpen : handleLeaveConfirmation}
					onMouseEnter={enterLeave}
					onMouseLeave={leaveLeave}
				>
					<ExitToAppRoundedIcon
						className={styles.icon}
						style={{ color: isInLeave ? "#B03EEE" : "#757575" }}
					/>
					<p className={styles.menu_title}>Leave Studio</p>
				</MenuItem>
				
				<MenuItem
					style={{ display: isHost ? "flex" : "none" }}
					className={styles.menu_item}
					onClick={handleConfirmDeleteOpen}
					onMouseEnter={enterDelete}
					onMouseLeave={leaveDelete}
				>
					<GroupRemoveRoundedIcon
						className={styles.icon}
						style={{ color: isInDelete ? "#B03EEE" : "#757575" }}
					/>
					<p className={styles.menu_title}>Delete Studio</p>
				</MenuItem>

			</Menu>
		</div>
	
	)};

