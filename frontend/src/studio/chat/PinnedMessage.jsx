import React, { useEffect, useState } from "react";
import styles from "./PinnedMessage.module.css";
import PushPinIcon from "@mui/icons-material/PushPin";
import axios from "axios";
import defaultProfilePicture from "../../assets/profilepic.png";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function PinnedMessage({ pinnedMessage }) {
	const [profileImage, setProfileImage] = useState(defaultProfilePicture);

	useEffect(() => {
		axios
			.get(`${BASE_URL}/api/user/${pinnedMessage.spotifyUsername}`)
			.then((response) => {
				if (response.data?.profilePic !== "") {
					setProfileImage(response.data?.profilePic);
				}
			});
	}, []);

	return (
		<div className={styles.pinnedMessage}>
			<div className={styles.content}>
				<PushPinIcon className={styles.pin} />
				<p className={styles.message}>{pinnedMessage.message}</p>
			</div>
			<img src={profileImage} alt="profile" className={styles.profileImage} />
		</div>
	);
}

export default PinnedMessage;
