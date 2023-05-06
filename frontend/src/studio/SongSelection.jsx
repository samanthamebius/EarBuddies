import React, { useEffect } from "react";
import { useState } from "react";
import styles from "./StudioPage.module.css";
import SearchBarSong from "./SearchBarSong";
import useGet from "../hooks/useGet";
import list_styles from "../shared/SearchBar.module.css";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ClearRounded from "@mui/icons-material/ClearRounded";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import axios from "axios";
import {
	List,
	ListItem,
	ListItemText,
	ListItemAvatar,
	Button,
	Avatar,
	Menu,
	MenuItem,
	styled,
} from "@mui/material";

const StyledMenu = styled(Menu)({
	"& .MuiPaper-root": {
		boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
	},
});

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function SongSelection({ studio }) {
	const [playlistSongs, setPlaylistSongs] = useState([]);
	const [reloadPlaylist, setReloadPlaylist] = useState(false);
	return (
		<div className={styles.songselection}>
			<SongSearch studio={studio} setReloadPlaylist={setReloadPlaylist} />
			<Queue
				studio={studio}
				playlistSongs={playlistSongs}
				setPlaylistSongs={setPlaylistSongs}
				reloadPlaylist={reloadPlaylist}
				setReloadPlaylist={setReloadPlaylist}
			/>
		</div>
	);
}

function SongSearch({ studio, setReloadPlaylist }) {
	return (
		<div>
			<label className={styles.songGreyHeading}>What's Next?</label>
			<SearchBarSong studio={studio} setReloadPlaylist={setReloadPlaylist} />
		</div>
	);
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

function Queue(props) {
	const {
		studio,
		setPlaylistSongs,
		playlistSongs,
		reloadPlaylist,
		setReloadPlaylist,
	} = props;
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
		handleCloseMenu();
	};

	const {
		data: playlist,
		isLoading: songsIsLoading,
		error: songsError,
	} = useGet(`/api/spotify/queue/${studio.studioPlaylist}`);

	useEffect(() => {
		axios
			.get(`${BASE_URL}/api/spotify/queue/${studio.studioPlaylist}`)
			.then((response) => setPlaylistSongs(response.data.tracks.items));
		setReloadPlaylist(false);
	}, [reloadPlaylist]);

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
							<ListItem
								key={result.track.id}
								secondaryAction={
									<Button
										edge="end"
										aria-label="more options"
										onClick={(event) => handleOpenMenu(event, result)}
									>
										<MoreHorizIcon />
									</Button>
								}
							>
								<StyledMenu
									anchorEl={anchorEl}
									open={Boolean(anchorEl)}
									onClose={handleCloseMenu}
								>
									<MenuItem onClick={() => handlePlay(selectedIndex)}>
										Play
									</MenuItem>
									<MenuItem
										onClick={() => handleRemove(selectedIndex, snapshot_id)}
									>
										Remove from queue
									</MenuItem>
								</StyledMenu>
								<ListItemAvatar>
									<Avatar>
										<img
											className={list_styles.image}
											src={result.track.album.images[0].url}
										/>
									</Avatar>
								</ListItemAvatar>
								<ListItemText primary={displayText(result.track)} />
							</ListItem>
						))}
					</List>
				)}
			</div>
		);
	}
}
