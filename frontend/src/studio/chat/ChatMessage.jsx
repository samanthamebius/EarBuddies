import React, { useContext, useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import styles from "./ChatMessage.module.css";
import messageDecoration1 from "../../assets/chat/messageDecoration1.svg";
import messageDecoration2 from "../../assets/chat/messageDecoration2.svg";
import { ReactionBarSelector } from "@charkour/react-reactions";
import SentimentSatisfiedRoundedIcon from "@mui/icons-material/SentimentSatisfiedRounded";
import ReplyRoundedIcon from "@mui/icons-material/ReplyRounded";
import PushPinIcon from "@mui/icons-material/PushPin";
import { AppContext } from "../../AppContextProvider";
import axios from "axios";

const defaultReactions = [
	{ label: "angry", reaction: "😡" },
	{ label: "satisfaction", reaction: "👍" },
	{ label: "happy", reaction: "😆" },
	{ label: "surprise", reaction: "😮" },
	{ label: "sad", reaction: "😢" },
	{ label: "love", reaction: "❤️" },
];

function ChatMessage(props) {
	const {
		newMessage,
		setReplyMessage,
		replyMessage,
		room,
		socket,
		pinnedMessages,
	} = props;
	const {
		message,
		isReply: isPastReply,
		messageReply: messageReplyHistory,
		username: messageUsername,
		displayName: messageDisplayName,
		id: currentMessageId,
	} = newMessage;
	const [isReacting, setIsReacting] = useState(false);
	const [reactions, setReactions] = useState([]);
	const [hover, setHover] = useState(false);

	const { username, displayName } = useContext(AppContext);
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

	const setReplyMessageStyle = () => {
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

	// send the pinned message to the socket
	const handlePinMessage = async () => {
		socket.emit("send_pinned_message", {
			newMessage,
			room,
			pinnedMessages,
		});
		await axios.put(
			`http://localhost:3000/api/chat/pinned-messages/${room.id}`,
			{
				id: newMessage.id,
				message: newMessage.message,
				username: newMessage.username,
				displayName: newMessage.displayName,
			}
		);
	};

	// set the reply message
	const handleMessageReply = () => {
		console.log("reply");
		setReplyMessage(
			`Replying to ${
				isCurrentUser ? "yourself" : messageDisplayName
			}: ${message}`
		);
	};

	// send the chat reactions
	const handleReactions = (selectedReaction) => {
		socket.emit("send_message_reaction", {
			room,
			reactionId: uuid(),
			messageId: currentMessageId,
			username,
			displayName,
			selectedReaction,
			reactions,
		});
	};

	// get the reactions from the socket
	useEffect(() => {
		socket.on("receive_message_reaction", (data) => {
			const {
				reactionId,
				selectedReaction,
				username: reactionUsername,
				reactions: messageReactions,
				messageId,
			} = data;

			if (messageId === currentMessageId) {
				// set the reaction icon
				const reactionIcon = defaultReactions.find(
					(reaction) => reaction.label === data.selectedReaction
				);

				// check if the user has already reacted
				const reactionExists = messageReactions.find(
					(reaction) => reaction.by === reactionUsername
				);

				if (reactionExists) {
					// update the reaction
					const currentReactionIndex = messageReactions.findIndex(
						(reaction) => reaction.by === reactionUsername
					);
					const updatedReaction = {
						...messageReactions[currentReactionIndex],
						id: reactionId,
						label: selectedReaction,
						node: reactionIcon.reaction,
					};
					const newReactions = [
						...messageReactions.slice(0, currentReactionIndex),
						updatedReaction,
						...messageReactions.slice(currentReactionIndex + 1),
					];
					setReactions(() => newReactions);
				} else {
					// add a new reaction
					setReactions((reactions) => [
						...reactions,
						{
							label: selectedReaction,
							node: reactionIcon.reaction,
							by: reactionUsername,
							id: reactionId,
						},
					]);
				}
			}
		});
	}, [socket]);

	console.log(replyMessage);

	return (
		<div
			style={setChatMessageStyle()}
			onMouseOver={() => setHover(true)}
			onMouseOut={() => setHover(false)}
		>
			<h4 className={styles.username}>{messageDisplayName}</h4>
			{/* Message Reply */}
			{(replyMessage || isPastReply) && (
				<div style={setReplyMessageStyle()}>
					<p className={styles.messageReplyContent}>{replyMessage}</p>
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
					<div className={styles.reactionCounter}>
						{reactions.map((reaction) => (
							<div key={reaction.id}>{reaction.node}</div>
						))}
						{reactions.length > 1 && <div>&nbsp; {reactions.length}</div>}
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
								onClick={() => handleMessageReply()}
								fontSize="small"
							/>
							<PushPinIcon
								className={styles.pin}
								onClick={() => handlePinMessage()}
								fontSize="small"
							/>
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
