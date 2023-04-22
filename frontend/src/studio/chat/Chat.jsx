import React, { useState } from "react";
import styles from "./Chat.module.css";
import { useEffect } from "react";
import { TextField, styled } from "@mui/material";
import ChatMessage from "./ChatMessage";
import { useParams } from "react-router-dom";
import sendIcon from "../../assets/chat/sendIcon.svg";
import PinnedMessage from "./PinnedMessage";

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
	},
	width: "80%",
});

export default function Chat({ socket }) {
	const [messages, setMessages] = useState([]);
	const [message, setMessage] = useState("");
	const [pinnedMessages, setPinnedMessages] = useState([]);
	const [expandedPinnedMessages, setExpandedPinnedMessages] = useState(true);
	const [replyToMessage, setReplyToMessage] = useState("");
	const displayedPinnedMessages = expandedPinnedMessages
		? pinnedMessages
		: pinnedMessages.slice(0, 1);
	const { id } = useParams();
	const room = mockStudios.find((studio) => studio.id == id); // this will eventually correspond with real backend data
	const username = "test"; // this will be the username of the user from DB

	// styling for send icon
	const setSendIconStyling = () => {
		const image = {
			width: "16px",
			height: "14px",
			opacity: `${message !== "" ? "0.5" : "0.2"}`,
			padding: "12px 12px 0 0",
			margin: "0",
		};

		image.hover = {
			cursor: "pointer",
		};

		return image;
	};

	// continously set the live messages received
	useEffect(() => {
		socket.on("receive_message", (data) => {
			console.log(data);
			setMessages((message) => [
				...message,
				{
					message: data.message,
					username: data.username,
					messageReply: data?.replyToMessage,
				},
			]);
		});
	}, [socket]);

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
			// if there is a reply, attach onto the end
			socket.emit("send_message", { username, room, message, replyToMessage });
			setMessage("");
			setReplyToMessage("");
		}
	};

	return (
		<div className={styles.chat}>
			<div className={styles.chatContent}>
				<div
					style={{
						position: "sticky",
						top: "0",
						display: "flex",
						flexDirection: "column",
					}}
				>
					{displayedPinnedMessages.map((message, index) => (
						<PinnedMessage key={index} message={message} />
					))}
					{pinnedMessages.length > 1 && (
						<p
							className={styles.expandPinnedMessages}
							onClick={() => setExpandedPinnedMessages(!expandedPinnedMessages)}
						>
							{expandedPinnedMessages ? "show less" : "show more"}
						</p>
					)}
				</div>
				<div style={{ overflowY: "auto" }}>
					{messages.map((message, index) => (
						<ChatMessage
							key={index}
							newMessage={message}
							setPinnedMessages={setPinnedMessages}
							pinnedMessages={pinnedMessages}
							setReplyToMessage={setReplyToMessage}
							messageReply={message.messageReply}
						/>
					))}
				</div>
			</div>
			<div className={styles.chatInput}>
				<div
					style={{
						width: "80%",
						display: "flex",
						flexDirection: "column",
						alignItems: "flex-start",
						padding: "10px 0 0 12px",
					}}
				>
					<div
						style={{
							textAlign: "unset",
							margin: 0,
							color: "#79797980",
							fontSize: "14px",
						}}
					>
						{replyToMessage}
					</div>
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
				<img
					src={sendIcon}
					alt="send"
					onClick={() => handleSendMessage()}
					style={setSendIconStyling()}
				/>
			</div>
		</div>
	);
}
