import React from "react";
import styles from "./ChatMessage.module.css";

function ChatMessage({ newMessage }) {
	const { message, username, __createdtime } = newMessage;

	return (
		<div className={styles.chatMessage}>
			<h4 className={styles.username}>{username}</h4>
			<div className={styles.message}>
				<p className={styles.body}>{message}</p>
			</div>
		</div>
	);
}

export default ChatMessage;
