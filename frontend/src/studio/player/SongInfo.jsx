import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { v4 as uuid } from 'uuid';

import styles from './SongInfo.module.css';
import placeholder_album from '../../assets/now_playing/placeholder_album.png';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Display the information for the currently playing song
 * @param socket - Communication channel between client and server
 * @param studio - The current studio
 * @param queueIsEmpty - Boolean to check if the queue is empty
 * @param messages - Array of the current messages in the studio
 * @param isHost - Boolean to check if the current user is the host
 * @returns {JSX.Element} - JSX creating the song info component
 */
function SongInfo(props) {
	const { socket, studio, queueIsEmpty, messages, isHost } = props;
	const [songTitle, setSongTitle] = useState('');
	const [artistName, setArtistName] = useState('');
	const [artistImg, setArtistImg] = useState('');
	const [albumArtwork, setAlbumArtwork] = useState('');

	useEffect(() => {
		const fetchSongInfo = async () => {
			const track = await axios.get(`${BASE_URL}/api/spotify/songinfo`);
			if (track.data?.item?.type === 'episode') {
				setSongTitle(track.data.item.name);
				setAlbumArtwork(track.data.item.images[0].url);
				setArtistName(track.data.item.show.name);
				setArtistImg(null);
			} else {
				setSongTitle(track.data?.item?.name);
				setAlbumArtwork(track.data?.item?.album.images[0].url);
				setArtistName(track.data?.item?.artists[0].name);

				const artist_id = track.data?.item?.artists[0].id;
				if (artist_id) {
					const artist = await axios.get(
						`${BASE_URL}/api/spotify/artist/${artist_id}`
					);
					setArtistImg(artist.data.images[0].url);
				}
			}

			socket.emit('send_currently_playing', {
				room: studio._id,
				track: track.data.item,
			});
		};
		fetchSongInfo();

		// Polling mechanism to update song info
		const interval = setInterval(fetchSongInfo, 1000);

		// Cleanup interval on component unmount
		return () => clearInterval(interval);
	}, [songTitle]);

	// send the now playing song to chat only when it changes
	useEffect(() => {
		// if they are the host then emit to the socket
		if (songTitle !== undefined && isHost) {
			const messageId = uuid();
			socket.emit('send_to_chat_currently_playing', {
				room: studio._id,
				trackTitle: songTitle,
				messageId: uuid(),
				messages: messages,
				isHost: isHost,
			});

			// save the message to DB
			axios.put(`http://localhost:3000/api/chat/new-message/${studio._id}`, {
				id: messageId,
				username: 'chat_bot',
				displayName: 'chat_bot',
				message: `Now playing: ${songTitle}`,
				isReply: false,
				replyMessage: '',
			});
		}
	}, [songTitle]);

	return (
		<div className={styles.songSection}>
			{/* Track Title */}
			<h3
				className={styles.song}
				style={{ visibility: songTitle && !queueIsEmpty ? 'visible' : 'hidden' }}>
				{songTitle}
			</h3>
			{/* Track Artist */}
			<div className={styles.artist}>
				<img
					style={{
						display: artistImg && !queueIsEmpty ? 'block' : 'none',
					}}
					className={styles.artistImg}
					src={artistImg}
				/>
				<div
					style={{
						visibility: artistName && !queueIsEmpty ? 'visible' : 'hidden',
					}}
					className={styles.artistName}>
					{artistName ? artistName : null}
				</div>
			</div>
			{/* Track artwork */}
			<img
				className={styles.albumArtwork}
				src={albumArtwork && !queueIsEmpty ? albumArtwork : placeholder_album}
			/>
		</div>
	);
}

export default SongInfo;
