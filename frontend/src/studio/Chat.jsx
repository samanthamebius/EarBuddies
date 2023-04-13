import React, { useState } from "react";
import styles from "./StudioPage.module.css";
import { useEffect } from "react";

export default function Chat({ socket }) {
	const [messages, setMessages] = useState([]);

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

	// another use effect to set previous messages that is run once

	return (
		<div className={styles.chat}>
			{messages.map((message) => (
				<div>
					<h4>{message.username}</h4>
					<p>{message.message}</p>
				</div>
			))}
		</div>
	);
}
