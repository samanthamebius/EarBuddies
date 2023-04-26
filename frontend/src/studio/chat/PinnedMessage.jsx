import React, { useEffect, useState } from "react";
import styles from "./PinnedMessage.module.css";
import PushPinIcon from "@mui/icons-material/PushPin";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import axios from "axios";
import defaultProfilePicture from "../../assets/profilepic.png";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function PinnedMessage({ pinnedMessage, room, socket }) {
	const [profileImage, setProfileImage] = useState(defaultProfilePicture);
	const [hover, setHover] = useState(false);

	const handleRemovePin = async () => {
		socket.emit("remove_pinned_message", { newMessage: pinnedMessage, room });
		console.log(pinnedMessage);
		await axios.put(
			`${BASE_URL}/api/chat/remove-pinned-message/${room.id}`,
			pinnedMessage
		);
	};

	useEffect(() => {
		axios
			.get(`${BASE_URL}/api/user/${pinnedMessage.username}`)
			.then((response) => {
				console.log(response.data);
				if (response.data?.profilePic !== "") {
					setProfileImage(response.data?.profilePic);
				}
			});
	}, []);

	return (
		<div
			className={styles.pinnedMessage}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
		>
			<div className={styles.content}>
				<PushPinIcon className={styles.pin} />
				<p className={styles.message}>{pinnedMessage.message}</p>
			</div>
			<img src={profileImage} alt="profile" className={styles.profileImage} />
			{hover && (
				<CloseRoundedIcon
					fontSize="small"
					className={styles.delete}
					onClick={() => handleRemovePin()}
				/>
			)}
		</div>
	);
}

export default PinnedMessage;
