import React, { useEffect, useState } from 'react';
import styles from './PinnedMessage.module.css';
import PushPinIcon from '@mui/icons-material/PushPin';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Component for displaying a single pinned message
 * @param pinnedMessage - Object of the currently pinned message
 * @param room - The id of the studio of the pinned message
 * @param socket - Communication channel between client and server
 * @returns
 */
function PinnedMessage({ pinnedMessage, room, socket }) {
	const [profileImage, setProfileImage] = useState(defaultProfilePicture);
	const [hover, setHover] = useState(false);

	// handle the remove pin message from socket
	const handleRemovePin = async () => {
		socket.emit('remove_pinned_message', { newMessage: pinnedMessage, room });
		await axios.put(
			`${BASE_URL}/api/chat/remove-pinned-message/${room}`,
			pinnedMessage
		);
	};

	// set the profile picture of the pinned message
	useEffect(() => {
		axios.get(`${BASE_URL}/api/user/${pinnedMessage.username}`).then((response) => {
			if (response.data?.profilePic !== '') {
				setProfileImage(response.data?.profilePic);
			}
		});
	}, []);

	return (
		<div
			className={styles.pinnedMessage}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}>
			<div className={styles.content}>
				<PushPinIcon
					className={styles.pin}
					style={{ color: 'var(--iconColor)' }}
				/>
				<p className={styles.message}>{pinnedMessage.message}</p>
			</div>
			<img
				src={profileImage}
				alt='profile'
				className={styles.profileImage}
			/>
			{hover && (
				<CloseRoundedIcon
					fontSize='small'
					className={styles.delete}
					onClick={() => handleRemovePin()}
					style={{ color: 'var(--iconColor)' }}
				/>
			)}
		</div>
	);
}

export default PinnedMessage;
