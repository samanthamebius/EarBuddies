import React from "react";

import styles from "./StudioPage.module.css";

import Banner from "./Banner";
import Chat from "./Chat";
import NowPlaying from "./NowPlaying";
import SongSelection from "./SongSelection";

function StudioPage({ socket }) {
	return (
		<div className={styles.studio}>
			<Banner />
			<NowPlaying />
			<SongSelection />
			<Chat socket={socket} />
		</div>
	);
}

export default StudioPage;
