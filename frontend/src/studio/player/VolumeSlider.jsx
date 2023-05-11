import React, { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import VolumeOffRoundedIcon from "@mui/icons-material/VolumeOffRounded";
import styles from "../StudioPage.module.css";
import { StyledSlider } from "./StyledSlider";

function VolumeSlider({ player, isHost }) {
	const [value, setValue] = useState(30);
	const [isMute, setMute] = useState(false);

	const handleChange = (event, newValue) => {
		setValue(newValue);
		if (player) {
			player.setVolume(newValue / 100);
		}
	};

	const handleMute = () => {
		setMute(true);
		if (player) {
			player.setVolume(0);
		}
	};

	const handleUnmute = () => {
		setMute(false);
		if (player) {
			player.setVolume(value / 100);
		}
	};

	return (
		<div className={styles.volume}>
			<Box fullwidth>
				<Stack spacing={2} direction="row" sx={{ m: 1 }} alignItems="center">
					{isMute ? (
						<VolumeOffRoundedIcon
							sx={{ "&:hover": { cursor: isHost && "pointer" } }}
							style={{ color: isHost ? "white" : "#e7bcf7", fontSize: "25px" }}
							className={styles.controlBtn}
							onClick={handleUnmute}
							disabled={!isHost}
						/>
					) : (
						<VolumeUpRoundedIcon
							sx={{ "&:hover": { cursor: isHost && "pointer" } }}
							style={{ color: isHost ? "white" : "#e7bcf7", fontSize: "25px" }}
							className={styles.controlBtn}
							onClick={handleMute}
							disabled={!isHost}
						/>
					)}
					<StyledSlider
						size="small"
						disabled={isMute || !isHost}
						className={styles.slider}
						aria-label="Volume"
						value={value}
						color="secondary"
						onChange={handleChange}
					/>
				</Stack>
			</Box>
		</div>
	);
}

export default VolumeSlider;
