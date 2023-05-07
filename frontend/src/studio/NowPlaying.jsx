import React, { useState } from "react";
import styles from "./StudioPage.module.css";
import WebPlayback from "./WebPlayback";

export default function NowPlaying({ studio, socket }) {
	const accessToken = localStorage.getItem("access_token");
	return (
		<div className={styles.nowplaying}>
			{/* <SongInfo/>
      <ControlPanel/> */}
			<WebPlayback
				studio={studio}
				token={accessToken.replace(/['"]+/g, "")}
				socket={socket}
			/>
		</div>
	);
}
