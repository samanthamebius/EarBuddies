import React from "react";
import styles from "./ChatMessage.module.css";
import messageDecoration1 from "../../assets/chat/messageDecoration1.svg";
import messageDecoration2 from "../../assets/chat/messageDecoration2.svg";

function ChatMessage({ newMessage }) {
	const { message, username } = newMessage;
	const isCurrentUser = username === "test";

	const setMessageBodyStyle = () => {
		const message = {
			backgroundColor: `${isCurrentUser ? "#E640F8" : "#B03EEE"}`,
			padding: "12px",
			borderRadius: "16px",
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

	console.log(`newMessage ${newMessage.username}`);

	return (
		<div style={setChatMessageStyle()}>
			<h4 className={styles.username}>{username}</h4>
			<div style={setMessageBodyStyle()}>
				<p className={styles.body}>{message}</p>
			</div>
			<img
				src={isCurrentUser ? messageDecoration1 : messageDecoration2}
				style={{ margin: "-17px 0 0 -1px", zIndex: 0 }}
			/>
		</div>
	);
}

export default ChatMessage;
