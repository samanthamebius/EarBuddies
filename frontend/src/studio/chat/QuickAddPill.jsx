import React from 'react';
import styles from './QuickAddPill.module.css';
import PodcastsRoundedIcon from '@mui/icons-material/PodcastsRounded';
import MusicNoteRoundedIcon from '@mui/icons-material/MusicNoteRounded';
import AlbumRoundedIcon from '@mui/icons-material/AlbumRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';

/**
 * Component to display the quick add pill options when a track is playing
 * @param nowPlaying - Object for the currently playing song
 * @param message - Array of messages inside the studio
 * @param setMessages - Function to set the array of messages inside the studio
 */
function QuickAddPill({ nowPlaying, message, setMessage }) {
	const handleAddToTextField = (type) => {
		// add a space if the message is not blank
		if (type === 'name') {
			setMessage(
				message ? `${message} ${nowPlaying.name}` : `${message}${nowPlaying.name}`
			);
		} else if (type === 'album') {
			setMessage(
				message
					? `${message} ${nowPlaying.album}`
					: `${message}${nowPlaying.album}`
			);
		} else if (type === 'artist') {
			setMessage(
				message
					? `${message} ${nowPlaying.artist}`
					: `${message}${nowPlaying.artist}`
			);
		}
	};

	return (
		<div className={styles.pillContainer}>
			{nowPlaying.type === 'track' && nowPlaying.type !== null ? (
				<>
					{/* Song Pills */}
					<div
						className={styles.pillContent}
						onClick={() => handleAddToTextField('name')}>
						<MusicNoteRoundedIcon
							style={{ color: 'var(--iconColor)', marginRight: '8px' }}
							sx={{ fontSize: '14px' }}
						/>
						<b className={styles.pillText}>Song</b>
					</div>
					<div
						className={styles.pillContent}
						onClick={() => handleAddToTextField('album')}>
						<AlbumRoundedIcon
							style={{ color: 'var(--iconColor)', marginRight: '8px' }}
							sx={{ fontSize: '14px' }}
						/>
						<b className={styles.pillText}>Album</b>
					</div>
					<div
						className={styles.pillContent}
						onClick={() => handleAddToTextField('artist')}>
						<PersonRoundedIcon
							style={{ color: 'var(--iconColor)', marginRight: '8px' }}
							sx={{ fontSize: '14px' }}
						/>
						<b className={styles.pillText}>Artist</b>
					</div>
				</>
			) : (
				// Podcast Pills
				<div
					className={styles.pillContent}
					onClick={() => handleAddToTextField('name')}>
					<PodcastsRoundedIcon
						style={{ color: 'var(--iconColor)', marginRight: '8px' }}
						sx={{ fontSize: '16px' }}
					/>
					<b className={styles.pillText}>Podcast</b>
				</div>
			)}
		</div>
	);
}

export default QuickAddPill;
