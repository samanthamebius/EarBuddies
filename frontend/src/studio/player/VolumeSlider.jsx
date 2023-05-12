import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded';
import VolumeOffRoundedIcon from '@mui/icons-material/VolumeOffRounded';

import styles from '../StudioPage.module.css';
import { StyledSlider } from './StyledSlider';

/**
 *
 * @param player - The current player in the browser
 * @param isHost - Boolean to check if the current user is the host
 */
function VolumeSlider({ player, isHost }) {
	const [value, setValue] = useState(30);
	const [isMute, setMute] = useState(false);

	// Set the current volume
	const handleChange = (event, newValue) => {
		setValue(newValue);
		if (player) {
			player.setVolume(newValue / 100);
		}
	};

	// Mute the current song
	const handleMute = () => {
		setMute(true);
		if (player) {
			player.setVolume(0);
		}
	};

	// Unmute the current song
	const handleUnmute = () => {
		setMute(false);
		if (player) {
			player.setVolume(value / 100);
		}
	};

	return (
		<div className={styles.volume}>
			<Box fullwidth>
				<Stack
					spacing={2}
					direction='row'
					sx={{ m: 1 }}
					alignItems='center'>
					{isMute ? (
						<VolumeOffRoundedIcon
							sx={{ '&:hover': { cursor: isHost && 'pointer' } }}
							style={{
								color: isHost ? 'white' : '#e7bcf7',
								fontSize: '25px',
							}}
							className={styles.controlBtn}
							onClick={isHost ? () => handleUnmute() : undefined}
							disabled={!isHost}
						/>
					) : (
						<VolumeUpRoundedIcon
							sx={{ '&:hover': { cursor: isHost && 'pointer' } }}
							style={{
								color: isHost ? 'white' : '#e7bcf7',
								fontSize: '25px',
							}}
							className={styles.controlBtn}
							onClick={isHost ? () => handleMute() : undefined}
							disabled={!isHost}
						/>
					)}
					<StyledSlider
						size='small'
						disabled={isMute || !isHost}
						className={styles.slider}
						aria-label='Volume'
						value={value}
						color='secondary'
						onChange={handleChange}
					/>
				</Stack>
			</Box>
		</div>
	);
}

export default VolumeSlider;
