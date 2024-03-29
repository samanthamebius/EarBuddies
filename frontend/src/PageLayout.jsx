import React, { useContext, useEffect, useState } from 'react';
import styles from './PageLayout.module.css';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import ViewProfileDialog from './profile/ViewProfileDialog';
import useAuth from './hooks/useAuth';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeIcon from '@mui/icons-material/LightMode';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import logo from './assets/shared/earBuddiesLogo.png';
import defaultProfilePic from './assets/home/defaultprofilepic.png';
import useGet from './hooks/useGet';
import axios from 'axios';
import { AppContext } from './AppContextProvider';
import ConfirmationDialog from './shared/ConfirmationDialog';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Defines layout of every page with nav menu at the top and rest of the content below.
 * @returns {JSX.Element} - Returns a React Fragment for the page structure.
 */
export default function PageLayout() {
	return (
		<React.Fragment>
			<NavMenu />
			<div className='container'>
				<Outlet />
			</div>
		</React.Fragment>
	);
}

/**
 * Navigation menu for the application.
 * @return {JSX.Element} - Returns the header element containing logo and a DropdownMenu component.
 */
function NavMenu() {
	return (
		<header className={styles.navmenu}>
			<NavLink to='.'>
				<div className={styles.navLink}>
					<img
						src={logo}
						className={styles.logo}
						alt='Ear Buddies logo'
					/>
					<h1 className={styles.brandName}>EAR BUDDIES</h1>
				</div>
			</NavLink>
			<DropdownMenu />
		</header>
	);
}

/**
 * Fetches user data and displaying the user profile picture and username.
 * @return {JSX.Element} - Returns element containing the user profile picture and username.
 */
function UserInfo() {
	const { setUsername, setDisplayName } = useContext(AppContext);

	// Get user information
	const current_user_id = localStorage.getItem('current_user_id');
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

	// Initialise user information
	if (userIsLoading) {
		return <p>Loading...</p>;
	} else if (!user) {
		return <p>Could not load user</p>;
	} else {
		var spotifyPicture = '';
		var profilePicture = '';
		var username = '';
		try {
			spotifyPicture = user.spotifyPic;
			profilePicture = user.profilePic;
			username = user.userDisplayName;
		} catch (error) {
			console.log(error);
		}
		// If Spotify account doesn't have a profile picture, set to default
		if (profilePicture === '') {
			axios.put(`${BASE_URL}/api/user/${id}`, {
				profilePic: defaultProfilePic,
				spotifyPic: defaultProfilePic,
			});
			window.location.reload(false);
		}

		return (
			<div className={styles.profile_layout}>
				<img
					src={profilePicture}
					alt='Profile picture of the user'
					className={styles.profilePic}
				/>
				<p className={styles.username}>{username} </p>
			</div>
		);
	}
}

/**
 * Checks if user is logged in, if not, redirects them to login page.
 * @returns {void}
 */
function login() {
	const access_token = localStorage.getItem('access_token');
	const code = new URLSearchParams(window.location.search).get('code');
	const current_user_id = localStorage.getItem('current_user_id');
	if (access_token == null) {
		// Check for access token or code
		if (code == null) {
			// Reroute to login page if they don't have either.
			window.location.href = '/login';
			return;
		}
	}
	useAuth(access_token, code, current_user_id);
}

