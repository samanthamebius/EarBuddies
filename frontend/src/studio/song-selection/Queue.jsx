import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "../StudioPage.module.css";
import list_styles from "../../shared/SearchBar.module.css";

import useGet from "../../hooks/useGet";
import { List, ListItemText } from "@mui/material";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Queue(props) {
	const { studio, setPlaylistSongs, playlistSongs, socket } = props;
	const [anchorEl, setAnchorEl] = useState(null);
	const [selectedIndex, setSelectedIndex] = useState(null);

	const handleOpenMenu = (event, index) => {
		setAnchorEl(event.currentTarget);
		setSelectedIndex(index);
	};

	const handleCloseMenu = () => {
		setAnchorEl(null);
		setSelectedIndex(null);
	};

	const handlePlay = (result) => {
		//TODO: play func
		handleCloseMenu();
	};

	const handleRemove = (result, snapshot_id) => {
		const playlist_id = studio.studioPlaylist;
		const track_id = result.track.id;
		axios.delete(`${BASE_URL}/api/spotify/queue/${playlist_id}/${track_id}`),
			{ snapshot_id: snapshot_id };

		// reload the playlist after deleting
		socket.emit("reload_studio_queue", { room: studio._id });
		handleCloseMenu();
	};

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

	console.log(playlistSongs);

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
							// <ListItem
							// 	key={result.track.id}
							// 	secondaryAction={
							// 		<Button
							// 			edge="end"
							// 			aria-label="more options"
							// 			onClick={(event) => handleOpenMenu(event, result)}
							// 		>
							// 			<MoreHorizIcon />
							// 		</Button>
							// 	}
							// >
							// 	<StyledMenu
							// 		anchorEl={anchorEl}
							// 		open={Boolean(anchorEl)}
							// 		onClose={handleCloseMenu}
							// 	>
							// 		<MenuItem onClick={() => handlePlay(selectedIndex)}>
							// 			Play
							// 		</MenuItem>
							// 		<MenuItem
							// 			onClick={() => handleRemove(selectedIndex, snapshot_id)}
							// 		>
							// 			Remove from queue
							// 		</MenuItem>
							// 	</StyledMenu>
							// 	<ListItemAvatar>
							// 		<Avatar>
							// 			<img
							// 				className={list_styles.image}
							// 				src={result.track.album.images[0].url}
							// 			/>
							// 		</Avatar>
							// 	</ListItemAvatar>
							// 	<ListItemText primary={displayText(result.track)} />
							// </ListItem>
							<ListItemText primary={displayText(result.track)} />
						))}
					</List>
				)}
			</div>
		);
	}
}

function displayText(result) {
	if (result.type === "audiobook") {
		return `${result.name} - ${result.authors[0].name} - Audiobook`;
	} else if (result.type === "track") {
		return `${result.name} - ${result.artists[0].name} - Song`;
	} else {
		return `${result.name} - Podcast`;
	}
}

export default Queue;
