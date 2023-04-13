import React, { useState } from "react";
import styles from "./Chat.module.css";
import { useEffect } from "react";
import { Box, Button, Input, TextField } from "@mui/material";
import ChatMessage from "./ChatMessage";

export default function Chat({ socket }) {
	const [messages, setMessages] = useState([]);
	const [message, setMessage] = useState("");
	const room = "testRoomId"; // will be the id of the studio
	const username = "test";

	// continously set the live messages received
	useEffect(() => {
		socket.on("receive_message", (data) => {
			console.log(data);
			setMessages((message) => [
				...message,
				{
					message: data.message,
					username: data.username,
					__createdtime__: data.__createdtime__,
				},
			]);
		});

		// remove the listener when the component unmounts
		return () => socket.off("receive_message");
	}, [socket]);

	// Set previous messages that is run once

	// send the message
	const handleSendMessage = () => {
		if (message !== "") {
			const __createdtime = Date.now();
			socket.emit("send_message", { username, room, message, __createdtime });
			setMessage("");
		}
	};

	return (
		<div className={styles.chat}>
			<div className={styles.chatContent}>
				{messages.map((message) => (
					<ChatMessage newMessage={message} />
				))}
			</div>
			<div className={styles.chatInput}>
				<Box
					component="form"
					noValidate
					autoComplete="off"
					sx={{
						"& > :not(style)": { m: 1, width: "25ch" },
					}}
				>
					<TextField
						variant="outlined"
						placeholder="Message ..."
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						onKeyDown={(event) => {
							if (event.key === "Enter") {
								event.preventDefault();
								handleSendMessage();
							}
						}}
					/>
					<Button variant="contained" onClick={() => handleSendMessage()}>
						Send
					</Button>
				</Box>
			</div>
		</div>
	);
}
