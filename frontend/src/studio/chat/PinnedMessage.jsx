import React from "react";
import styles from "./PinnedMessage.module.css";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import mockProfilePic from "../../assets/profilepic1.png";

function PinnedMessage({ message }) {
	return (
		<div className={styles.pinnedMessage}>
			<div className={styles.content}>
				<PushPinOutlinedIcon className={styles.pin} />
				<p className={styles.message}>{message}</p>
			</div>
			<img src={mockProfilePic} alt="profile" className={styles.profileImage} />
		</div>
	);
}

export default PinnedMessage;
