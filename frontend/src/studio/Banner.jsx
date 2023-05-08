import styles from "./StudioPage.module.css";
import React, { useState, useEffect } from "react";
import LeaveStudioDialog from "./LeaveStudioDialog";
import NicknameDialog from "./NicknameDialog";
import AssignNewHostDialog from "./AssignNewHostDialog";
import ProfilePicImg1 from "../assets/profilepic1.png";
import ProfilePicImg2 from "../assets/profilepic2.png";
import ProfilePicImg3 from "../assets/profilepic3.png";
import ProfilePicImg4 from "../assets/profilepic4.png";
import ProfilePicImg5 from "../assets/profilepic5.png";
import ProfilePicImg6 from "../assets/profilepic6.png";
import ListenerIcons from "../shared/ListenerIcons";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import DriveFileRenameOutlineRoundedIcon from "@mui/icons-material/DriveFileRenameOutlineRounded";
import PersonRemoveAlt1RoundedIcon from "@mui/icons-material/PersonRemoveAlt1Rounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import VideogameAssetRoundedIcon from "@mui/icons-material/VideogameAssetRounded";
import VideogameAssetOffRoundedIcon from "@mui/icons-material/VideogameAssetOffRounded";
import GroupRemoveRoundedIcon from "@mui/icons-material/GroupRemoveRounded";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ConfirmationDialog from "../shared/ConfirmationDialog";

// TO DO: get if user is host or not
// const isHost = false;

const hostImage = ProfilePicImg1;
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const listeners = [
	{ id: 1, username: "breannajury", icon: ProfilePicImg1 },
	{ id: 2, username: "ananyaahluwalia", icon: ProfilePicImg2 },
	{ id: 3, username: "yuewenzheng", icon: ProfilePicImg3 },
	{ id: 4, username: "samanthamebius", icon: ProfilePicImg4 },
	{ id: 5, username: "amyrimmer", icon: ProfilePicImg5 },
	{ id: 6, username: "angelalorusso", icon: ProfilePicImg6 },
	{ id: 7, username: "breannajury1", icon: ProfilePicImg1 },
	{ id: 8, username: "ananyaahluwalia1", icon: ProfilePicImg2 },
	{ id: 9, username: "yuewenzheng1", icon: ProfilePicImg3 },
	{ id: 10, username: "samanthamebius1", icon: ProfilePicImg4 },
	{ id: 11, username: "amyrimmer1", icon: ProfilePicImg5 },
	{ id: 12, username: "angelalorusso1", icon: ProfilePicImg6 },
];

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL ?? "";

