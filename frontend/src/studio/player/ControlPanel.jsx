import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import PauseCircleRoundedIcon from '@mui/icons-material/PauseCircleRounded';
import PlayCircleFilledRoundedIcon from '@mui/icons-material/PlayCircleFilledRounded';
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded';
import SkipPreviousRoundedIcon from '@mui/icons-material/SkipPreviousRounded';
import { useNavigate } from 'react-router';
import styles from '../StudioPage.module.css';
import TimeSlider from './TimeSlider';
import VolumeSlider from './VolumeSlider';
import { AppContext } from '../../AppContextProvider';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ControlPanel(props) {
	const { studio, player, socket, queueIsEmpty, isHost } = props;
	const [isPlaying, setPlaying] = useState(false);
	const navigate = useNavigate();
	const { myDeviceId } = useContext(AppContext);
	const [isInPrevious, setInPrevious] = useState(false);
	const [isInPause, setInPause] = useState(false);
	const [isInPlay, setInPlay] = useState(false);
	const [isInNext, setInNext] = useState(false);

	function spotifyPlayer(studio, myDeviceId) {
		try {
			axios
				.put(`${BASE_URL}/api/spotify/play`, {
					uri: 'spotify:playlist:' + studio?.studioPlaylist,
					deviceId: myDeviceId,
				})
				.then((response) => {
					console.log(response);
				})
				.catch((error) => {
					navigate('/400');
				});
		} catch (error) {
			console.log(error);
			navigate('/400');
		}
	}

	function spotifyPauser(myDeviceId) {
		try {
			axios
				.put(`${BASE_URL}/api/spotify/pause`, {
					deviceId: myDeviceId,
				})
				.then((response) => {
					console.log(response);
				})
				.catch((error) => {
					navigate('/400');
				});
		} catch (error) {
			console.log(error);
			navigate('/400');
		}
	}

	function spotifyNext(myDeviceId, studio) {
		try {
			axios
				.put(`${BASE_URL}/api/spotify/next`, {
					deviceId: myDeviceId,
					studio: studio,
				})
				.then((response) => {
					console.log(response);
				})
				.catch((error) => {
					navigate('/400');
				});
		} catch (error) {
			console.log(error);
			navigate('/400');
		}
	}

	function spotifyPrevious(myDeviceId) {
		try {
			axios
				.put(`${BASE_URL}/api/spotify/previous`, {
					deviceId: myDeviceId,
				})
				.then((response) => {
					console.log(response);
				})
				.catch((error) => {
					navigate('/400');
				});
		} catch (error) {
			console.log(error);
			navigate('/400');
		}
	}

	function playButton(studio) {
		// only play if host
		if (isHost) {
			console.log('playing');
			spotifyPlayer(studio, myDeviceId);
		}
		socket.emit('send_play_song', {
			room: studio._id,
			isPlaying: true,
		});
	}

	function pauseButton(studio) {
		// only pause if host
		if (isHost) {
			spotifyPauser(myDeviceId);
		}
		socket.emit('send_pause_song', {
			room: studio._id,
			isPlaying: false,
		});
	}

	function previousButton() {
		if (isHost) {
			spotifyPrevious(myDeviceId);
		}
	}

	function skipButton(studio) {
		if (isHost) {
			spotifyNext(myDeviceId, studio);
		}
	}

	// socket is listening to when a song should be played
	useEffect(() => {
		socket.on('receive_play_song', (data) => {
			const { isPlaying } = data;
			if (Object.keys(myDeviceId).length !== 0) {
				setPlaying(isPlaying);
			}
			console.log('received play');
		});
	}, [socket, myDeviceId]);

	// socket is listening to when a song should be paused
	useEffect(() => {
		socket.on('receive_pause_song', (data) => {
			const { isPlaying } = data;
			if (Object.keys(myDeviceId).length !== 0) {
				setPlaying(isPlaying);
			}
			console.log('received pause');
		});
	}, [socket, myDeviceId]);

	const enterPrevious = () => {
		setInPrevious(true);
	};

	const enterPause = () => {
		setInPause(true);
	};

	const enterPlay = () => {
		setInPlay(true);
	};

	const enterNext = () => {
		setInNext(true);
	};

	const leavePrevious = () => {
		setInPrevious(false);
	};

	const leavePause = () => {
		setInPause(false);
	};

	const leavePlay = () => {
		setInPlay(false);
	};

	const leaveNext = () => {
		setInNext(false);
	};

	return (
		<div className={styles.controlPanel}>
			<div className={styles.playbackCntrls}>
				<SkipPreviousRoundedIcon
					sx={{ '&:hover': { cursor: isHost && 'pointer' } }}
					style={{
						fontSize: '40px',
						color:
							queueIsEmpty || isInPrevious || !isHost ? '#e7bcf7' : 'white',
						pointerEvents: queueIsEmpty ? 'none' : 'auto',
					}}
					onClick={isHost ? () => previousButton() : undefined}
					onMouseEnter={enterPrevious}
					onMouseLeave={leavePrevious}
					disabled={queueIsEmpty || !isHost}
				/>
				{!isPlaying ? (
					<PlayCircleFilledRoundedIcon
						sx={{ '&:hover': { cursor: isHost && 'pointer' } }}
						style={{
							fontSize: '40px',
							color:
								queueIsEmpty || isInPlay || !isHost ? '#e7bcf7' : 'white',
							pointerEvents: queueIsEmpty ? 'none' : 'auto',
						}}
						onClick={isHost ? () => playButton(studio) : undefined}
						onMouseEnter={enterPlay}
						onMouseLeave={leavePlay}
						disabled={queueIsEmpty || !isHost}
					/>
				) : (
					<PauseCircleRoundedIcon
						sx={{ '&:hover': { cursor: isHost && 'pointer' } }}
						style={{
							fontSize: '40px',
							color:
								queueIsEmpty || isInPause || !isHost
									? '#e7bcf7'
									: 'white',
							pointerEvents: queueIsEmpty ? 'none' : 'auto',
						}}
						onClick={isHost ? () => pauseButton(studio) : undefined}
						onMouseEnter={enterPause}
						onMouseLeave={leavePause}
						disabled={queueIsEmpty || !isHost}
					/>
				)}
				<SkipNextRoundedIcon
					sx={{ '&:hover': { cursor: isHost && 'pointer' } }}
					style={{
						fontSize: '40px',
						color: queueIsEmpty || isInNext || !isHost ? '#e7bcf7' : 'white',
						pointerEvents: queueIsEmpty ? 'none' : 'auto',
					}}
					onClick={isHost ? () => skipButton(studio) : undefined}
					onMouseEnter={enterNext}
					onMouseLeave={leaveNext}
					disabled={queueIsEmpty || !isHost}
				/>
			</div>
			<TimeSlider
				player={player}
				queueIsEmpty={queueIsEmpty}
				isHost={isHost}
			/>
			<VolumeSlider
				player={player}
				isHost={isHost}
			/>
		</div>
	);
}

export default ControlPanel;
