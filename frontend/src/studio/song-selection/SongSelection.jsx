import React from "react";
import { useState } from "react";
import styles from "../StudioPage.module.css";
import SearchBar from "../../shared/SearchBar";
import { List } from "@mui/material";
import Queue from "./Queue";
import SongListItem from "./SongListItem";

export default function SongSelection({ studio, socket, setQueueIsEmpty }) {
	const [songSearchResults, setSongSearchResults] = useState([]);

	return (
		<div className={styles.songselection}>
			<SearchBar
				searchType={"songs"}
				label={"Search Spotify..."}
				studioId={""}
				setResults={setSongSearchResults}
				studio={studio}
			/>
			{songSearchResults.length > 0 ? (
				<List className={styles.searchResults}>
					{songSearchResults.map((result) => (
						<SongListItem
							key={result.id}
							result={result}
							socket={socket}
							studio={studio}
							type="search"
						/>
					))}
				</List>
			) : null}
			{/* <Queue studio={studio} socket={socket} setQueueIsEmpty={setQueueIsEmpty}/> */}
		</div>
	);
}
