import React, { useEffect, useState } from "react";
import styles from "./ChatMessage.module.css";
import messageDecoration1 from "../../assets/chat/messageDecoration1.svg";
import messageDecoration2 from "../../assets/chat/messageDecoration2.svg";
import pinIcon from "../../assets/chat/pinIcon.svg";
import filledPinIcon from "../../assets/chat/filledPinIcon.svg";
import replyIcon from "../../assets/chat/replyIcon.svg";
import { ReactionBarSelector } from "@charkour/react-reactions";
import SentimentSatisfiedRoundedIcon from "@mui/icons-material/SentimentSatisfiedRounded";

const defaultReactions = [
	{ label: "angry", reaction: <div>😡</div> },
	{ label: "satisfaction", reaction: <div>👍</div> },
	{ label: "happy", reaction: <div>😆</div> },
	{ label: "surprise", reaction: <div>😮</div> },
	{ label: "sad", reaction: <div>😢</div> },
	{ label: "love", reaction: <div>❤️</div> },
];

function ChatMessage(props) {
	const {
		newMessage,
		setPinnedMessages,
		pinnedMessages,
		setReplyToMessage,
		messageReply,
	} = props;
	const { message, username } = newMessage;
	const [isPinned, setIsPinned] = useState(false);
	const [isReplying, setIsReplying] = useState(false);
	const [isReacting, setIsReacting] = useState(false);
	const [reactions, setReactions] = useState([]);
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

	const handleReactions = (selectedReaction) => {
		const reactionIcon = defaultReactions.find(
			(reaction) => reaction.label === selectedReaction
		);
		setReactions([
			{ label: selectedReaction, node: reactionIcon.reaction, by: username },
		]);
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
			{messageReply && (
				<div
					style={{
						backgroundColor: "#f6f9fa",
						padding: "12px",
						borderRadius: `${
							isCurrentUser ? "16px 16px 0 16px" : "16px 16px 0 16px"
						}`,
						marginBottom: "-10px",
					}}
				>
					<p style={{ margin: 0, fontSize: "12px", color: "grey" }}>
						{messageReply}
					</p>
				</div>
			)}
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
				{reactions.length > 0 && (
					<div
						style={{
							backgroundColor: "white",
							alignSelf: "end",
							borderRadius: "80px",
							fontSize: "12px",
							padding: "2px",
							marginLeft: "-14px",
							border: "1px solid lightgrey",
							display: "flex",
							alignItems: "center",
							color: "grey",
							// for current user and no margin left
							// marginRight: "-14px"
							// zIndex: "1"
						}}
					>
						{reactions.map((reaction) => reaction.node)}
						{reactions.length > 1 && reactions.length}
					</div>
				)}
				{hover && (
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
						}}
					>
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
						<SentimentSatisfiedRoundedIcon
							onClick={() => setIsReacting(!isReacting)}
						/>
						{isReacting && hover && (
							<ReactionBarSelector
								iconSize={14}
								style={{ height: "fit-content" }}
								onSelect={(reaction) => handleReactions(reaction)}
							/>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

export default ChatMessage;
