import React from "react";
import styles from "./StudioPage.module.css";
import SearchBarSong from "./SearchBarSong";

export default function SongSelection({studio}) {
	return (
		<div className={styles.songselection}>
			<SongSearch studio={studio}/>
			<Queue studio={studio}/>
		</div>
	);
}

function SongSearch({studio}) {
	return (
		<div>
			<label className={styles.songGreyHeading}>What's Next?</label>
			<SearchBarSong studio={studio}></SearchBarSong>
		</div>
	);
}

function Queue({studio}) {
	return (
		<div>
			<label className={styles.queueGreyHeading}>Coming Up:</label>
		</div>
	);
}
