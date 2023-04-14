import React from "react";
import styles from "./ChatMessage.module.css";

function ChatMessage({ newMessage }) {
	const { message, username, __createdtime } = newMessage;
	const isCurrentUser = username === "test";

	const setMessageBodyStyle = () => {
		const message = {
			backgroundColor: `${isCurrentUser ? "#E640F8" : "#B03EEE"}`,
			padding: "12px",
			borderRadius: "30px",
			overflowWrap: "break-word",
			textAlign: "left",
			maxWidth: "50%",
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

	return (
		<div style={setChatMessageStyle()}>
			<h4 className={styles.username}>{username}</h4>
			<div style={setMessageBodyStyle()}>
				<p className={styles.body}>{message}</p>
			</div>
		</div>
	);
}

export default ChatMessage;
