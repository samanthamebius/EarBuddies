import React from "react";
import { useParams } from "react-router-dom";

import styles from "./StudioPage.module.css";

import Banner from "./Banner";
import Chat from "./chat/Chat";
import NowPlaying from "./NowPlaying";
import SongSelection from "./SongSelection";
import useGet from "../hooks/useGet";

function StudioPage({ socket }) {
	const { id } = useParams();
	const { data: studio, isLoading: studioIsLoading } = useGet(`/api/studio/${id}`);
	if (studioIsLoading) {
		return <p>Loading...</p>;
	} else if (!studio) {
		return <p>Could not load studio</p>;
	} else {
		return (
			<div className={styles.studio}>
				<Banner id={id} studio={studio[0]}/>
				<NowPlaying />
				<SongSelection />
				<Chat socket={socket} />
			</div>
		);
	}
	
}

export default StudioPage;
