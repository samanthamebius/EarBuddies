import React, { useState, useEffect, useContext } from "react";
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

{/* HEAD */}
function SongInfo({ socket, studio }) {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [songTitle, setSongTitle] = useState('');
    const [artistName, setArtistName] = useState('');
    const [artistImg, setArtistImg] = useState('');
    const [albumArtwork, setAlbumArtwork] = useState('');


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
					const artist_id = track.data?.item?.artists[0].id;
					if (artist_id) {
					const artist = await axios.get(
						`${BASE_URL}/api/spotify/artist/${artist_id}`
					);
					setArtistImg(artist.data.images[0].url);
					}
				}

				console.log(track);
				socket.emit("send_currently_playing", {
					room: studio._id,
					track: track.data.item,
				});
        };
        fetchSongInfo();

        // Polling mechanism to update song info
        const interval = setInterval(fetchSongInfo, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, [songTitle, songNumber]);

	console.log(songTitle);
    // send the now playing song to chat only when it changes
    useEffect(() => {
        if (songTitle !== "") {
            socket.emit("send_to_chat_currently_playing", {
                room: studio._id,
                trackTitle: songTitle,
            });
        }
    }, [songTitle]);

    return (
        <div className={styles.songSection}>
            <h3 className={styles.song} style={{ display: songTitle ? "flex" : "none" }}>{songTitle}</h3>
            <div className={styles.artist} >
                <img style={{ display: artistImg ? "flex" : "none" }} className={styles.artistImg} src={artistImg} />
                <div style={{ display: artistName ? "flex" : "none" }} className={styles.artistName}>{artistName ? artistName : null}</div>
            </div>
            <img className={styles.albumArtwork} src={albumArtwork ? albumArtwork : placeholder_album} />
        </div>
    );
}

export function VolumeSlider({ player }) {
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
							sx={{ "&:hover": { cursor: "pointer" } }}
							style={{ color: "white", fontSize: "25px" }}
							className={styles.controlBtn}
							onClick={handleUnmute}
						/>
					) : (
						<VolumeUpRoundedIcon
							sx={{ "&:hover": { cursor: "pointer" } }}
							style={{ color: "white", fontSize: "25px" }}
							className={styles.controlBtn}
							onClick={handleMute}
						/>
					)}
					<StyledSlider
						size="small"
						disabled={isMute}
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

    {/* HEAD */}
