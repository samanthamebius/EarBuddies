import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "../StudioPage.module.css";
import list_styles from "../../shared/SearchBar.module.css";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import useGet from "../../hooks/useGet";
import {
	Avatar,
	Button,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
} from "@mui/material";
import SongListItem from "./SongListItem";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Queue(props) {
	const { studio, socket } = props;
	const [playlistSongs, setPlaylistSongs] = useState([]);

	const {
		data: playlist,
		isLoading: songsIsLoading,
		error: songsError,
	} = useGet(`/api/spotify/queue/${studio.studioPlaylist}`);

	// reload the studio queue when a new song is added
	useEffect(() => {
		socket.on("receive_reload_studio_queue", () => {
			axios
				.get(`${BASE_URL}/api/spotify/queue/${studio.studioPlaylist}`)
				.then((response) => setPlaylistSongs(response.data.tracks.items));
		});
	}, [socket]);

	// set the initial playlist
	useEffect(() => {
		axios
			.get(`${BASE_URL}/api/spotify/queue/${studio.studioPlaylist}`)
			.then((response) => setPlaylistSongs(response.data.tracks.items));
	}, []);

	if (songsError) {
		return <p>Could not load songs</p>;
	}
	if (songsIsLoading) {
		return <p>Loading...</p>;
	} else if (!playlist) {
		return <p>Could not load songs</p>;
	} else {
		const snapshot_id = playlist.snapshot_id;
		return (
			<div>
				<label className={styles.queueGreyHeading}>Coming Up:</label>
				{playlistSongs?.length > 0 && (
					<List className={list_styles.listContainer}>
						{playlistSongs.map((result) => (
							<SongListItem
								key={result.track.id}
								result={result}
								socket={socket}
								studio={studio}
								type="queue"
								snapshotId={snapshot_id}
							/>
						))}
					</List>
				)}
			</div>
		);
	}
}

export default Queue;
