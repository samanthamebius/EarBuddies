import React, { useContext, useEffect, useState } from "react";
import styles from "./ChatMessage.module.css";
import messageDecoration1 from "../../assets/chat/messageDecoration1.svg";
import messageDecoration2 from "../../assets/chat/messageDecoration2.svg";
import { ReactionBarSelector } from "@charkour/react-reactions";
import SentimentSatisfiedRoundedIcon from "@mui/icons-material/SentimentSatisfiedRounded";
import ReplyRoundedIcon from "@mui/icons-material/ReplyRounded";
import PushPinIcon from "@mui/icons-material/PushPin";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import { AppContext } from "../../AppContextProvider";

const defaultReactions = [
	{ label: "angry", reaction: <div>😡</div> },
	{ label: "satisfaction", reaction: <div>👍</div> },
	{ label: "happy", reaction: <div>😆</div> },
	{ label: "surprise", reaction: <div>😮</div> },
	{ label: "sad", reaction: <div>😢</div> },
	{ label: "love", reaction: <div>❤️</div> },
];

function ChatMessage(props) {
	const { newMessage, setReplyToMessage, messageReply, room, socket } = props;
	const { message, username: messageUsername } = newMessage;
	const [isPinned, setIsPinned] = useState(false);
	const [isReplying, setIsReplying] = useState(false);
	const [isReacting, setIsReacting] = useState(false);
	const [reactions, setReactions] = useState([]);
	const [hover, setHover] = useState(false);

	const { username } = useContext(AppContext);
	const isCurrentUser = username === messageUsername;

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

	const setMessageReplyStyle = () => {
		const message = {
			backgroundColor: "#f6f9fa",
			padding: "12px",
			borderRadius: `${
				isCurrentUser ? "16px 16px 0 16px" : "16px 16px 0 16px"
			}`,
			marginBottom: "-10px",
		};

		return message;
	};

	const setMessageBodyStyle = () => {
		const message = {
			backgroundColor: `${isCurrentUser ? "#E640F8" : "#B03EEE"}`,
			padding: "12px",
			borderRadius: "16px",
			overflowWrap: "anywhere",
			textAlign: "left",
			position: "relative",
		};

		return message;
	};

	const setActionsContainerStyle = () => {
		const container = {
			display: "flex",
			alignItems: "center",
			flexDirection: `${isCurrentUser ? "row-reverse" : "row"}`,
			marginRight: `${isCurrentUser ? "8px" : "0"}`,
			marginLeft: `${isCurrentUser ? "0" : "8px"}`,
			marginBottom: "5px",
			gap: "2px",
		};

		return container;
	};

	const setReactionCounterStyle = () => {
		const reactionCounter = {
			backgroundColor: "white",
			alignSelf: "end",
			borderRadius: "80px",
			fontSize: "12px",
			padding: "2px",
			margin: "0 -10px 0 -10px",
			border: "1px solid lightgrey",
			display: "flex",
			alignItems: "center",
			color: "grey",
			zIndex: "1",
		};
		return reactionCounter;
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
		if (isPinned) {
			socket.emit("send_pinned_message", { newMessage, room });
		}
	}, [isPinned]);

	useEffect(() => {
		if (isReplying) {
			setReplyToMessage(
				`Replying to ${
					isCurrentUser ? "yourself" : messageUsername
				}: ${message}`
			);
		} else {
			setReplyToMessage("");
		}
	}, [isReplying]);

	// useEffect(() => {
	// 	if (isPinned) {
	// 		setPinnedMessages([...pinnedMessages, message]); // sets the local pinned messages
	// 	}
	// 	// else {
	// 	// 	setPinnedMessages(pinnedMessages.slice(0, -1));
	// 	// }
	// }, [isPinned]);

	return (
		<div
			style={setChatMessageStyle()}
			onMouseOver={() => setHover(true)}
			onMouseOut={() => setHover(false)}
		>
			<h4 className={styles.username}>{messageUsername}</h4>
			{messageReply && (
				<div style={setMessageReplyStyle()}>
					<p className={styles.messageReplyContent}>{messageReply}</p>
				</div>
			)}
			<div
				style={{
					display: "flex",
					flexDirection: `${isCurrentUser ? "row-reverse" : "row"}`,
				}}
			>
				{/* Message */}
				<div
					style={{
						display: "flex",
						maxWidth: "70%",
					}}
				>
					{/* Message Content */}
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							position: "relative",
							width: "100%",
							alignItems: `${isCurrentUser ? "flex-end" : "flex-start"}`,
						}}
					>
						<div style={setMessageBodyStyle()}>
							<p className={styles.body}>{message}</p>
						</div>
						<img
							src={isCurrentUser ? messageDecoration1 : messageDecoration2}
							className={styles.messageDecoration}
						/>
					</div>
				</div>
				{/* Reaction Counter */}
				{reactions.length > 0 && (
					<div style={setReactionCounterStyle()}>
						{reactions.map((reaction) => reaction.node)}
						{reactions.length > 1 && reactions.length}
					</div>
				)}
				{hover ? (
					// Actions Container
					<div
						style={{
							display: "flex",
							flexDirection: `${isCurrentUser ? "row-reverse" : "row"}`,
						}}
					>
						<div style={setActionsContainerStyle()}>
							<ReplyRoundedIcon
								className={styles.reply}
								onClick={() => setIsReplying(!isReplying)}
								fontSize="small"
							/>
							{isPinned ? (
								<PushPinIcon
									className={styles.pin}
									onClick={() => setIsPinned(!isPinned)}
									fontSize="small"
								/>
							) : (
								<PushPinOutlinedIcon
									className={styles.pin}
									onClick={() => setIsPinned(!isPinned)}
									fontSize="small"
								/>
							)}
							<SentimentSatisfiedRoundedIcon
								onClick={() => setIsReacting(!isReacting)}
								className={styles.reaction}
								fontSize="small"
							/>
						</div>
						{/* Reaction Bar */}
						{isReacting && hover && (
							<ReactionBarSelector
								iconSize={12}
								style={{
									alignSelf: "center",
									marginLeft: `${isCurrentUser ? "0px" : "4px"}`,
									marginRight: `${isCurrentUser ? "4px" : "0"}`,
									marginBottom: "6px",
								}}
								onSelect={(reaction) => handleReactions(reaction)}
							/>
						)}
					</div>
				) : (
					// placeholder
					<div style={{ width: "72px" }}></div>
				)}
			</div>
		</div>
	);
}

export default ChatMessage;
