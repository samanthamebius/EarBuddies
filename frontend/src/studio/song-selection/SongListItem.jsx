import React, { useEffect } from "react";
import { useState } from "react";
import styles from "../StudioPage.module.css";
import axios from "axios";
import QueueMusicRoundedIcon from "@mui/icons-material/QueueMusicRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PodcastsRoundedIcon from "@mui/icons-material/PodcastsRounded";
import MusicNoteRoundedIcon from "@mui/icons-material/MusicNoteRounded";
import equalizer_icon from "../../assets/now_playing/equalizer.gif";
import { Box, Icon, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function SongListItem(props) {
	const { song, studio, socket, type, snapshotId = null } = props;
	const [isHover, setHover] = useState(false);
	const [isIconHover, setIconHover] = useState(false);
	const [nowPlayingSong, setNowPlayingSong] = useState("");

	// continously get the currently playing song
	useEffect(() => {
		socket.on("receive_currently_playing", (data) => {
			setNowPlayingSong(data?.name);
		});
	}, [socket]);

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

	// add the song to queue and emit to all sockets in the studio
	const handleAddToQueue = async () => {
		await axios.put(`${BASE_URL}/api/spotify/queue`, {
			playlist_id: studio.studioPlaylist,
			track_id: song.id,
			type: song.type,
		});

		// reload the studio queue
		socket.emit("send_new_song", {
			room: studio._id,
			newSong: song,
		});
	};

	// remove the song from the playlist
	const handleRemoveFromQueue = async () => {
		const playlist_id = studio.studioPlaylist;
		const track_id = song.id;
		await axios.delete(
			`${BASE_URL}/api/spotify/queue/${playlist_id}/${track_id}`,
			{ data: { snapshot_id: snapshotId, type: song.type } }
		);

		// reload the playlist after deleting
		socket.emit("remove_from_studio_queue", {
			room: studio._id,
			songId: track_id,
		});
	};

	const displaySongTypeIcon = () => {
		if (nowPlayingSong === song.name && type === "queue") {
			return (
				<img
					src={equalizer_icon}
					style={{ width: "20px", height: "20px", marginRight: "10px" }}
				/>
			);
		} else if (song.type === "episode") {
			return (
				<PodcastsRoundedIcon
					fontSize="small"
					style={{ color: "#c4c4c4", marginRight: "10px" }}
				/>
			);
		} else if (song.type === "track") {
			return (
				<MusicNoteRoundedIcon
					fontSize="small"
					style={{ color: "#c4c4c4", marginRight: "10px" }}
				/>
			);
		}
	};

	const displaySongImage = () => {
		return (
			<Box className={styles.resultImgBox} position="relative">
				<img className={styles.resultImg} src={song.image} />
				{/* For search results, onHover styles on listItem */}
				{type === "search" && (
					<>
						{isHover && <Box className={styles.resultImgDark} />}
						{isHover && (
							<Icon
								fontSize={"large"}
								sx={{
									position: "absolute",
									top: "50%",
									left: "50%",
									transform: "translate(-50%, -75%)",
								}}
							>
								<QueueMusicRoundedIcon style={{ color: "white" }} />
							</Icon>
						)}
					</>
				)}
			</Box>
		);
	};

	const displaySongText = () => {
		return (
			<ListItemText
				className={styles.resultTitle}
				primary={<b>{song.name}</b>}
				secondary={
					<p className={styles.resultTitleDetail}>
						{song.artists?.length > 0 ? song.artists[0] : song.artists}
					</p>
				}
				primaryTypographyProps={{
					style: {
						width: "300px",
						whiteSpace: "nowrap",
						overflow: "hidden",
						textOverflow: "ellipsis",
					},
				}}
				secondaryTypographyProps={{
					style: {
						width: "300px",
						whiteSpace: "nowrap",
						overflow: "hidden",
						textOverflow: "ellipsis",
					},
				}}
			/>
		);
	};

	return (
		<>
			<ListItem
				onMouseEnter={handleItemMouseEnter}
				onMouseLeave={handleItemMouseLeave}
				className={styles.result}
				onClick={type === "search" ? () => handleAddToQueue() : undefined} //For search results, listItem onClick adds to queue
				secondaryAction={
					<>
						{type === "queue" && (
							<CloseRoundedIcon // For queue results, close button as secondary action
								onMouseEnter={handleIconMouseEnter}
								onMouseLeave={handleIconMouseLeave}
								style={{ color: isIconHover ? "#B03EEE" : "#757575" }}
								fontSize="small"
								onClick={() => handleRemoveFromQueue()}
							/>
						)}
					</>
				}
			>
				{displaySongTypeIcon()}
				{displaySongImage()}
				{displaySongText()}
			</ListItem>
		</>
	);
}

export default SongListItem;
