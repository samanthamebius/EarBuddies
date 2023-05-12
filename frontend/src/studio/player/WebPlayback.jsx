import React, { useState, useEffect, useContext } from 'react';

import ControlPanel from './ControlPanel';
import SongInfo from './SongInfo';
import { AppContext } from '../../AppContextProvider';
import { useNavigate } from 'react-router-dom';

/**
 *
 * @param studio - The current studio
 * @param socket - Communication channel between client and server
 * @param token - The access token for the current user
 * @param queueIsEmpty - Boolean to check if the queue is empty
 * @param messages - Array of the current messages in the studio
 * @returns
 */

function WebPlayback(props) {
	const { studio, socket, token, queueIsEmpty, messages } = props;
	const [player, setPlayer] = useState({});
	const { myDeviceId, setMyDeviceId, username } = useContext(AppContext);
	const navigate = useNavigate();

	const isHost = username === studio.studioHost;

	// Create the player and add a new device for the browser
	useEffect(() => {
		const script = document.createElement('script');
		script.src = 'https://sdk.scdn.co/spotify-player.js';
		script.async = true;

		document.body.appendChild(script);

		//Check for access token expiry check
		try {
			window.onSpotifyWebPlaybackSDKReady = () => {
				// Create the player
				const player = new window.Spotify.Player({
					name: 'EarBuddies',
					getOAuthToken: (cb) => {
						cb(token);
					},
					volume: 0.5,
				});

				setPlayer(player);

				// Set the new device id
				player.addListener('ready', ({ device_id }) => {
					setMyDeviceId(device_id);
				});

				player.connect();
			};
		} catch (error) {
			console.log(error);
			navigate('/400');
		}
	}, []);

	// disconnect the player when the component dismounts
	useEffect(() => {
		return () => {
			window.location.reload(false);
		};
	}, []);

	return (
		<>
			<div className='container'>
				<div className='main-wrapper'>
					<SongInfo
						socket={socket}
						studio={studio}
						queueIsEmpty={queueIsEmpty}
						messages={messages}
						isHost={isHost}
					/>
					<ControlPanel
						deviceId={myDeviceId}
						studio={studio}
						player={player}
						socket={socket}
						queueIsEmpty={queueIsEmpty}
						isHost={isHost}
					/>
				</div>
			</div>
		</>
	);
}

export default WebPlayback;
