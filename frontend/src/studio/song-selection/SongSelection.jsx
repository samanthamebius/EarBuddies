import React from "react";
import { useState } from "react";
import styles from "../StudioPage.module.css";
import SearchBar from "../../shared/SearchBar";
import { List } from "@mui/material";
import Queue from "./Queue";
import SongListItem from "./SongListItem";

export default function SongSelection({ studio, socket, setQueueIsEmpty }) {
	const [songSearchResults, setSongSearchResults] = useState([]);
	const isHost =
		studio.studioHost ===
		localStorage.getItem('current_user_id').replace(/"/g, '');

	return (
		<div className={styles.songselection}>
			{isHost && (
				<SearchBar
					searchType={'songs'}
					label={'Search Spotify...'}
					studioId={''}
					setResults={setSongSearchResults}
					studio={studio}
					onInputChange={() => {}}
					playlist_id={studio.studioPlaylist}
				/>
			)}
			{songSearchResults.length > 0 ? (
				<List className={styles.searchResults}>
					{songSearchResults.map((result) => (
						<SongListItem
							setResults={setSongSearchResults}
							key={result.id}
							song={result}
							socket={socket}
							studio={studio}
							type="search"
						/>
					))}
				</List>
			) : null}
			<Queue
				studio={studio}
				socket={socket}
				setQueueIsEmpty={setQueueIsEmpty}
			/>
		</div>
	);
}
