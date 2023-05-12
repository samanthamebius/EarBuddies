import React, { useContext, useEffect, useState } from 'react';

import axios from 'axios';
import SentimentSatisfiedRoundedIcon from '@mui/icons-material/SentimentSatisfiedRounded';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';
import PushPinIcon from '@mui/icons-material/PushPin';
import { ReactionBarSelector } from '@charkour/react-reactions';
import { v4 as uuid } from 'uuid';

import styles from './ChatMessage.module.css';
import messageDecoration1 from '../../assets/chat/messageDecoration1.svg';
import messageDecoration2 from '../../assets/chat/messageDecoration2.svg';
import { AppContext } from '../../AppContextProvider';

const defaultReactions = [
	{ label: 'angry', reaction: '😡' },
	{ label: 'satisfaction', reaction: '👍' },
	{ label: 'happy', reaction: '😆' },
	{ label: 'surprise', reaction: '😮' },
	{ label: 'sad', reaction: '😢' },
	{ label: 'love', reaction: '❤️' },
];

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Component for displaying a single chat message
 * @param newMessage - The message to be displayed
 * @param setReplyMessage - Function to set the reply message
 * @param replyMessage - The message for the reply (if there is one)
 * @param room - The id of the current studio
 * @param socket - Communication channel between client and server
 * @param pinnedMessages - The pinned messages for the chat
 * @param inputRef - Ref for focusing the the text field when replying to a message
 * @returns
 */
