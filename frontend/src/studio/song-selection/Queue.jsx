import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./Queue.module.css";
import useGet from "../../hooks/useGet";
import { List } from "@mui/material";
import SongListItem from "./SongListItem";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Queue(props) {
	const { studio, socket } = props;
	const [playlistSongs, setPlaylistSongs] = useState([]);
	const navigate = useNavigate();

	const {
		data: playlist,
		isLoading: songsIsLoading,
		error: songsError,
	} = useGet(`/api/spotify/queue/${studio.studioPlaylist}`);

	// continously set the new songs added to the queue
	useEffect(() => {
		socket.on("receive_new_song", (data) => {
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
					const trackArtists = [];
					item.track.artists?.map((artist) => trackArtists.push(artist.name));
					setPlaylistSongs((playlistSongs) => [
						...playlistSongs,
						{
							id: item.track.id,
							name: item.track.name,
							artists: trackArtists,
							image: item.track.album.images[0].url,
							type: item.track.type,
						},
					]);
				});
			})
			.catch((error) => {
				console.log(error);
				navigate("/500");
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
			<div style={{ maxHeight: "100%", overflowY: "auto" }}>
				<label className={styles.queueGreyHeading}>Playlist:</label>
				{playlistSongs?.length > 0 && (
					<List className={styles.listContainer}>
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
