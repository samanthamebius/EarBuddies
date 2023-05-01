import React from "react";
import styles from "./StudioPage.module.css";
import SearchBarSong from "./SearchBarSong";

export default function SongSelection() {
	return (
		<div className={styles.songselection}>
			<SongSearch />
			<Queue />
		</div>
	);
}

function SongSearch() {
	return (
		<div>
			<label className={styles.songGreyHeading}>What's Next?</label>
			<SearchBarSong ></SearchBarSong>
		</div>
	);
}

function Queue() {
	return (
		<div>
			<label className={styles.queueGreyHeading}>Coming Up:</label>
		</div>
	);
}