export default function Banner({ id, studio, socket }) {
	const navigate = useNavigate();

	if (!studio) {
		return <p>Could not load studio</p>;
	}

	const studioName = studio.studioName;
	const backgroundImage = IMAGE_BASE_URL + studio.studioPicture;

	const isHost = (studio.studioHost === localStorage.getItem("current_user_id").replace(/"/g, ''));

	const [controlEnabled, toggleControl] = useState(
		studio.studioControlHostOnly
	);
	const handleControlToggle = () => {
		toggleControl((current) => !current);
		studio = axios.post(`${BASE_URL}/api/studio/${id}/toggle`);
	};
	const handleDelete = () => {
		axios.delete(`${BASE_URL}/api/studio/${id}`).then((res) => {
			console.log(res);
		});
		navigate("/");
		window.location.reload(false);
	};

	const handleTEST = () => {
		const users = ["ananya2001", "smeb123", "yuewen789", "bre123"];

		axios.put(`${BASE_URL}/api/studio/${id}/updateListeners`, {
			listeners: users,
		}).then((res) => {
			console.log(res);
		});
	}

	const users = studio.studioUsers;
	const isAlone = (users.length <= 1) ? true : false;
	const isListening = studio.studioIsActive;

	return (
		<div
			className={styles.banner}
			style={{ backgroundImage: `url(${backgroundImage})` }}
		>
			<h1 className={styles.bannerStudioName}>{studioName}</h1>

			<div className={styles.bannerlisteners} onClick={handleTEST}>
				<ListenerIcons
					studioUsers={users}
					isListening={isListening}
					isHomeCard={false}
				/>
			</div>
			<div className={styles.bannerDropdownKebab}>
				<DropdownKebab
					controlEnabled={controlEnabled}
					handleControlToggle={handleControlToggle}
					handleDelete={handleDelete}
					id={id}
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
	controlEnabled,
	handleControlToggle,
	handleDelete,
	isHost,
	id,
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
	const [isAssignOpen, setIsAssignOpen] = useState(false);

	const [isInLeave, setInLeave] = useState(false);
	const [isInEdit, setInEdit] = useState(false);
	const [isInRemove, setInRemove] = useState(false);
	const [isInAssign, setInAssign] = useState(false);
	const [isInEnable, setInEnable] = useState(false);
	const [isInDelete, setInDelete] = useState(false);
	const navigate = useNavigate();

	const enterLeave = () => {
		setInLeave(true);
	};
	const enterEdit = () => {
		setInEdit(true);
	};
	const enterRemove = () => {
		setInRemove(true);
	};
	const enterAssign = () => {
		setInAssign(true);
	};
	const enterEnable = () => {
		setInEnable(true);
	};
	const enterDelete = () => {
		setInDelete(true);
	};

	const leaveLeave = () => {
		setInLeave(false);
	};
	const leaveEdit = () => {
		setInEdit(false);
	};
	const leaveRemove = () => {
		setInRemove(false);
	};
	const leaveAssign = () => {
		setInAssign(false);
	};
	const leaveEnable = () => {
		setInEnable(false);
	};
	const leaveDelete = () => {
		setInDelete(false);
	};

	const handleClick = (event) => {
		setOpen(event.currentTarget);
		setInLeave(false);
		setInEdit(false);
		setInRemove(false);
		setInAssign(false);
		setInEnable(false);
		setInDelete(false);
	};

	const handleClose = () => {
		setOpen(null);
		setInLeave(false);
		setInEdit(false);
		setInRemove(false);
		setInAssign(false);
		setInEnable(false);
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

	const handleLeaveStudio = () => {
		const user_id = localStorage.getItem("current_user_id");
		axios.put(`${BASE_URL}/api/studio/${id}/leave/${user_id}`);
        navigate('/', { replace: true });
	};

	return (
		<div>
			<LeaveStudioDialog
				isHost={isHost}
				isLeaveDialogOpened={isLeaveOpen}
				handleCloseLeaveDialog={() => setIsLeaveOpen(false)}
				listeners={listeners}
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
				socket={socket}
			/>
			<div onClick={handleClick} className={styles.dropdownButton}>
				<MoreVertRoundedIcon style={{ color: "white", fontSize: "30px" }} />
			</div>
			<Menu
				autoFocus={false}
				anchorEl={isOpen}
				open={open}
				onClose={handleClose}
			>
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
					style={{ display: (!isHost || isAloneInStudio) ? "none" : "flex" }}
					className={styles.menu_item}
					onClick={handleClose}
					onMouseEnter={enterRemove}
					onMouseLeave={leaveRemove}
				>
					<PersonRemoveAlt1RoundedIcon
						className={styles.icon}
						style={{ color: isInRemove ? "#B03EEE" : "#757575" }}
					/>
					<p className={styles.menu_title}>Remove a Member</p>
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
					style={{ display: (!isHost || isAloneInStudio) ? "none" : "flex" }}
					className={styles.menu_item}
					onClick={() => {
						handleClose;
						handleControlToggle();
					}}
					onMouseEnter={enterEnable}
					onMouseLeave={leaveEnable}
				>
					{controlEnabled ? (
						<>
							<VideogameAssetOffRoundedIcon
								className={styles.icon}
								style={{ color: isInEnable ? "#B03EEE" : "#757575" }}
							/>
							<p className={styles.menu_title}>Disable Control</p>
						</>
					) : (
						<>
							<VideogameAssetRoundedIcon
								className={styles.icon}
								style={{ color: isInEnable ? "#B03EEE" : "#757575" }}
							/>
							<p className={styles.menu_title}>Enable Control</p>
						</>
					)}
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
	);
}
