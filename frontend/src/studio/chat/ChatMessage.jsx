import React, { useState } from "react";
import styles from "./ChatMessage.module.css";
import messageDecoration1 from "../../assets/chat/messageDecoration1.svg";
import messageDecoration2 from "../../assets/chat/messageDecoration2.svg";
import pinIcon from "../../assets/chat/pinIcon.svg";
import filledPinIcon from "../../assets/chat/filledPinIcon.svg";

function ChatMessage(props) {
	const { newMessage, setPinnedMessage } = props;
	const { message, username } = newMessage;
	const [isPinned, setIsPinned] = useState(false);
	const isCurrentUser = username === "test";

	const setMessageBodyStyle = () => {
		const message = {
			backgroundColor: `${isCurrentUser ? "#E640F8" : "#B03EEE"}`,
			padding: "12px",
			borderRadius: "16px",
			overflowWrap: "break-word",
			textAlign: "left",
			maxWidth: "100%",
		};
		return message;
	};

	const setChatMessageStyle = () => {
		const message = {
			display: "flex",
			flexDirection: "column",
			alignItems: `${isCurrentUser ? "flex-end" : "flex-start"}`,
			marginBottom: "16px",
			maxWidth: "100%",
		};
		return message;
	};

	const handlePinMessage = () => {
		setIsPinned(!isPinned);

		if (isPinned) {
			setPinnedMessage(message);
		}
	};

	return (
		<div style={setChatMessageStyle()}>
			<h4 className={styles.username}>{username}</h4>
			<div
				style={{
					display: "flex",
					// maxWidth: "60%",
					flexDirection: `${isCurrentUser ? "row-reverse" : "row"}`,
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: `${isCurrentUser ? "flex-end" : "flex-start"}`,
					}}
				>
					<div style={setMessageBodyStyle()}>
						<p className={styles.body}>{message}</p>
					</div>
					<img
						src={isCurrentUser ? messageDecoration1 : messageDecoration2}
						style={{
							margin: "-17px 0 0 -1px",
							zIndex: 0,
						}}
					/>
				</div>
				<img
					src={isPinned ? filledPinIcon : pinIcon}
					alt="pin"
					className={styles.pin}
					onClick={() => handlePinMessage()}
				/>
			</div>
		</div>
	);
}

export default ChatMessage;
