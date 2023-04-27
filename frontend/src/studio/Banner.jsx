import styles from "./StudioPage.module.css";
import React, { useEffect } from "react";
import { useState } from "react";
import LeaveStudioDialog from "./LeaveStudioDialog";

import TaylorSwiftImg from "../assets/taylorswift.png";

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

import KebabIcon from "../assets/studio/kebabMenuIcon.png";

import LeaveGroupIcon from "../assets/studio/leaveGroupIcon.png";
import EditNicknameIcon from "../assets/studio/editIcon.png";
import RemoveMemberIcon from "../assets/studio/removeMemberIcon.png";
import AssignNewHostIcon from "../assets/studio/hostCrownIcon.png";

import DisableControlIcon from "../assets/studio/disableControlIcon.png";
import EnableControlIcon from "../assets/studio/enableControlIcon.png";

import useGet from "../hooks/useGet.js"
import axios from "axios";

// const studioName = "Software Swifties";
// const backgroundImage = TaylorSwiftImg;
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
	// const { id, studio } = useParams();

	if (!studio) {
		return <p>Could not load studio</p>;
	}

	console.log("in banner " + id);

	console.log("in banner " + studio);
	console.log(studio);
	const studioName = studio.studioName;
	console.log(studioName);
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
	const handleDelete = () => {
		console.log("delete");
	};

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
	const [isOpen, setOpen] = React.useState(null);
	const open = Boolean(isOpen);
	const handleClick = (event) => {
		setOpen(event.currentTarget);
	};
	const handleClose = () => {
		setOpen(null);
	};
	const [isLeaveOpen, setIsLeaveOpen] = useState(false);
	const handleLeaveOpen = () => {
		setIsLeaveOpen(!isLeaveOpen);
	};

	return (
		<div>
			<div onClick={handleClick} className={styles.dropdownButton}>
				<img src={KebabIcon} className={styles.kebabIcon} />
			</div>

			<Menu
				autoFocus={false}
				anchorEl={isOpen}
				open={open}
				onClose={handleClose}
			>
				<MenuItem className={styles.menu_item} onClick={handleLeaveOpen}>
					<img src={LeaveGroupIcon} className={styles.icon} />
					<span> Leave Group</span>
				</MenuItem>
				<LeaveStudioDialog
					isDialogOpened={isLeaveOpen}
					handleCloseDialog={() => setIsLeaveOpen(false)}
					listeners={listeners}
				/>

				<MenuItem className={styles.menu_item} onClick={handleClose}>
					<img src={EditNicknameIcon} className={styles.icon} />
					<span>Edit Nickname </span>
				</MenuItem>

				<MenuItem className={styles.menu_item} onClick={handleClose}>
					<img src={RemoveMemberIcon} className={styles.icon} />
					<span>Remove a Member</span>
				</MenuItem>

				<MenuItem className={styles.menu_item} onClick={handleClose}>
					<img src={AssignNewHostIcon} className={styles.icon} />
					<span>Assign a New Host</span>
				</MenuItem>

				<MenuItem
					className={styles.menu_item}
					onClick={() => {
						handleClose;
						handleControlToggle();
					}}
				>
					<img
						src={controlEnabled ? DisableControlIcon : EnableControlIcon}
						className={styles.icon}
					/>
					{controlEnabled ? (
						<span>Disable Control</span>
					) : (
						<span>Enable Control</span>
					)}
				</MenuItem>
				<MenuItem className={styles.menu_item} onClick={() => {handleClose; handleDelete();}}>
					{/* <img src={DeleteGroupIcon} className={styles.icon} /> */}
					<span>Delete Group</span>
				</MenuItem>
			</Menu>
		</div>
	);
}
