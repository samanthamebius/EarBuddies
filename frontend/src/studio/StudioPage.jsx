import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import styles from "./StudioPage.module.css";

import Banner from "./Banner";
import Chat from "./chat/Chat";
import NowPlaying from "./NowPlaying";
import SongSelection from "./SongSelection";
import useGet from "../hooks/useGet";
import axios from "axios";

function StudioPage({ socket }) {
	const { id } = useParams();
	const navigate = useNavigate();
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
		localStorage.removeItem("access_token");
		localStorage.removeItem("refresh_token");
		localStorage.removeItem("expires_in");
		localStorage.removeItem("current_user_id");
		navigate("/login");
		return <p>Could not load studio</p>;
	}
	if (studioIsLoading) {
		return <p>Loading...</p>;
	} else if (!studio) {
		return <p>Could not load studio</p>;
	} else {
		return (
			<div className={styles.studio}>
				<Banner id={id} studio={studio[0]} socket={socket} />
				<NowPlaying />
				<SongSelection studio={studio[0]} socket={socket} />
				<Chat socket={socket} />
			</div>
		);
	}
}

export default StudioPage;
