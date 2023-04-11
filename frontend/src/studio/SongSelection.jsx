import React from "react";
import styles from "./StudioPage.module.css";
import SearchBar from "../shared/SearchBar";

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
			<SearchBar label={"Search Spotify"}></SearchBar>
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
