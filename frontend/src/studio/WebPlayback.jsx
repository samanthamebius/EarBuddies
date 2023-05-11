import React, { useState, useEffect, useContext } from "react";
import { v4 as uuid } from "uuid";
import Slider from "@mui/material/Slider";
import styles from "./StudioPage.module.css";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import PlayCircleFilledRoundedIcon from "@mui/icons-material/PlayCircleFilledRounded";
import PauseCircleRoundedIcon from "@mui/icons-material/PauseCircleRounded";
import SkipNextRoundedIcon from "@mui/icons-material/SkipNextRounded";
import SkipPreviousRoundedIcon from "@mui/icons-material/SkipPreviousRounded";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import VolumeOffRoundedIcon from "@mui/icons-material/VolumeOffRounded";
import placeholder_album from "../assets/now_playing/placeholder_album.png";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../AppContextProvider";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
let navigate;
let songNumber = 0;

const StyledSlider = styled(Slider)({
	color: "#ffffff",
	height: 4,
	"& .MuiSlider-thumb": {
		width: 8,
		height: 8,
		transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
		"&:before": {
			boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
		},
		"&:hover, &.Mui-focusVisible": {},
		"&.Mui-active": {
			width: 20,
			height: 20,
		},
	},
	"& .MuiSlider-rail": {
		opacity: 0.28,
	},
});

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
		const interval = setInterval(fetchSongInfo, 1000);

		// Cleanup interval on component unmount
		return () => clearInterval(interval);
	}, [songTitle, songNumber]);

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

export function VolumeSlider({ player, isHost }) {
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

export function TimeSlider(props) {
	const { player, queueIsEmpty, isHost } = props;
	const [duration, setDuration] = useState(0);
	const [position, setPosition] = useState(0);

	// PUT THIS BACK IN
	// useEffect(() => {
	// 	const fetchDuration = async () => {
	// 		const track = await axios.get(`${BASE_URL}/api/spotify/songinfo`);
	// 		setDuration(Math.round(track.data.item.duration_ms / 1000));
	// 	};
	// 	fetchDuration();
	// }, []);

	// useEffect(() => {
	// 	const fetchPosition = async () => {
	// 		axios.get(`${BASE_URL}/api/spotify/songinfo`).then((response) => {
	// 			setPosition(Math.round(response.data.progress_ms / 1000));
	// 		});
	// 	};
	// 	fetchPosition();

	// 	// Polling mechanism to continuously update position
	// 	const interval = setInterval(fetchPosition, 1000);

	// 	// Cleanup interval on component unmount
	// 	return () => clearInterval(interval);
	// }, []);

	const TinyText = styled(Typography)({
		fontSize: "0.75rem",
		opacity: 0.38,
		fontWeight: 500,
		letterSpacing: 0.2,
		color: "white",
	});

	function formatDuration(value) {
		const minute = Math.floor(value / 60);
		const secondLeft = value - minute * 60;
		return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
	}

	const handleChange = (event, newValue) => {
		setPosition(newValue);
		if (player) {
			player.seek(newValue * 1000);
		}
	};

	return (
		<div className={styles.time}>
			<StyledSlider
				aria-label="time-indicator"
				size="small"
				value={position}
				min={0}
				step={1}
				max={duration}
				color="secondary"
				onChange={isHost ? () => handleChange() : undefined}
				style={{ pointerEvents: queueIsEmpty ? "none" : "auto" }}
				disabled={!isHost}
			/>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					mt: -2,
				}}
			>
				<TinyText>{formatDuration(position)}</TinyText>
				<TinyText>-{formatDuration(duration - position)}</TinyText>
			</Box>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					mt: -1,
				}}
			></Box>
		</div>
	);
}

