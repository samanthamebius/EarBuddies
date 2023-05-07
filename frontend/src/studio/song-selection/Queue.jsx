import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "../StudioPage.module.css";
import list_styles from "./Queue.module.css";
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

	// continously set the new songs added to the queue
	useEffect(() => {
		socket.on("receive_send_new_song", (data) => {
			console.log(data.newSong);
			setPlaylistSongs((playlistSongs) => [...playlistSongs, data.newSong]);
		});
	}, [socket]);

	// remove the song from the queue
	useEffect(() => {
		socket.on("receive_remove_from_studio_queue", (data) => {
			setPlaylistSongs(
				playlistSongs.filter((songs) => songs.id !== data.songId)
			);
		});
	});

	// set the initial playlist
	useEffect(() => {
		axios
			.get(`${BASE_URL}/api/spotify/queue/${studio.studioPlaylist}`)
			.then((response) => {
				response.data?.tracks.items.map((item) => {
					setPlaylistSongs((playlistSongs) => [
						...playlistSongs,
						{
							id: item.track.id,
							name: item.track.name,
							artists: item.track.artists,
							image: item.track.album.images[0].url,
						},
					]);
				});
			});
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
			<div style={{ overflowY: "hidden" }}>
				<label className={styles.queueGreyHeading}>Coming Up:</label>
				{playlistSongs?.length > 0 && (
					<List className={list_styles.listContainer}>
						{playlistSongs.map((result) => (
							<SongListItem
								key={result.id}
								song={result}
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
