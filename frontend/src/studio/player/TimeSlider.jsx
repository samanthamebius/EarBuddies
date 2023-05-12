import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import styles from '../StudioPage.module.css';
import { styled } from '@mui/material/styles';
import { StyledSlider } from './StyledSlider';
import axios from 'axios';

/**
 * Time slider to adjust and see the current elapsed time in a song
 * @param player - The current player in the browser
 * @param queueIsEmpty - Boolean to check if the queue is empty
 * @param isHost - Boolean to check if the current user is the host
 * @returns {JSX.Element} - JSX creating the time slider component
 */
export function TimeSlider({ player }) {
	const [duration, setDuration] = useState(0);
	const [position, setPosition] = useState(0);
	const BASE_URL = import.meta.env.VITE_API_BASE_URL;

	// set the duration of the current song
	useEffect(() => {
		const fetchDuration = async () => {
			const track = await axios.get(`${BASE_URL}/api/spotify/songinfo`);
			setDuration(Math.round(track.data.item.duration_ms / 1000));
		};
		fetchDuration();
	}, []);

	// update the position of the current song as it plays
	useEffect(() => {
		const fetchPosition = async () => {
			axios.get(`${BASE_URL}/api/spotify/songinfo`).then((response) => {
				setPosition(Math.round(response.data.progress_ms / 1000));
			});
		};
		fetchPosition();

		// Polling mechanism to continuously update position
		const interval = setInterval(fetchPosition, 1000);

		// Cleanup interval on component unmount
		return () => clearInterval(interval);
	}, []);

	const TinyText = styled(Typography)({
		fontSize: '0.75rem',
		opacity: 0.38,
		fontWeight: 500,
		letterSpacing: 0.2,
		color: 'white',
	});

	// format the duration of the song into readable values
	function formatDuration(value) {
		const minute = Math.floor(value / 60);
		const secondLeft = value - minute * 60;
		return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
	}

	// change the position of the slider and update the playing position
	const handleChange = (event, newValue) => {
		setPosition(newValue);
		if (player) {
			player.seek(newValue * 1000);
		}
	};

	return (
		<div className={styles.time}>
			<StyledSlider
				aria-label='time-indicator'
				size='small'
				value={position}
				min={0}
				step={1}
				max={duration}
				color='secondary'
				onChange={handleChange}
			/>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					mt: -2,
				}}>
				<TinyText>{formatDuration(position)}</TinyText>
				<TinyText>-{formatDuration(duration - position)}</TinyText>
			</Box>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					mt: -1,
				}}></Box>
		</div>
	);
}

export default TimeSlider;