function ControlPanel(props) {
	const { studio, player, socket, queueIsEmpty, isHost } = props;
	const [isPlaying, setPlaying] = useState(false);
	const navigate = useNavigate();
	const { myDeviceId, username } = useContext(AppContext);
	const [isInPrevious, setInPrevious] = useState(false);
	const [isInPause, setInPause] = useState(false);
	const [isInPlay, setInPlay] = useState(false);
	const [isInNext, setInNext] = useState(false);

	function spotifyPlayer(studio, myDeviceId) {
		try {
			axios
				.put(`${BASE_URL}/api/spotify/play`, {
					uri: "spotify:playlist:" + studio?.studioPlaylist,
					deviceId: myDeviceId,
				})
				.then((response) => {
					console.log(response);
				})
				.catch((error) => {
					navigate("/400");
				});
		} catch (error) {
			console.log(error);
			navigate("/400");
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
					navigate("/400");
				});
		} catch (error) {
			console.log(error);
			navigate("/400");
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
					navigate("/400");
				});
		} catch (error) {
			console.log(error);
			navigate("/400");
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
					navigate("/400");
				});
		} catch (error) {
			console.log(error);
			navigate("/400");
		}
	}

	console.log(studio);

	function playButton(studio) {
		songNumber++;
		// only play if host
		if (isHost) {
			console.log("playing");
			spotifyPlayer(studio, myDeviceId);
		}
		socket.emit("send_play_song", {
			room: studio._id,
			isPlaying: true,
		});
	}

	function pauseButton(studio) {
		songNumber++;
		// only pause if host
		if (isHost) {
			spotifyPauser(myDeviceId);
		}
		socket.emit("send_pause_song", {
			room: studio._id,
			isPlaying: false,
		});
	}

	function previousButton() {
		songNumber++;
		if (isHost) {
			spotifyPrevious(myDeviceId);
		}
	}

	function skipButton(studio) {
		songNumber++;
		if (isHost) {
			spotifyNext(myDeviceId, studio);
		}
	}

	// socket is listening to when a song should be played
	useEffect(() => {
		socket.on("receive_play_song", (data) => {
			const { isPlaying } = data;
			if (Object.keys(myDeviceId).length !== 0) {
				setPlaying(isPlaying);
			}
			console.log("received play");
		});
	}, [socket, myDeviceId]);

	// socket is listening to when a song should be paused
	useEffect(() => {
		socket.on("receive_pause_song", (data) => {
			const { isPlaying } = data;
			if (Object.keys(myDeviceId).length !== 0) {
				setPlaying(isPlaying);
			}
			console.log("received pause");
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
					sx={{ "&:hover": { cursor: isHost && "pointer" } }}
					style={{
						fontSize: "40px",
						color:
							queueIsEmpty || isInPrevious || !isHost ? "#e7bcf7" : "white",
						pointerEvents: queueIsEmpty ? "none" : "auto",
					}}
					onClick={isHost ? () => previousButton() : undefined}
					onMouseEnter={enterPrevious}
					onMouseLeave={leavePrevious}
					disabled={queueIsEmpty || !isHost}
				/>
				{!isPlaying ? (
					<PlayCircleFilledRoundedIcon
						sx={{ "&:hover": { cursor: isHost && "pointer" } }}
						style={{
							fontSize: "40px",
							color: queueIsEmpty || isInPlay || !isHost ? "#e7bcf7" : "white",
							pointerEvents: queueIsEmpty ? "none" : "auto",
						}}
						onClick={isHost ? () => playButton(studio) : undefined}
						onMouseEnter={enterPlay}
						onMouseLeave={leavePlay}
						disabled={queueIsEmpty || !isHost}
					/>
				) : (
					<PauseCircleRoundedIcon
						sx={{ "&:hover": { cursor: isHost && "pointer" } }}
						style={{
							fontSize: "40px",
							color: queueIsEmpty || isInPause || !isHost ? "#e7bcf7" : "white",
							pointerEvents: queueIsEmpty ? "none" : "auto",
						}}
						onClick={isHost ? () => pauseButton(studio) : undefined}
						onMouseEnter={enterPause}
						onMouseLeave={leavePause}
						disabled={queueIsEmpty || !isHost}
					/>
				)}
				<SkipNextRoundedIcon
					sx={{ "&:hover": { cursor: isHost && "pointer" } }}
					style={{
						fontSize: "40px",
						color: queueIsEmpty || isInNext || !isHost ? "#e7bcf7" : "white",
						pointerEvents: queueIsEmpty ? "none" : "auto",
					}}
					onClick={isHost ? () => skipButton(studio) : undefined}
					onMouseEnter={enterNext}
					onMouseLeave={leaveNext}
					disabled={queueIsEmpty || !isHost}
				/>
			</div>
			<TimeSlider player={player} queueIsEmpty={queueIsEmpty} isHost={isHost} />
			<VolumeSlider player={player} isHost={isHost} />
		</div>
	);
}

function WebPlayback(props) {
	const { studio, socket, token, queueIsEmpty, messages } = props;
	const [player, setPlayer] = useState({});
	const { myDeviceId, setMyDeviceId, username } = useContext(AppContext);
	navigate = useNavigate();
	const isHost = username === studio.studioHost;

	useEffect(() => {
		const script = document.createElement("script");
		script.src = "https://sdk.scdn.co/spotify-player.js";
		script.async = true;

		document.body.appendChild(script);

		//add try catch around here for access token expiry check
		try {
			window.onSpotifyWebPlaybackSDKReady = () => {
				const player = new window.Spotify.Player({
					name: "EarBuddies",
					getOAuthToken: (cb) => {
						cb(token);
					},
					volume: 0.5,
				});

				setPlayer(player);

				player.addListener("ready", ({ device_id }) => {
					console.log("Ready with Device ID", device_id);
					setMyDeviceId(device_id);
				});

				player.addListener("not_ready", ({ device_id }) => {
					console.log("Device ID has gone offline", device_id);
				});

				player.connect();
			};
		} catch (error) {
			console.log(error);
			navigate("/400");
		}
	}, []);

	console.log(myDeviceId);

	// disconnect the player when the component dismounts
	useEffect(() => {
		return () => {
			window.location.reload(false);
		};
	}, []);

	return (
		<>
			<div className="container">
				<div className="main-wrapper">
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
