import styles from "./StudioPage.module.css";
import React from "react";
import { useState } from "react";
import LeaveStudioDialog from "./LeaveStudioDialog"

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

const studioName = "Software Swifties";
const backgroundImage = TaylorSwiftImg;
const hostImage = ProfilePicImg1;
const isListening = true;

const listenersImages = [
	ProfilePicImg1,
	ProfilePicImg2,
	ProfilePicImg3,
	ProfilePicImg4,
	ProfilePicImg5,
	ProfilePicImg6,
];
const listenersActive = [true, true, false, false, true, false];

const listeners = [
	{ id:1, username:'breannajury', icon: ProfilePicImg1},
	{ id:2, username:'ananyaahluwalia', icon: ProfilePicImg2},
	{ id:3, username:'yuewenzheng', icon: ProfilePicImg3},
	{ id:4, username:'samanthamebius', icon: ProfilePicImg4},
	{ id:5, username:'amyrimmer', icon: ProfilePicImg5},
	{ id:6, username:'angelalorusso', icon: ProfilePicImg6}
];

export default function Banner() {
	const [addIconAdded, setAddIconAdded] = useState(false);
	if (addIconAdded == false) {
		listenersImages.push(AddListenerIcon);
		listenersActive.push(true);
		setAddIconAdded(true);
	}

	const [controlEnabled, toggleControl] = useState(false);
	const handleControlToggle = () => {
		toggleControl((current) => !current);
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
				/>
			</div>
		</div>
	);
}

export function DropdownKebab({ controlEnabled, handleControlToggle }) {
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
			<div
				onClick={handleClick}
				className={styles.dropdownButton}
			>
				<img
					src={KebabIcon}
					className={styles.kebabIcon}
				/>
			</div>

			<Menu 
				autoFocus={false}
				anchorEl={isOpen} 
				open={open} 
				onClose={handleClose} 
			>
				<MenuItem onClick={handleLeaveOpen}>
					<img src={LeaveGroupIcon} className={styles.icon} />
					<span className={styles.menu_item}> Leave Group</span>
				</MenuItem>
				<LeaveStudioDialog 
					isDialogOpened={isLeaveOpen}
					handleCloseDialog={() => setIsLeaveOpen(false)} 
					listeners={listeners}/>

				<MenuItem onClick={handleClose}>
					<img src={EditNicknameIcon} className={styles.icon} />
					<span className={styles.menu_item}>Edit Nickname </span>
				</MenuItem>

				<MenuItem onClick={handleClose}>
					<img src={RemoveMemberIcon} className={styles.icon} />
					<span className={styles.menu_item}>Remove a Member</span>
				</MenuItem>

				<MenuItem onClick={handleClose}>
					<img src={AssignNewHostIcon} className={styles.icon} />
					<span className={styles.menu_item}>Assign a New Host</span>
				</MenuItem>

				<MenuItem
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
						<span className={styles.menu_item}>Disable Control</span>
					) : (
						<span className={styles.menu_item}>Enable Control</span>
					)}
				</MenuItem>
			</Menu>
		</div>
	);
}
