import React, { useState, useEffect } from 'react';
import styles from './Popup.module.css';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Component that allows user to select a new host for the studio.
 * @param {Object} newHost - The current new host object.
 * @param {Function} setNewHost - A function used to set the new host object.
 * @param {boolean} isHostErrorMessage - A boolean indicating whether there was an error selecting a new host.
 * @param {Array} studioUsers - An array of strings representing user IDs of listeners in the studio.
 * @returns {JSX.Element} - Returns a JSX element that renders a component to select a new host for the studio.
 */
export default function NewHostSelection({
	newHost,
	setNewHost,
	isHostErrorMessage,
	studioUsers,
}) {
	const [listeners, setListeners] = useState([]);

	useEffect(() => {
		if (!studioUsers || !Array.isArray(studioUsers)) {
			console.log('no studio users');
			return;
		}
		async function fetchUserData() {
			const promises = studioUsers.map((user) =>
				axios.get(`${BASE_URL}/api/user/${user}`)
			);
			const userDataList = await Promise.all(promises);

			const currentUser = localStorage.getItem('current_user_id').replace(/"/g, '');
			const potentialHosts = userDataList
				.map((response) => response.data)
				.filter((listener) => listener.username !== currentUser);
			// Only show active users
			const activeHosts = potentialHosts.filter(
				(listener) => listener.userIsActive
			);
			setListeners(activeHosts);
		}
		fetchUserData();
	}, [studioUsers]);

	return (
		<div>
			<div className={styles.listenerList}>
				{listeners.map((listener) => (
					<ListenerListItem
						key={listener.username}
						listener={listener}
						isNewHost={listener.username === newHost}
						setNewHost={setNewHost}
					/>
				))}
			</div>
			{isHostErrorMessage && (
				<p className={styles.helperText}>You must select a host</p>
			)}
		</div>
	);
}

/**
 * Component that renders a listener item and allows for setting a new host
 * @param {Object} listener - An object representing the listener to be displayed in item.
 * @param {boolean} isNewHost - A boolean indicating whether the current user is selecting a new host.
 * @param {Function} setNewHost - A function used to set the new host.
 * @returns {JSX.Element} - A React element that displays the listener item and host icon.
 */
function ListenerListItem({ listener, isNewHost, setNewHost }) {
	const handleClick = () => {
		setNewHost(listener.username);
	};

	return (
		<div
			className={styles.listenerListItem}
			onClick={handleClick}>
			<img
				src={listener.profilePic}
				alt={'Profile picture of ' + listener.userDisplayName}
			/>
			<p style={{ color: 'var(--headingColor)' }}>{listener.userDisplayName}</p>
			{isNewHost ? (
				<StarRoundedIcon
					className={styles.hostIcon}
					style={{ color: 'var(--iconColor)', fontSize: '30px' }}
				/>
			) : (
				<StarBorderRoundedIcon
					className={styles.hostIcon}
					style={{ color: 'var(--iconColor)', fontSize: '30px' }}
				/>
			)}
		</div>
	);
}
