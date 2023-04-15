import React, { useState } from "react";
import styles from "./Chat.module.css";
import { useEffect } from "react";
import { TextField, styled } from "@mui/material";
import ChatMessage from "./ChatMessage";
import { useParams } from "react-router-dom";
import sendIcon from "../../assets/chat/sendIcon.svg";

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
		padding: "10px 0 0 12px",
	},
	width: "80%",
});

export default function Chat({ socket }) {
	const [messages, setMessages] = useState([]);
	const [message, setMessage] = useState("");
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
			socket.emit("send_message", { username, room, message });
			setMessage("");
		}
	};

	return (
		<div className={styles.chat}>
			<div className={styles.chatContent}>
				{messages.map((message, index) => (
					<ChatMessage key={index} newMessage={message} />
				))}
			</div>
			<div className={styles.chatInput}>
				<StyledTextField
					variant="standard"
					multiline
					maxRows={4}
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
