import React, { useEffect } from "react";
import { useState } from "react";
import styles from "../StudioPage.module.css";
import axios from "axios";
import QueueMusicRoundedIcon from "@mui/icons-material/QueueMusicRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Box, Icon, ListItem, ListItemText, Tooltip } from "@mui/material";
import { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function SongListItem(props) {
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
			});
		} else {
			setListItem({
				id: result.id,
				name: result.name,
				artists: result.artists,
				image: result.image,
			});
		}
	}, []);

	return (
		<>
			<ListItem
				onMouseEnter={handleItemMouseEnter}
				onMouseLeave={handleItemMouseLeave}
				className={styles.result}
				onClick={null} // TO DO: IMPLEMENT PLAY FROM HERE
				secondaryAction={
					<>
						{type === "search" ? (
							<ToolTip title={"Add to Queue"} placement="left" arrow>
								<QueueMusicRoundedIcon
									onMouseEnter={handleIconMouseEnter}
									onMouseLeave={handleIconMouseLeave}
									onClick={() => handleAddToQueue()}
									edge="end"
									style={{ color: isIconHover ? "#B03EEE" : "#757575" }}
								/>
							</ToolTip>
						) : (
							<CloseRoundedIcon
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
				<Box className={styles.resultImgBox} position="relative">
					<img className={styles.resultImg} src={listItem.image} />
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
					primary={<b>{listItem.name}</b>}
					secondary={
						<>
							<p className={styles.resultTitleDetail}>
								{listItem.artists}
							</p>
						</>
					}
					primaryTypographyProps={{
						style: {
							maxWidth: '320px',
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis'
						}
					}}
					secondaryTypographyProps={{
						style: {
							maxWidth: '320px',
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis'
						}
					}}
				/>
			</ListItem>
		</>
	);
}

export default SongListItem;
