import styles from './ListenerIcons.module.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

/**
 * Function that assigns the CSS styles for a listener's image depending on their status.
 * @param {number} i - Index of listener in the studio.
 * @param {boolean} isListening - Indicates whether the the studio is active.
 * @param {boolean[]} profileStatus - Array indicating the activity status of each listener in studio.
 * @param {boolean} isHomeCard - Location of the listener icons.
 * @returns {Object} The CSS styles for the image of a listener
 */
const setListenerImageStyles = (i, isListening, profileStatus, isHomeCard) => {
	// Set styling which every image follows as a base
	let baseStyle = { transform: `translate(${70 * i}%)`, float: `right` };

	// If the listener image is on home, stack in the opposite direction
	if (isHomeCard) {
		baseStyle = { transform: `translate(${-70 * i}%)`, float: `left` };
	}

	// If listener is inactive, add a grey filter to their image.
	let greyStyle = { WebkitFilter: 'brightness(30%)' };
	let listenerStyles = {};
	if (isListening) {
		if (profileStatus[i]) {
			listenerStyles = { ...baseStyle };
		} else {
			listenerStyles = { ...baseStyle, ...greyStyle };
		}
	} else {
		listenerStyles = { ...baseStyle };
	}

	return listenerStyles;
};

/**
 * Component which displays a set of user profile images in stacked bubbles for a studio.
 * @param {Object} studioUsers - Array of users who are a part of the studio.
 * @param {boolean} isListening - Indicates whether the the studio is active.
 * @param {boolean} isHomeCard - Indicates whether the studio card is being displayed on the home page or not.
 * @returns {JSX.Element} - Listener bubble stack for a studio.
 */
export default function StudioCard({ studioUsers, isListening, isHomeCard }) {
	const [userList, setUserList] = useState([]);

	const BASE_URL = import.meta.env.VITE_API_BASE_URL;

	// Get user data
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
			setUserList(userDataList.map((response) => response.data));
		}
		fetchUserData();
	}, [studioUsers]);

	// Sort active users before inactive users
	const activeFirst = [...userList].sort((a, b) => b.userIsActive - a.userIsActive);

	// Create arrays for images and activity status for each user
	const profileImages = activeFirst.map((user) => user.profilePic);
	const profileStatus = activeFirst.map((user) => user.userIsActive);

	// Order based on destination
	if (!isHomeCard) {
		profileStatus.reverse();
		profileImages.reverse();
	}

	return (
		<div className={styles.listenersImages}>
			{Array.isArray(profileImages)
				? profileImages.map((listenerImage, i) => (
						<img
							key={i}
							className={styles.listenerImage}
							src={listenerImage}
							alt={'Listener profile picture'}
							style={setListenerImageStyles(
								i,
								isListening,
								profileStatus,
								isHomeCard
							)}
						/>
				  ))
				: null}
		</div>
	);
}
