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
import axios from "axios";

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
	const [messageReply, setMessageReply] = useState("");
	const displayedPinnedMessages = expandedPinnedMessages
		? pinnedMessages
		: pinnedMessages.slice(0, 1);
	const { username, displayName } = useContext(AppContext);
	const { id } = useParams();
	const room = mockStudios.find((studio) => studio.id == id); // this will eventually correspond with real backend data

	// Set previous messages
	// useEffect(() => {
	// 	axios
	// 		.get(`http://localhost:3000/api/chat/all-messages/${id}`)
	// 		.then((response) => {
	// 			response.data.messages.length > 0 &&
	// 				setMessages(response.data.messages);
	// 		});
	// }, []);

	// continously set the live messages received
	useEffect(() => {
		socket.on("receive_message", (data) => {
			console.log(data);
			setMessages((messages) => [
				...messages,
				{
					id: data.id,
					username: data.username,
					displayName: data.displayName,
					message: data.message,
					isReply: data.isReply,
					messageReply: data?.messageReply,
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
						id: newMessage.id,
						message: newMessage.message,
						username: newMessage.username,
						displayName: newMessage.displayName,
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
			socket.emit("leave_room", { displayName, room });
		};
	}, []);

	// send the message
	const handleSendMessage = async () => {
		const isReply = messageReply !== "";
		const messageId = uuid();
		if (message !== "") {
			socket.emit("send_message", {
				room,
				id: messageId,
				username,
				displayName,
				message,
				isReply,
				messageReply,
			});
			await axios.put(`http://localhost:3000/api/chat/new-message/${id}`, {
				id: messageId,
				username: username,
				displayName: displayName,
				message: message,
				isReply: isReply,
				messageReply: messageReply,
			});
			setMessage("");
			setMessageReply("");
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
							setMessageReply={setMessageReply}
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
					{messageReply !== "" && (
						<div className={styles.messageReply}>
							<div>{messageReply}</div>
							<CloseRoundedIcon
								fontSize="small"
								className={styles.dismissReply}
								onClick={() => setMessageReply("")}
							/>
						</div>
					)}
					<StyledTextField
						variant="standard"
						multiline
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
						padding: `${messageReply !== "" ? "14px" : "12px"} 10px 0 0`,
						margin: "0",
						cursor: "pointer",
						position: "sticky",
						top: "0",
					}}
					fontSize="small"
				/>
			</div>
		</div>
	);
}
