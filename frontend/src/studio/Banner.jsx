import styles from "./StudioPage.module.css";
import React from "react";
import { useState } from "react";

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
import KebabActiveIcon from "../assets/studio/kebabMenuActiveIcon.png";

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

	return (
		<div>
			<div
				onClick={handleClick}
				className={isOpen ? styles.dropdownButtonActive : styles.dropdownButton}
			>
				<img
					src={isOpen ? KebabActiveIcon : KebabIcon}
					className={styles.kebabIcon}
				/>
			</div>

			<Menu anchorEl={isOpen} open={open} onClose={handleClose}>
				<MenuItem onClick={handleClose}>
					<img src={LeaveGroupIcon} className={styles.icon} />
					Leave Group
				</MenuItem>

				<MenuItem onClick={handleClose}>
					<img src={EditNicknameIcon} className={styles.icon} />
					Edit Nickname
				</MenuItem>

				<MenuItem onClick={handleClose}>
					<img src={RemoveMemberIcon} className={styles.icon} />
					Remove a Member
				</MenuItem>

				<MenuItem onClick={handleClose}>
					<img src={AssignNewHostIcon} className={styles.icon} />
					Assign a New Host
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
						<span>Disable Control</span>
					) : (
						<span>Enable Control</span>
					)}
				</MenuItem>
			</Menu>
		</div>
	);
}
