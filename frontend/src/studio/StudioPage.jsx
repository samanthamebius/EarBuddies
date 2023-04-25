import React from "react";
import { useParams } from "react-router-dom";

import styles from "./StudioPage.module.css";

import Banner from "./Banner";
import Chat from "./chat/Chat";
import NowPlaying from "./NowPlaying";
import SongSelection from "./SongSelection";

function StudioPage({ socket }) {
	const { id } = useParams();
	return (
		<div className={styles.studio}>
			<Banner id={id}/>
			<NowPlaying />
			<SongSelection />
			<Chat socket={socket} />
		</div>
	);
}

export default StudioPage;
