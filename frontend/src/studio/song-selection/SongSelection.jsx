import React, { useEffect } from "react";
import { useState } from "react";
import styles from "../StudioPage.module.css";
import useGet from "../../hooks/useGet";
import SearchBar from "../../shared/SearchBar";
import list_styles from "../../shared/SearchBar.module.css";
import axios from "axios";
import QueueMusicRoundedIcon from "@mui/icons-material/QueueMusicRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Box, Button, Icon, ListItemAvatar } from "@mui/material";
import { List, ListItem, ListItemText, Tooltip, Avatar } from "@mui/material";
import { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import Queue from "./Queue";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function SongSelection({ studio, socket }) {
	const [songSearchResults, setSongSearchResults] = useState([]);
	const [playlistSongs, setPlaylistSongs] = useState([]);

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
					{songSearchResults.map((result, i) => (
						<SongListItem
							key={i}
							result={result}
							socket={socket}
							studio={studio}
							setSongSearchResults={setSongSearchResults}
						/>
					))}
				</List>
			) : null}
			<Queue
				studio={studio}
				playlistSongs={playlistSongs}
				setPlaylistSongs={setPlaylistSongs}
				socket={socket}
			/>
		</div>
	);
}

function SongListItem(props) {
	const { result, studio, setSongSearchResults, socket } = props;
	const [isHover, setHover] = useState(false);
	const [isIconHover, setIconHover] = useState(false);

	const handleItemMouseEnter = () => {
		setHover(true);
	};
	const handleItemMouseLeave = () => {
		setHover(false);
	};
	const handleIconMouseEnter = () => {
		setIconHover(true);
	};
	const handleIconMouseLeave = () => {
		setIconHover(false);
	};

	const ToolTip = styled(({ className, ...props }) => (
		<Tooltip {...props} classes={{ popper: className }} />
	))(({ theme }) => ({
		[`& .${tooltipClasses.arrow}`]: {
			color: theme.palette.common.white,
		},
		[`& .${tooltipClasses.tooltip}`]: {
			backgroundColor: theme.palette.common.white,
			color: "rgba(0, 0, 0, 0.87)",
			boxShadow: theme.shadows[1],
			fontSize: 12,
			color: "#666666",
			maxWidth: "80%",
		},
	}));

	const handleAddToQueue = async () => {
		await axios.put(`${BASE_URL}/api/spotify/queue`, {
			playlist_id: studio.studioPlaylist,
			track_id: result.id,
		});
		// reload the studio queue
		socket.emit("reload_studio_queue", { room: studio._id });
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
							onClick={() => handleAddToQueue()}
							edge="end"
							style={{ color: isIconHover ? "#B03EEE" : "#757575" }}
						/>
					</ToolTip>
				</>
			}
		>
			<Box className={styles.resultImgBox} position="relative">
				<img className={styles.resultImg} src={result.image} />
				{isHover ? <Box className={styles.resultImgDark} /> : null}
				{isHover ? (
					<Icon
						fontSize={"large"}
						sx={{
							position: "absolute",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -65%)",
						}}
					>
						<PlayArrowRoundedIcon
							fontSize={"large"}
							style={{ color: "white" }}
						/>
					</Icon>
				) : null}
			</Box>
			<ListItemText
				className={styles.resultTitle}
				primary={displayText(result)}
			/>
		</ListItem>
	);
}

function displayText(result) {
	return (
		<>
			<p className={styles.resultTitleDetail}>
				<b>{result.name}</b>
			</p>
			<p className={styles.resultTitleDetail}>{result.artists}</p>
		</>
	);
}
