import React from "react";
import { useState } from "react";
import styles from "./StudioPage.module.css";
import useGet from "../hooks/useGet";
import SearchBar from "../shared/SearchBar";
import axios from "axios";
import QueueMusicRoundedIcon from '@mui/icons-material/QueueMusicRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { Box, Icon } from '@mui/material';
import { List, ListItem, ListItemText, Tooltip } from "@mui/material";
import { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

export default function SongSelection({ studio }) {
	const [songSearchResults, setSongSearchResults] = useState([]);
	return (
		<div className={styles.songselection}>
			<SearchBar
				searchType={"songs"}
				label={"Search Spotify..."}
				studioId={""}
				setResults={setSongSearchResults}
				studio={studio} />
			{songSearchResults.length > 0 ? <List className={styles.searchResults}>
				{songSearchResults.map((result, i) => (
					<SongListItem key={i} result={result} />
				))}
			</List> : null}
			<Queue studio={studio} />
		</div>
	);
}

function SongListItem({ result }) {
	const [isHover, setHover] = useState(false);
	const [isIconHover, setIconHover] = useState(false);

	const handleItemMouseEnter = () => { setHover(true); };
	const handleItemMouseLeave = () => { setHover(false); };
	const handleIconMouseEnter = () => { setIconHover(true); };
	const handleIconMouseLeave = () => { setIconHover(false); };

	const BASE_URL = import.meta.env.VITE_API_BASE_URL;

	const ToolTip = styled(({ className, ...props }) => (
		<Tooltip {...props} classes={{ popper: className }} />
	))(({ theme }) => ({
		[`& .${tooltipClasses.arrow}`]: {
			color: theme.palette.common.white,
		},
		[`& .${tooltipClasses.tooltip}`]: {
			backgroundColor: theme.palette.common.white,
			color: 'rgba(0, 0, 0, 0.87)',
			boxShadow: theme.shadows[1],
			fontSize: 12,
			color: '#666666',
			maxWidth: '80%'
		},
	}));

	const handleAddToQueue = (result) => {
		axios.put(`${BASE_URL}/api/spotify/queue`, { playlist_id: studio.studioPlaylist, track_id: result.id })
		handleCloseMenu();
	};

	return (
		<ListItem
			onMouseEnter={handleItemMouseEnter}
			onMouseLeave={handleItemMouseLeave}
			className={styles.result}
			onClick={null} // TO DO: IMPLEMENT PLAY FROM HERE
			secondaryAction={
				<>
					<ToolTip title={"Add to Queue"} placement="left" arrow>
						<QueueMusicRoundedIcon
							onMouseEnter={handleIconMouseEnter}
							onMouseLeave={handleIconMouseLeave}
							onClick={() => handleAddToQueue(result)} // TO DO: IMPLEMENT QUEUE FROM HERE
							edge="end"
							style={{ color: isIconHover ? "#B03EEE" : "#757575" }} />
					</ToolTip>
				</>
			}>
			<Box className={styles.resultImgBox} position="relative">
				<img className={styles.resultImg} src={result.image} />
				{isHover ? <Box className={styles.resultImgDark} /> : null}
				{isHover ? <Icon fontSize={'large'} sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -65%)' }}>
					<PlayArrowRoundedIcon fontSize={'large'} style={{ color: "white" }} />
				</Icon> : null}
			</Box>
			<ListItemText className={styles.resultTitle} primary={displayText(result)} />
		</ListItem>
	)
}

function displayText(result) {
	return (
		<>
			<p className={styles.resultTitleDetail}><b>{result.name}</b></p>
			<p className={styles.resultTitleDetail}>{result.artists}</p>
		</>
	)
}

function Queue({ studio }) {
	const [anchorEl, setAnchorEl] = useState(null);
	const [selectedIndex, setSelectedIndex] = useState(null);
	const handleOpenMenu = (event, index) => {
		setAnchorEl(event.currentTarget);
		setSelectedIndex(index)
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
		const BASE_URL = import.meta.env.VITE_API_BASE_URL;
		axios.delete(`${BASE_URL}/api/spotify/queue/${playlist_id}/${track_id}`), { snapshot_id: snapshot_id };
		handleCloseMenu();
	};

	const { data: playlist, isLoading: songsIsLoading, error: songsError } = useGet(`/api/spotify/queue/${studio.studioPlaylist}`);
	if (songsError) {
		return <p>Could not load songs</p>;
	}
	if (songsIsLoading) {
		return <p>Loading...</p>;
	} else if (!playlist) {
		return <p>Could not load songs</p>;
	} else {
		const songs = playlist.tracks.items;
		const snapshot_id = playlist.snapshot_id;
		return (
			<div>
				<label className={styles.queueGreyHeading}>Coming Up:</label>
				{songs?.length > 0 && <List className={list_styles.listContainer}>
					{songs.map((result) => (
						<ListItem key={result.track.id}
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
								<MenuItem onClick={() => handlePlay(selectedIndex)}>Play</MenuItem>
								<MenuItem onClick={() => handleRemove(selectedIndex, snapshot_id)}>Remove from queue</MenuItem>
							</StyledMenu>
							<ListItemAvatar>
								<Avatar>
									<img className={list_styles.image} src={result.track.album.images[0].url} />
								</Avatar>
							</ListItemAvatar>
							<ListItemText primary={displayText(result.track)} />
						</ListItem>
					))}
				</List>}
			</div>
		);
	}

}
