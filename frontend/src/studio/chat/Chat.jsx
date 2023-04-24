import React, { useContext, useState } from "react";
import { v4 as uuid } from "uuid";
import styles from "./Chat.module.css";
import { useEffect } from "react";
import { TextField, styled } from "@mui/material";
import ChatMessage from "./ChatMessage";
import { useParams } from "react-router-dom";
import PinnedMessage from "./PinnedMessage";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { AppContext } from "../../AppContextProvider";

const mockStudios = [
	{
		id: 1,
		studioName: `smeb's studio`,
		studioIsActive: true,
		studioGenres: ["rock", "pop", "jazz"],
	},
	{
		id: 2,
		studioName: `smeb's studio`,
		studioIsActive: true,
		studioGenres: ["rock", "pop", "jazz"],
	},
	{
		id: 3,
		studioName: `smeb's studio`,
		studioIsActive: false,
		studioGenres: ["rock", "pop", "jazz"],
	},
	{
		id: 4,
		studioName: `smeb's studio`,
		studioIsActive: false,
		studioGenres: ["rock", "pop", "jazz"],
	},
];

const StyledTextField = styled(TextField)({
	"& .MuiInputBase-root": {
		padding: "0",
		fontSize: "15px",
	},
	width: "100%",
});

export default function Chat(props) {
	const { socket } = props;
	const [messages, setMessages] = useState([]);
	const [message, setMessage] = useState("");
	const [pinnedMessages, setPinnedMessages] = useState([]);
	const [expandedPinnedMessages, setExpandedPinnedMessages] = useState(true);
	const [replyToMessage, setReplyToMessage] = useState("");
	const displayedPinnedMessages = expandedPinnedMessages
		? pinnedMessages
		: pinnedMessages.slice(0, 1);
	const { username, spotifyUsername } = useContext(AppContext);
	const { id } = useParams();
	const room = mockStudios.find((studio) => studio.id == id); // this will eventually correspond with real backend data

	// continously set the live messages received
	useEffect(() => {
		socket.on("receive_message", (data) => {
			setMessages((messages) => [
				...messages,
				{
					message: data.message,
					username: data.username,
					messageReply: data?.replyToMessage,
					spotifyUsername: data.spotifyUsername,
					id: data.id,
				},
			]);
		});
	}, [socket]);

	// continously set the pinned messages received
	useEffect(() => {
		socket.on("receive_pinned_message", (data) => {
			const { newMessage, pinnedMessages } = data;

			const messageExists = pinnedMessages.find(
				(message) => message.id === newMessage.id
			);

			if (!messageExists) {
				setPinnedMessages((pinnedMessages) => [
					...pinnedMessages,
					{
						message: newMessage.message,
						username: newMessage.username,
						spotifyUsername: newMessage.spotifyUsername,
						id: newMessage.id,
					},
				]);
			}
		});
	}, [socket]);

	// remove pinned messages
	useEffect(() => {
		socket.on("receive_remove_pinned_message", (data) => {
			setPinnedMessages(() =>
				pinnedMessages.filter((message) => message.id !== data.newMessage.id)
			);
		});
	});

	// user leaves the room when they navigate away
	useEffect(() => {
		return () => {
			socket.emit("leave_room", { username, room });
		};
	}, []);

	// TODO: Set previous messages that is run once

	// send the message
	const handleSendMessage = () => {
		if (message !== "") {
			socket.emit("send_message", {
				username,
				room,
				message,
				replyToMessage,
				spotifyUsername,
				id: uuid(),
			});
			setMessage("");
			setReplyToMessage("");
		}
	};

	return (
		<div className={styles.chat}>
			<div className={styles.chatContent}>
				<div className={styles.pinnedMessages}>
					{displayedPinnedMessages.map((message, index) => (
						<PinnedMessage
							key={index}
							pinnedMessage={message}
							room={room}
							socket={socket}
						/>
					))}
					{pinnedMessages.length > 1 && (
						<div
							className={styles.expandPinnedMessages}
							onClick={() => setExpandedPinnedMessages(!expandedPinnedMessages)}
						>
							{expandedPinnedMessages ? (
								<div className={styles.expandMessagesContent}>
									show less <ExpandLessRoundedIcon />
								</div>
							) : (
								<div className={styles.expandMessagesContent}>
									show more <ExpandMoreRoundedIcon />
								</div>
							)}
						</div>
					)}
				</div>
				<div className={styles.messagesContainer}>
					{messages.map((message, index) => (
						<ChatMessage
							key={index}
							newMessage={message}
							setReplyToMessage={setReplyToMessage}
							messageReply={message.messageReply}
							room={room}
							socket={socket}
							pinnedMessages={pinnedMessages}
						/>
					))}
				</div>
			</div>
			<div className={styles.chatInput}>
				<div className={styles.inputContent}>
					{replyToMessage !== "" && (
						<div className={styles.messageReply}>
							<div>{replyToMessage}</div>
							<CloseRoundedIcon
								fontSize="small"
								className={styles.dismissReply}
								onClick={() => setReplyToMessage("")}
							/>
						</div>
					)}
					<StyledTextField
						variant="standard"
						multiline
						maxRows={replyToMessage === null ? 4 : 3}
						placeholder="Message ..."
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						onKeyDown={(event) => {
							if (event.key === "Enter") {
								event.preventDefault();
								handleSendMessage();
							}
						}}
						InputProps={{ disableUnderline: true, style: { color: "#797979" } }}
					/>
				</div>
				<SendRoundedIcon
					onClick={() => handleSendMessage()}
					style={{
						opacity: `${message !== "" ? "0.5" : "0.2"}`,
						padding: "10px 10px 0 0",
						margin: "0",
						cursor: "pointer",
					}}
					fontSize="small"
				/>
			</div>
		</div>
	);
}
