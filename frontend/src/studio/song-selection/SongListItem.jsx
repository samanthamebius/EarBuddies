import React, { useEffect } from "react";
import { useState } from "react";
import styles from "../StudioPage.module.css";
import axios from "axios";
import QueueMusicRoundedIcon from "@mui/icons-material/QueueMusicRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PodcastsRoundedIcon from '@mui/icons-material/PodcastsRounded';
import MusicNoteRoundedIcon from '@mui/icons-material/MusicNoteRounded';
import EqualizerRoundedIcon from '@mui/icons-material/EqualizerRounded';
import { Box, Icon, ListItem, ListItemText } from "@mui/material";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function SongListItem(props) {
	const { result, studio, socket, type, snapshotId = null } = props;
	const [isHover, setHover] = useState(false);
	const [isIconHover, setIconHover] = useState(false);
	const [listItem, setListItem] = useState({});

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
			track_id: result.id,
			type: result.type,
		});
		// reload the studio queue
		socket.emit("reload_studio_queue", { room: studio._id });
	};

	const handleRemoveFromQueue = async () => {
		const playlist_id = studio.studioPlaylist;
		const track_id = result.track.id;
		const type = result.track.type;
		await axios.delete(
			`${BASE_URL}/api/spotify/queue/${playlist_id}/${track_id}`,
			{ data: { snapshot_id: snapshotId, type: type } });

		// reload the playlist after deleting
		socket.emit("reload_studio_queue", { room: studio._id });
	};

	useEffect(() => {
		if (type === "queue") {
			setListItem({
				id: result.track.id,
				name: result.track.name,
				artists: result.track.artists,
				image: result.track.album.images[0].url,
				type: result.type,
			});
		} else {
			setListItem({
				id: result.id,
				name: result.name,
				artists: result.artists,
				image: result.image,
				type: result.type,
			});
		}
	}, []);

	const displaySongTypeIcon = () => {
		if (listItem.type === "episode") {
			return (
				<PodcastsRoundedIcon fontSize="small" style={{ color: "#c4c4c4", marginRight: '10px' }} />
			)
		} else if (listItem.type === "track") {
			return (
				<MusicNoteRoundedIcon fontSize="small" style={{ color: "#c4c4c4", marginRight: '10px' }} />
			)
		} else if (false) { //TO DO: isPlaying (replace false)
			return (
				<EqualizerRoundedIcon fontSize="small" style={{ color: "#CA3FF3", marginRight: '10px' }} />
			)
		}
	};

	const displaySongImage = () => {
		return (
			<Box className={styles.resultImgBox} position="relative">
				<img className={styles.resultImg} src={listItem.image} />
				{/* For search results, onHover styles on listItem */}
				{type === "search" &&
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
								<QueueMusicRoundedIcon
									style={{ color: "white" }}
								/>
							</Icon>)}
					</>
				}
			</Box>
		)
	}

	const displaySongText = () => {
		return (
			<ListItemText
				className={styles.resultTitle}
				primary={<b>{listItem.name}</b>}
				secondary={<p className={styles.resultTitleDetail}>{listItem.artists}</p>}
				primaryTypographyProps={{
					style: {
						width: '300px',
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis'
					}
				}}
				secondaryTypographyProps={{
					style: {
						width: '300px',
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis'
					}
				}}
			/>
		)
	}

	return (
		<>
			<ListItem
				onMouseEnter={handleItemMouseEnter}
				onMouseLeave={handleItemMouseLeave}
				className={styles.result}
				// onClick={type === "search" ? (() => handleAddToQueue()) : undefined} //For search results, listItem onClick adds to queue
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
};