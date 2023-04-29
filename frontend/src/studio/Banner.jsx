import styles from "./StudioPage.module.css";
import React, { useState, useEffect } from "react";
import LeaveStudioDialog from "./LeaveStudioDialog";
import ProfilePicImg1 from "../assets/profilepic1.png";
import ProfilePicImg2 from "../assets/profilepic2.png";
import ProfilePicImg3 from "../assets/profilepic3.png";
import ProfilePicImg4 from "../assets/profilepic4.png";
import ProfilePicImg5 from "../assets/profilepic5.png";
import ProfilePicImg6 from "../assets/profilepic6.png";
import ListenerIcons from "../shared/ListenerIcons";
import AddListenerIcon from "../assets/addListenerIcon.png";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import DriveFileRenameOutlineRoundedIcon from '@mui/icons-material/DriveFileRenameOutlineRounded';
import PersonRemoveAlt1RoundedIcon from '@mui/icons-material/PersonRemoveAlt1Rounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import VideogameAssetRoundedIcon from '@mui/icons-material/VideogameAssetRounded';
import VideogameAssetOffRoundedIcon from '@mui/icons-material/VideogameAssetOffRounded';
import GroupRemoveRoundedIcon from '@mui/icons-material/GroupRemoveRounded';
import useGet from "../hooks/useGet.js"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ConfirmationDialog from '../shared/ConfirmationDialog';


// TO DO: get if user is host or not
const isHost = true;

const hostImage = ProfilePicImg1;
const isListening = true;

const listenersImgs = [
	ProfilePicImg1,
	ProfilePicImg2,
	ProfilePicImg3,
	ProfilePicImg4,
	ProfilePicImg5,
	ProfilePicImg6,
];
const allListenersActive = [true, true, false, false, true, false];

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

export default function Banner({id, studio}) {
	const [listenersImages, setListenersImages] = useState(listenersImgs);
	const [listenersActive, setListenersActive] = useState(allListenersActive);
	const isAddIcon = listenersImages.includes("/src/assets/addListenerIcon.png");
	const navigate = useNavigate();

	if (!studio) {
		return <p>Could not load studio</p>;
	}

	const studioName = studio.studioName;
	const backgroundImage = studio.backgroundImage;

	useEffect(() => {
		if (isAddIcon == false) {
			setListenersActive([...listenersActive, true]);
			setListenersImages([...listenersImages, AddListenerIcon]);
		}
	}, [isAddIcon]);

	const [controlEnabled, toggleControl] = useState(false);
	const handleControlToggle = () => {
		toggleControl((current) => !current);
	};
	const BASE_URL = import.meta.env.VITE_API_BASE_URL;
	const handleDelete = () => {
		axios.delete(`${BASE_URL}/api/studio/${id}`).then((res) => {
			console.log(res);
		});
		navigate("/");

	};

	const users = studio.studioUsers;

	return (
		<div
			className={styles.banner}
			style={
				backgroundImage
					? { backgroundImage: `url(${backgroundImage})` }
					: { backgroundColor: "#797979" }
			}
		>
			<h1 className={styles.bannerStudioName}>{studioName}</h1>

			<div className={styles.bannerlisteners}>
				<ListenerIcons
					studioUsers={users}
					isListening={isListening}
					profileImages={listenersImages}
					profileStatus={listenersActive}
					isHomeCard={false}
				/>
			</div>
			<div className={styles.bannerDropdownKebab}>
				<DropdownKebab
					controlEnabled={controlEnabled}
					handleControlToggle={handleControlToggle}
					handleDelete={handleDelete}
				/>
			</div>
		</div>
	);
}