function ChatMessage(props) {
	const {
		newMessage,
		setReplyMessage,
		replyMessage,
		room,
		socket,
		pinnedMessages,
		inputRef,
	} = props;
	const {
		message,
		isReply: isPastReply,
		username: messageUsername,
		displayName: messageDisplayName,
		id: currentMessageId,
		reactions: currentChatReactions,
	} = newMessage;
	const [isReacting, setIsReacting] = useState(false);
	const [reactions, setReactions] = useState([]);
	const [hover, setHover] = useState(false);
	const { username, displayName } = useContext(AppContext);

	const isCurrentUser = username === messageUsername;

	// Styling for chat message
	const setChatMessageStyle = () => {
		const message = {
			display: 'flex',
			flexDirection: 'column',
			alignItems: `${isCurrentUser ? 'flex-end' : 'flex-start'}`,
			marginBottom: '16px',
			maxWidth: '100%',
		};

		return message;
	};

	// Styling for message body
	const setMessageBodyStyle = () => {
		const message = {
			backgroundColor: `${isCurrentUser ? '#E640F8' : '#B03EEE'}`,
			padding: '12px',
			borderRadius: '16px',
			overflowWrap: 'anywhere',
			textAlign: 'left',
			position: 'relative',
		};

		return message;
	};

	// Styling for chat reactions container
	const setActionsContainerStyle = () => {
		const container = {
			display: 'flex',
			alignItems: 'center',
			flexDirection: `${isCurrentUser ? 'row-reverse' : 'row'}`,
			marginRight: `${isCurrentUser ? '8px' : '0'}`,
			marginLeft: `${isCurrentUser ? '0' : '8px'}`,
			marginBottom: '5px',
			gap: '2px',
		};

		return container;
	};

	// send the pinned message to the socket
	const handlePinMessage = async () => {
		socket.emit('send_pinned_message', {
			newMessage,
			room,
			pinnedMessages,
		});

		const messageExists = pinnedMessages.find(
			(message) => message.id === newMessage.id
		);

		if (!messageExists) {
			await axios.put(`http://localhost:3000/api/chat/pinned-messages/${room}`, {
				id: newMessage.id,
				message: newMessage.message,
				username: newMessage.username,
				displayName: newMessage.displayName,
			});
		}
	};

	// set the reply message
	const handleMessageReply = () => {
		setReplyMessage(
			`Replying to ${isCurrentUser ? 'yourself' : messageDisplayName}: ${message}`
		);
		inputRef.current.focus();
	};

	// send the chat reactions
	const handleReactions = async (selectedReaction) => {
		const reactionId = uuid();
		socket.emit('send_message_reaction', {
			room,
			reactionId: reactionId,
			messageId: currentMessageId,
			username,
			displayName,
			selectedReaction,
			reactions,
		});
		const reaction = {
			id: reactionId,
			label: selectedReaction,
			username: username,
			displayName: displayName,
		};
		axios.put(`${BASE_URL}/api/chat/new-reaction/${room}`, {
			messageId: currentMessageId,
			reaction,
		});
	};

	// get the reactions from the socket
	useEffect(() => {
		socket.on('receive_message_reaction', (data) => {
			const {
				reactionId,
				selectedReaction,
				username: reactionUsername,
				displayName: reactionDisplayName,
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
					(reaction) => reaction.username === reactionUsername
				);

				if (reactionExists) {
					// update the reaction
					const currentReactionIndex = messageReactions.findIndex(
						(reaction) => reaction.username === reactionUsername
					);
					const updatedReaction = {
						...messageReactions[currentReactionIndex],
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
							id: reactionId,
							label: selectedReaction,
							node: reactionIcon.reaction,
							username: reactionUsername,
							displayName: reactionDisplayName,
						},
					]);
				}
			}
		});
	}, [socket]);

	// set past message reactions
	useEffect(() => {
		if (currentChatReactions?.length > 0) {
			currentChatReactions.map((currentReaction) => {
				const reactionIcon = defaultReactions.find(
					(reaction) => reaction.label === currentReaction.label
				);
				setReactions((reactions) => [
					...reactions,
					{
						id: currentReaction.id,
						label: currentReaction.label,
						node: reactionIcon.reaction,
						username: currentReaction.username,
						displayName: currentReaction.displayName,
					},
				]);
			});
		}
	}, []);

	return (
		<>
			{messageUsername === 'chat_bot' ? (
				// message styles for a chat bot
				<div className={styles.chatBotMessage}>{message}</div>
			) : (
				// message styles for a normal user
				<div
					style={setChatMessageStyle()}
					onMouseOver={() => setHover(true)}
					onMouseOut={() => setHover(false)}>
					<h4 className={styles.username}>{messageDisplayName}</h4>
					{/* Message Reply */}
					{(replyMessage || isPastReply) && (
						<div className={styles.messageReply}>
							<p className={styles.messageReplyContent}>{replyMessage}</p>
						</div>
					)}
					<div
						style={{
							display: 'flex',
							flexDirection: `${isCurrentUser ? 'row-reverse' : 'row'}`,
						}}>
						{/* Message */}
						<div
							style={{
								display: 'flex',
								maxWidth: '70%',
							}}>
							{/* Message Content */}
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									position: 'relative',
									width: '100%',
									alignItems: `${
										isCurrentUser ? 'flex-end' : 'flex-start'
									}`,
								}}>
								<div style={setMessageBodyStyle()}>
									<p className={styles.body}>{message}</p>
								</div>
								<img
									src={
										isCurrentUser
											? messageDecoration1
											: messageDecoration2
									}
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
								{reactions.length > 1 && (
									<div>&nbsp; {reactions.length}</div>
								)}
							</div>
						)}
						{hover ? (
							// Actions Container
							<div
								style={{
									display: 'flex',
									flexDirection: `${
										isCurrentUser ? 'row-reverse' : 'row'
									}`,
								}}>
								<div style={setActionsContainerStyle()}>
									<ReplyRoundedIcon
										className={styles.reply}
										onClick={() => handleMessageReply()}
										fontSize='small'
										style={{ color: 'var(--iconColor)' }}
									/>
									<PushPinIcon
										className={styles.pin}
										onClick={() => handlePinMessage()}
										fontSize='small'
										style={{ color: 'var(--iconColor)' }}
									/>
									<SentimentSatisfiedRoundedIcon
										onClick={() => setIsReacting(!isReacting)}
										className={styles.reaction}
										fontSize='small'
										style={{ color: 'var(--iconColor)' }}
									/>
								</div>
								{/* Reaction Bar */}
								{isReacting && hover && (
									<ReactionBarSelector
										iconSize={12}
										style={{
											alignSelf: 'center',
											marginLeft: `${
												isCurrentUser ? '0px' : '4px'
											}`,
											marginRight: `${isCurrentUser ? '4px' : '0'}`,
											marginBottom: '6px',
											background: 'var(--replyBackgroundColor)',
										}}
										onSelect={(reaction) => handleReactions(reaction)}
									/>
								)}
							</div>
						) : (
							// placeholder
							<div style={{ width: '72px' }}></div>
						)}
					</div>
				</div>
			)}
		</>
	);
}

export default ChatMessage;