/**
 * Renders a dropdown menu containing options for view profile, dark mode, and log out.
 * @return {JSX.Element} The JSX code to render the dropdown menu.
 */
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

		const username = JSON.parse(localStorage.getItem('current_user_id'));
		localStorage.removeItem('access_token');
		localStorage.removeItem('refresh_token');
		localStorage.removeItem('expires_in');
		localStorage.removeItem('current_user_id');

		axios.put(`${BASE_URL}/api/user/${username}/logout`);

		navigate('/login');
	};

	login();

	// Nav Menu Dropdown functions
	// Profile Functions
	const toggleProfile = () => {
		setInProfile(!isInProfle);
	};

	const handleViewProfileOpen = () => {
		setIsViewProfileOpen(true);
	};

	// Dark Mode Functions
	const toggleDarkMode = () => {
		setInDarkMode(!isInDarkMode);
	};

	const colorModePref = window.matchMedia('(prefers-color-scheme: dark)').matches;
	const colorModeSetting = localStorage.getItem('selectedTheme');
	const [isDarkMode, setIsDarkMode] = useState(
		colorModeSetting ? colorModeSetting == 'dark' : colorModePref
	);

	const updateToDarkMode = () => {
		document.querySelector('body').setAttribute('data-theme', 'dark');
		localStorage.setItem('selectedTheme', 'dark');
	};

	const updateToLightMode = () => {
		document.querySelector('body').setAttribute('data-theme', 'light');
		localStorage.setItem('selectedTheme', 'light');
	};

	if (isDarkMode) {
		updateToDarkMode();
	}

	const toggleTheme = (e) => {
		if (isDarkMode) {
			updateToLightMode();
			setIsDarkMode(false);
		} else {
			updateToDarkMode();
			setIsDarkMode(true);
		}
	};

	// Log out functions
	const toggleLogOut = () => {
		setInLogOut(!isInLogOut);
	};

	const handleConfirmLogoutOpen = () => {
		setConfirmLogoutOpen(true);
	};

	return (
		<>
			<ViewProfileDialog
				isViewProfileOpen={isViewProfileOpen}
				handleViewProfileSave={() => {
					window.location.reload();
				}}
				handleViewProfileClose={() => {
					setIsViewProfileOpen(false);
				}}
			/>
			<ConfirmationDialog
				isOpen={isConfirmLogoutOpen}
				handleClose={() => setConfirmLogoutOpen(false)}
				handleAction={() => handleLogout()}
				message={'Are you sure you want to logout?'}
				actionText={'Log Out'}
			/>
			<div className={styles.dropdown}>
				<Button
					sx={{ fontWeight: 600 }}
					variant='contained'
					size='large'
					onClick={handleClick}
					className={styles.button}>
					<UserInfo />
				</Button>

				<Menu
					anchorEl={isOpen}
					open={open}
					onClose={handleClose}
					PaperProps={{ style: { backgroundColor: 'var(--dialogColor)' } }}>
					<MenuItem
						className={styles.menu_item}
						onClick={() => handleViewProfileOpen()}
						onMouseEnter={toggleProfile}
						onMouseLeave={toggleProfile}>
						<PersonRoundedIcon
							className={styles.icon}
							style={{ color: isInProfle ? '#B03EEE' : 'var(--iconColor)' }}
						/>
						<p className={styles.menu_title}>My Profile</p>
					</MenuItem>

					<MenuItem
						className={styles.menu_item}
						onClick={toggleTheme}
						onMouseEnter={toggleDarkMode}
						onMouseLeave={toggleDarkMode}>
						{isDarkMode ? (
							<LightModeIcon
								className={styles.icon}
								style={{
									color: isInDarkMode ? '#B03EEE' : 'var(--iconColor)',
								}}
							/>
						) : (
							<DarkModeRoundedIcon
								className={styles.icon}
								style={{
									color: isInDarkMode ? '#B03EEE' : 'var(--iconColor)',
								}}
							/>
						)}

						<p className={styles.menu_title}>
							{isDarkMode ? 'Light Mode' : 'Dark Mode'}{' '}
						</p>
					</MenuItem>

					<MenuItem
						className={styles.menu_item}
						onClick={handleConfirmLogoutOpen}
						onMouseEnter={toggleLogOut}
						onMouseLeave={toggleLogOut}>
						<LogoutRoundedIcon
							className={styles.icon}
							style={{ color: isInLogOut ? '#B03EEE' : 'var(--iconColor)' }}
						/>
						<p className={styles.menu_title}>Log Out</p>
					</MenuItem>
				</Menu>
			</div>
		</>
	);
}