export function TimeSlider({ player, queueIsEmpty }) {
    const [duration, setDuration] = useState(0);
    const [position, setPosition] = useState(0); 

    useEffect(() => {
        const fetchDuration = async () => {
            const track = await axios.get(`${BASE_URL}/api/spotify/songinfo`);
            setDuration(Math.round(track.data.item.duration_ms / 1000));
        }
        fetchDuration();
    }, []);

    useEffect(() => {
        const fetchPosition = async () => {
            axios
                .get(`${BASE_URL}/api/spotify/songinfo`)
                .then((response) => {
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
                onChange={handleChange}
                style={{ pointerEvents: queueIsEmpty ? "none" : "auto" }}
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

function ControlPanel({ studio, player, socket, queueIsEmpty}) {
    const [isPlaying, setPlaying] = useState(false);
    const navigate = useNavigate();
	const { myDeviceId } = useContext(AppContext);
    const [isInPrevious, setInPrevious] = useState(false);
    const [isInPause, setInPause] = useState(false);
    const [isInPlay, setInPlay] = useState(false);
    const [isInNext, setInNext] = useState(false);

    function spotifyPlayer({ studio, myDeviceId }) {
        try {
            axios
                .put(`${BASE_URL}/api/spotify/play`, {
                    uri: "spotify:playlist:" + studio.studioPlaylist,
                    deviceId: myDeviceId,
                })
                .then((response) => {
                    console.log(response);
					console.log(songNumber);
                })
                .catch((error) => {
                    navigate("/400");
                });
        } catch (error) {
            console.log(error);
            navigate("/400");
        }
    }

    function spotifyPauser({ myDeviceId }) {
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
            console.log(error)
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

    function playButton(studio) {
		songNumber++;

		socket.emit("send_play_song", {
			room: studio._id,
			isPlaying: true,
			studio: studio,
		});
	}

	function pauseButton(studio) {
		songNumber++;

		socket.emit("send_pause_song", {
			room: studio._id,
			isPlaying: false,
		});
	}

	function previousButton(studio) {
		songNumber++;

		socket.emit("send_previous_song", {
			room: studio._id,
		});
	}

	function skipButton(studio) {
		songNumber++;

		socket.emit("send_skip_song", {
			room: studio._id,
			studio: studio,
		});
	}

	// socket is listening to when a song should be played
	useEffect(() => {
		socket.on("receive_play_song", (data) => {
			const { isPlaying, studio } = data;
			if (Object.keys(myDeviceId).length !== 0) {
				setPlaying(isPlaying);
				spotifyPlayer(studio, myDeviceId);
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
				spotifyPauser(myDeviceId);
			}
			console.log("received pause");
		});
	}, [socket, myDeviceId]);

	// socket is listening to when a song should be skipped
	useEffect(() => {
		socket.on("receive_previous_song", () => {
			if (Object.keys(myDeviceId).length !== 0) {
				spotifyPrevious(myDeviceId);
			}
			console.log("received previous");
		});
	}, [socket, myDeviceId]);

	// socket is listening to when a song should go back to the previous song
	useEffect(() => {
		socket.on("receive_skip_song", (data) => {
			const { studio } = data;
			if (Object.keys(myDeviceId).length !== 0) {
				spotifyNext(myDeviceId, studio);
			}
			console.log("received skip");
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
                    sx={{ "&:hover": { cursor: "pointer" } }}
                    style={{ fontSize: "40px", color: queueIsEmpty || isInPrevious ? "#e7bcf7" : "white", pointerEvents: queueIsEmpty ? "none" : "auto" }}
                    onClick={() => previousButton(studio)}
                    onMouseEnter={enterPrevious}
					onMouseLeave={leavePrevious}
                    disabled={queueIsEmpty}
                />
                {!isPlaying ? (
                    <PlayCircleFilledRoundedIcon
                        sx={{ "&:hover": { cursor: "pointer" } }}
                        style={{ fontSize: "40px", color: queueIsEmpty || isInPlay ? "#e7bcf7" : "white", pointerEvents: queueIsEmpty ? "none" : "auto" }}
                        onClick={() => playButton(studio)}
                        onMouseEnter={enterPlay}
					    onMouseLeave={leavePlay}
                        disabled={queueIsEmpty}
                    />
                ) : (
                    <PauseCircleRoundedIcon
                        sx={{ "&:hover": { cursor: "pointer" } }}
                        style={{ fontSize: "40px", color: queueIsEmpty || isInPause ? "#e7bcf7" : "white", pointerEvents: queueIsEmpty ? "none" : "auto" }}
                        onClick={() => pauseButton(studio)}
                        onMouseEnter={enterPause}
					    onMouseLeave={leavePause}
                        disabled={queueIsEmpty}
                    />
                )}
                <SkipNextRoundedIcon
                    sx={{ "&:hover": { cursor: "pointer" } }}
                    style={{ fontSize: "40px", color: queueIsEmpty || isInNext ? "#e7bcf7" : "white", pointerEvents: queueIsEmpty ? "none" : "auto" }}
                    onClick={() => skipButton(studio)}
                    onMouseEnter={enterNext}
					onMouseLeave={leaveNext}
                    disabled={queueIsEmpty}
                />
            </div>
            <TimeSlider player={player} queueIsEmpty={queueIsEmpty}/>
            <VolumeSlider player={player} />
        </div>
    );
}

function WebPlayback(props) {
    const [player, setPlayer] = useState({});
    const { myDeviceId, setMyDeviceId } = useContext(AppContext);
    const { studio, socket, token, queueIsEmpty } = props;
    navigate = useNavigate();


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

	useEffect(() => {
		return () => {
			window.location.reload(false);
		};
	}, []);

    return (
        <>
            <div className="container">
                <div className="main-wrapper">
                    <SongInfo socket={socket} studio={studio} />
                    <ControlPanel deviceId={myDeviceId} studio={studio} player={player} socket={socket} queueIsEmpty={queueIsEmpty}/>
                </div>
            </div>
        </>
    );                  
}

export default WebPlayback;
