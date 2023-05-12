import React, { useContext } from 'react';
import { List } from '@mui/material';
import { useState } from 'react';

import SearchBar from '../../shared/SearchBar';
import styles from '../StudioPage.module.css';
import SongListItem from './SongListItem';
import Queue from './Queue';
import { AppContext } from '../../AppContextProvider';

/**
 * Container for the song selection of the studio including search and queue
 * @param studio - The current studio
 * @param socket - Communication channel between client and server
 * @param setQueueIsEmpty - Function to determine if the current queue is empty
 * @returns
 */
export default function SongSelection({ studio, socket, setQueueIsEmpty }) {
	const [songSearchResults, setSongSearchResults] = useState([]);

	const { username } = useContext(AppContext);
	const isHost = studio.studioHost === username;

	return (
		<div className={styles.songselection}>
			{isHost && (
				<SearchBar
					searchType={'songs'}
					label={'Search Spotify...'}
					studioId={''}
					setResults={setSongSearchResults}
					studio={studio}
					onInputChange={() => {}}
					playlist_id={studio.studioPlaylist}
				/>
			)}
			{songSearchResults.length > 0 ? (
				<List className={styles.searchResults}>
					{songSearchResults.map((result) => (
						<SongListItem
							setResults={setSongSearchResults}
							key={result.id}
							song={result}
							socket={socket}
							studio={studio}
							type='search'
						/>
					))}
				</List>
			) : null}
			<Queue
				studio={studio}
				socket={socket}
				setQueueIsEmpty={setQueueIsEmpty}
			/>
		</div>
	);
}
