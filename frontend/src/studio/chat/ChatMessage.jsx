import React, { useEffect, useState } from "react";
import styles from "./ChatMessage.module.css";
import messageDecoration1 from "../../assets/chat/messageDecoration1.svg";
import messageDecoration2 from "../../assets/chat/messageDecoration2.svg";
import pinIcon from "../../assets/chat/pinIcon.svg";
import filledPinIcon from "../../assets/chat/filledPinIcon.svg";
import replyIcon from "../../assets/chat/replyIcon.svg";

function ChatMessage(props) {
	const { newMessage, setPinnedMessages, pinnedMessages, setReplyToMessage } =
		props;
	const { message, username } = newMessage;
	const [isPinned, setIsPinned] = useState(false);
	const [isReplying, setIsReplying] = useState(false);
	const [hover, setHover] = useState(false);

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

	useEffect(() => {
		if (isReplying) {
			setReplyToMessage(
				`Replying to ${isCurrentUser ? "yourself" : username}: ${message}`
			);
		} else {
			setReplyToMessage("");
		}
	}, [isReplying]);

	useEffect(() => {
		if (isPinned) {
			setPinnedMessages([...pinnedMessages, message]);
		}
		// else {
		// 	setPinnedMessages(pinnedMessages.slice(0, -1));
		// }
	}, [isPinned]);

	return (
		<div
			style={setChatMessageStyle()}
			onMouseOver={() => setHover(true)}
			onMouseOut={() => setHover(false)}
		>
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
				{hover && (
					<>
						<img
							src={replyIcon}
							alt="reply"
							className={styles.reply}
							onClick={() => setIsReplying(!isReplying)}
						/>
						<img
							src={isPinned ? filledPinIcon : pinIcon}
							alt="pin"
							className={styles.pin}
							onClick={() => setIsPinned(!isPinned)}
						/>
					</>
				)}
			</div>
		</div>
	);
}

export default ChatMessage;
