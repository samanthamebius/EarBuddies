import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import styles from "./StudioPage.module.css";

import Banner from "./Banner";
import Chat from "./chat/Chat";
import WebPlayback from "./WebPlayback";
import SongSelection from "./song-selection/SongSelection";
import useGet from "../hooks/useGet";
import axios from "axios";

function StudioPage({ socket }) {
	const accessToken = localStorage.getItem("access_token");
	const { id } = useParams();
	const navigate = useNavigate();
	const [queueIsEmpty, setQueueIsEmpty] = useState(true);

	const {
		data: studio,
		isLoading: studioIsLoading,
		error: studioError,
	} = useGet(`/api/studio/${id}`);

	useEffect(() => {
		socket.connect("http://localhost:3000");
		socket.emit("join_room", { id });
		// create the chat in the DB if it doesn't already exist
		axios.post(`http://localhost:3000/api/chat/${id}`);
	}, []);

	if (studioError) {
		navigate("/404");
		return;
	}
	if (studioIsLoading) {
		return <p>Loading...</p>;
	} else if (!studio) {
		return <p>Could not load studio</p>;
	} else {
		return (
			<div className={styles.studio}>
				<Banner id={id} studio={studio[0]} socket={socket} />
				<div className={styles.webPlayback}>
				<WebPlayback studio={studio} token={accessToken.replace(/['"]+/g, '')} queueIsEmpty={queueIsEmpty}/>
				</div>
				<SongSelection studio={studio[0]} socket={socket} setQueueIsEmpty={setQueueIsEmpty}/>
				<Chat socket={socket} />
			</div>
		);
	}
}

export default StudioPage;
