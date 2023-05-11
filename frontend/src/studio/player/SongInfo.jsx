import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuid } from "uuid";
import styles from "../StudioPage.module.css";
import placeholder_album from "../../assets/now_playing/placeholder_album.png";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function SongInfo(props) {
	const { socket, studio, queueIsEmpty, messages, isHost } = props;
	const [songTitle, setSongTitle] = useState("");
	const [artistName, setArtistName] = useState("");
	const [artistImg, setArtistImg] = useState("");
	const [albumArtwork, setAlbumArtwork] = useState("");

	useEffect(() => {
		const fetchSongInfo = async () => {
			const track = await axios.get(`${BASE_URL}/api/spotify/songinfo`);
			if (track.data?.item?.type === "episode") {
				setSongTitle(track.data.item.name);
				setAlbumArtwork(track.data.item.images[0].url);
				setArtistName(track.data.item.show.name);
				setArtistImg(null);
			} else {
				setSongTitle(track.data?.item?.name);
				setAlbumArtwork(track.data?.item?.album.images[0].url);
				setArtistName(track.data?.item?.artists[0].name);
				// const artist_id = track.data?.item?.artists[0].id;
				// if (artist_id) {
				// 	const artist = await axios.get(
				// 		`${BASE_URL}/api/spotify/artist/${artist_id}`
				// 	);
				// 	setArtistImg(artist.data.images[0].url);
				// }
			}

			socket.emit("send_currently_playing", {
				room: studio._id,
				track: track.data.item,
			});
		};
		fetchSongInfo();

		// CHANGE THIS POLLING BACK
		// Polling mechanism to update song info
		const interval = setInterval(fetchSongInfo, 5000);

		// Cleanup interval on component unmount
		return () => clearInterval(interval);
	}, [songTitle]);

	// send the now playing song to chat only when it changes
	useEffect(() => {
		if (songTitle !== "") {
			socket.emit("send_to_chat_currently_playing", {
				room: studio._id,
				trackTitle: songTitle,
				messageId: uuid(),
				messages: messages,
				isHost: isHost,
			});
		}
	}, [songTitle]);

	return (
		<div className={styles.songSection}>
			<h3
				className={styles.song}
				style={{ display: songTitle && !queueIsEmpty ? "flex" : "none" }}
			>
				{songTitle}
			</h3>
			<div className={styles.artist}>
				<img
					style={{ display: artistImg && !queueIsEmpty ? "flex" : "none" }}
					className={styles.artistImg}
					src={artistImg}
				/>
				<div
					style={{ display: artistName && !queueIsEmpty ? "flex" : "none" }}
					className={styles.artistName}
				>
					{artistName ? artistName : null}
				</div>
			</div>
			<img
				className={styles.albumArtwork}
				src={albumArtwork && !queueIsEmpty ? albumArtwork : placeholder_album}
			/>
		</div>
	);
}

export default SongInfo;
