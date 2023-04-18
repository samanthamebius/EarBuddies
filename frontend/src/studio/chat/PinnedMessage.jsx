import React from "react";
import styles from "./PinnedMessage.module.css";
import pinIcon from "../../assets/chat/pinIcon.svg";
import mockProfilePic from "../../assets/profilepic1.png";

function PinnedMessage({ message }) {
	return (
		<div className={styles.pinnedMessage}>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					width: "-webkit-fill-available",
				}}
			>
				<img src={pinIcon} alt="pin" className={styles.pinIcon} />
				<p className={styles.message}>{message}</p>
			</div>
			<img src={mockProfilePic} alt="profile" className={styles.profileImage} />
		</div>
	);
}

export default PinnedMessage;
