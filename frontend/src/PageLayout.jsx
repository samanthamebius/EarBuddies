import React, { useContext, useEffect, useState } from "react";
import styles from "./PageLayout.module.css";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import ViewProfileDialog from "./profile/ViewProfileDialog";
import useAuth from "./hooks/useAuth";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import logo from "./assets/shared/earBuddiesLogo.png";
import defaultProfilePic from "./assets/home/defaultprofilepic.png";
import useGet from "./hooks/useGet";
import axios from 'axios';
import { AppContext } from "./AppContextProvider";
import ConfirmationDialog from "./shared/ConfirmationDialog";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function PageLayout() {
	return (
		<React.Fragment>
			<NavMenu />
			<div className="container">
				<Outlet />
			</div>
		</React.Fragment>
	);
}

function NavMenu() {
	return (
		<header className={styles.navmenu}>
			<NavLink to=".">
				<div className={styles.navLink}>
					<img src={logo} className={styles.logo} />
					<h1 className={styles.brandName}>EAR BUDDIES</h1>
				</div>
			</NavLink>
			<DropdownMenu />
		</header>
	);
}

function UserInfo() {
	const { setUsername, setDisplayName } = useContext(AppContext);
	const current_user_id = localStorage.getItem("current_user_id");
	const id = JSON.parse(current_user_id);

	if (!current_user_id) {
		return <p>Could not load user</p>;
	}

	const { data: user, isLoading: userIsLoading } = useGet(`/api/user/${id}`);

	useEffect(() => {
		if (!userIsLoading && user) {
			setDisplayName(user?.userDisplayName);
			setUsername(user?.username);
		}
	}, [user, userIsLoading]);

	if (userIsLoading) {
		return <p>Loading...</p>;
	} else if (!user) {
		return <p>Could not load user</p>;
	} else {
		var profilePicture = "";
		var username = "";
		try {
			profilePicture = user.profilePic;
			username = user.userDisplayName;
		} catch (error) {
			console.log(error);
		}
		// If Spotify account doesn't have a profile picture, set to default
		if (profilePicture === "") {
			axios.put(`${BASE_URL}/api/user/${id}`, {
				profilePic: defaultProfilePic
			});
			window.location.reload(false);
		}

		return (
			<div className={styles.profile_layout}>
				<img src={profilePicture} className={styles.profile_picture} />
				<p className={styles.username}>{username} </p>
			</div>
		);
	}
}

/**
 * Checks if user is logged in, if not, redirects to login page
 */
function login() {
	const access_token = localStorage.getItem("access_token");
	const code = new URLSearchParams(window.location.search).get("code");
	const current_user_id = localStorage.getItem("current_user_id");
	if (access_token == null) {
		//check for code
		if (code == null) {
			//reroute to login page
			window.location.href = "/login";
			return;
		}
	}
	useAuth(access_token, code, current_user_id);
}

export function DropdownMenu() {
	const [isViewProfileOpen, setIsViewProfileOpen] = useState(false);
	const [isOpen, setOpen] = useState(null);
	const [isInProfle, setInProfile] = useState(false);
	const [isInDarkMode, setInDarkMode] = useState(false);
	const [isInLogOut, setInLogOut] = useState(false);
	const [isConfirmLogoutOpen, setConfirmLogoutOpen] = useState(false);

	const navigate = useNavigate();
	const open = Boolean(isOpen);

	const handleClick = (event) => {
		setOpen(event.currentTarget);
	};

	const handleClose = () => {
		setOpen(null);
		setInProfile(false);
		setInDarkMode(false);
		setInDarkMode(false);
	};

	const handleLogout = () => {
		handleClose;
		localStorage.removeItem("access_token");
		localStorage.removeItem("refresh_token");
		localStorage.removeItem("expires_in");
		localStorage.removeItem("current_user_id");

		navigate("/login");
	};

	const handleViewProfileOpen = () => {
		setIsViewProfileOpen(true);
	};

	const handleConfirmLogoutOpen = () => {
		setConfirmLogoutOpen(true);
	};

	login();
	const toggleProfile = () => {
		setInProfile(!isInProfle);
	};
	const toggleDarkMode = () => {
		setInDarkMode(!isInDarkMode);
	};
	const toggleLogOut = () => {
		setInLogOut(!isInLogOut);
	};

	return (
		<>
			<ViewProfileDialog
				isViewProfileOpen={isViewProfileOpen}
				handleViewProfileClose={() => {
					setIsViewProfileOpen(false);
					window.location.reload(); //kinda janky code but i couldn't get it working any other way
				}}
			/>
			<ConfirmationDialog
				isOpen={isConfirmLogoutOpen}
				handleClose={() => setConfirmLogoutOpen(false)}
				handleAction={() => handleLogout()}
				message={"Are you sure you want to logout?"}
				actionText={"Log Out"}
			/>
			<div className={styles.dropdown}>
				<Button
					sx={{ fontWeight: 600 }}
					variant="contained"
					size="large"
					onClick={handleClick}
					className={styles.button}
				>
					<UserInfo />
				</Button>

				<Menu anchorEl={isOpen} open={open} onClose={handleClose}>
					<MenuItem
						className={styles.menu_item}
						onClick={() => handleViewProfileOpen()}
						onMouseEnter={toggleProfile}
						onMouseLeave={toggleProfile}
					>
						<PersonRoundedIcon
							className={styles.icon}
							style={{ color: isInProfle ? "#B03EEE" : "#757575" }}
						/>
						<p className={styles.menu_title}>View Profile</p>
					</MenuItem>

					<MenuItem
						className={styles.menu_item}
						onClick={handleClose}
						onMouseEnter={toggleDarkMode}
						onMouseLeave={toggleDarkMode}
					>
						<DarkModeRoundedIcon
							className={styles.icon}
							style={{ color: isInDarkMode ? "#B03EEE" : "#757575" }}
						/>
						<p className={styles.menu_title}>Dark Mode</p>
					</MenuItem>
					<MenuItem
						className={styles.menu_item}
						onClick={handleConfirmLogoutOpen}
						onMouseEnter={toggleLogOut}
						onMouseLeave={toggleLogOut}
					>
						<LogoutRoundedIcon
							className={styles.icon}
							style={{ color: isInLogOut ? "#B03EEE" : "#757575" }}
						/>
						<p className={styles.menu_title}>Log Out</p>
					</MenuItem>
				</Menu>
			</div>
		</>
	);
}