export function DropdownKebab({ controlEnabled, handleControlToggle, handleDelete }) {
	const [isOpen, setOpen] = useState(null);
	const open = Boolean(isOpen);
	const [isLeaveOpen, setIsLeaveOpen] = useState(false);
    const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
	
	const [isInLeave, setInLeave] = useState(false);
	const [isInEdit, setInEdit] = useState(false);
	const [isInRemove, setInRemove] = useState(false);
	const [isInAssign, setInAssign] = useState(false);
	const [isInEnable, setInEnable] = useState(false);
	const [isInDelete, setInDelete] = useState(false);

	const enterLeave = () => { setInLeave(true) };
	const enterEdit = () => { setInEdit(true) };
	const enterRemove = () => { setInRemove(true) };
	const enterAssign = () => { setInAssign(true) };
	const enterEnable = () => { setInEnable(true) };
	const enterDelete = () => { setInDelete(true) };

	const leaveLeave = () => { setInLeave(false) };
	const leaveEdit = () => { setInEdit(false) };
	const leaveRemove = () => { setInRemove(false) };
	const leaveAssign = () => { setInAssign(false) };
	const leaveEnable = () => { setInEnable(false) };
	const leaveDelete = () => { setInDelete(false) };
		
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
	const handleLeaveOpen = () => { setIsLeaveOpen(true); };
	const handleConfirmDeleteOpen = () => { setConfirmDeleteOpen(true);	};

	return (
		<div>
			<LeaveStudioDialog
					isDialogOpened={isLeaveOpen}
					handleCloseDialog={() => setIsLeaveOpen(false)}
					listeners={listeners}
			/>
			<ConfirmationDialog 
                isOpen={isConfirmDeleteOpen}
                handleClose={() => setConfirmDeleteOpen(false)}
                handleAction={() => {handleClose; handleDelete();}} //TO DO: replace with delete functionality
                message={"Are you sure you want to delete this studio?"}
                actionText={"Delete"}
            />
			<div onClick={handleClick} className={styles.dropdownButton}>
				<MoreVertRoundedIcon style={{ color: "white", fontSize: "30px"}}/>
			</div>
			<Menu
				autoFocus={false}
				anchorEl={isOpen}
				open={open}
				onClose={handleClose}>
				<MenuItem
					className={styles.menu_item} 
					onClick={handleLeaveOpen}
					onMouseEnter={enterLeave} 
                    onMouseLeave={leaveLeave}>
					<ExitToAppRoundedIcon className={styles.icon} style={{ color: isInLeave ? "#B03EEE" : "#757575" }} />
					<p className={styles.menu_title}>Leave Studio</p>
				</MenuItem>
				<MenuItem 
					className={styles.menu_item} 
					onClick={handleClose}
					onMouseEnter={enterEdit} 
                    onMouseLeave={leaveEdit}>
					<DriveFileRenameOutlineRoundedIcon className={styles.icon} style={{ color: isInEdit ? "#B03EEE" : "#757575" }} />
					<p className={styles.menu_title}>Edit Nickname</p>
				</MenuItem>

				<MenuItem 
					style={{display: isHost ? "flex" : "none"}}
					className={styles.menu_item} 
					onClick={handleClose}
					onMouseEnter={enterRemove} 
                    onMouseLeave={leaveRemove}>
					<PersonRemoveAlt1RoundedIcon className={styles.icon} style={{ color: isInRemove ? "#B03EEE" : "#757575" }} />
					<p className={styles.menu_title}>Remove a Member</p>
				</MenuItem>

				<MenuItem 
					style={{display: isHost ? "flex" : "none"}}
					className={styles.menu_item} 
					onClick={handleClose}
					onMouseEnter={enterAssign} 
                    onMouseLeave={leaveAssign}>
					<StarRoundedIcon className={styles.icon} style={{ color: isInAssign ? "#B03EEE" : "#757575" }} />
					<p className={styles.menu_title}>Assign a New Host</p>
				</MenuItem>

				<MenuItem
					style={{display: isHost ? "flex" : "none"}}
					className={styles.menu_item}
					onClick={() => {
						handleClose;
						handleControlToggle();
					}}
					onMouseEnter={enterEnable} 
                    onMouseLeave={leaveEnable}>
					{controlEnabled ? (
						<>
							<VideogameAssetOffRoundedIcon className={styles.icon} style={{ color: isInEnable ? "#B03EEE" : "#757575" }} />
							<p className={styles.menu_title}>Disable Control</p>
						</>
					) : (
						<>
							<VideogameAssetRoundedIcon className={styles.icon} style={{ color: isInEnable ? "#B03EEE" : "#757575" }} />
							<p className={styles.menu_title}>Enable Control</p>
						</>
					)}
				</MenuItem>
				<MenuItem 
					style={{display: isHost ? "flex" : "none"}}
					className={styles.menu_item} 
					onClick={handleConfirmDeleteOpen}
					onMouseEnter={enterDelete} 
                    onMouseLeave={leaveDelete}>
					<GroupRemoveRoundedIcon className={styles.icon} style={{ color: isInDelete ? "#B03EEE" : "#757575" }} />
					<p className={styles.menu_title}>Delete Studio</p>
				</MenuItem>
			</Menu>
		</div>
	);
}
