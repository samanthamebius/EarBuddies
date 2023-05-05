import React, { useState, useEffect } from "react";
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
import album_artwork from "../assets/now_playing/album_artwork_PLACEHOLDER.png";
import artist_profile from "../assets/now_playing/artist_profile_PLACEHOLDER.png";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

function SongInfo() {
    return (
        <div className={styles.songSection}>
            <h3 className={styles.song}>champagne problems</h3>
            <div className={styles.artist}>
                <img className={styles.artistImg} src={artist_profile} />
                <div className={styles.artistName}>Taylor Swift</div>
            </div>
            <img className={styles.albumArtwork} src={album_artwork} />
        </div>
    );
}

function spotifyPlayer({ studio, deviceId }) {
    try {
        axios
            .put(`${BASE_URL}/api/spotify/play`, {
                uri: "spotify:playlist:" + studio.studioPlaylist,
                deviceId: deviceId,
            })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("expires_in");
                localStorage.removeItem("current_user_id");
                navigate("/login");
                return <p>Could not play track</p>;
            });
    } catch (error) {
        console.log(error);
    }
}

export function VolumeSlider() {
    const [value, setValue] = useState(30);
    const [isMute, setMute] = useState(false);

    const handleChange = (event, newValue) => {
        setValue(newValue);
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
                            onClick={() => setMute(!isMute)}
                        />
                    ) : (
                        <VolumeUpRoundedIcon
                            sx={{ "&:hover": { cursor: "pointer" } }}
                            style={{ color: "white", fontSize: "25px" }}
                            className={styles.controlBtn}
                            onClick={() => setMute(!isMute)}
                        />
                    )}
                    <StyledSlider
                        disabled={isMute}
                        className={styles.slider}
                        aria-label="Volume"
                        value={value}
                        onChange={handleChange}
                    />
                </Stack>
            </Box>
        </div>
    );
}

export function TimeSlider() {
    const duration = 200; //seconds
    const [position, setPosition] = useState(32);

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
                onChange={(_, value) => setPosition(value)}
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

function ControlPanel({ deviceId, studio }) {
    const [isPlaying, setPlaying] = useState(false);

    function playButton({ studio, deviceId }) {
        console.log(deviceId);
        setPlaying(!isPlaying);
        spotifyPlayer({ studio, deviceId });
    }

    return (
        <div className={styles.controlPanel}>
            <div className={styles.playbackCntrls}>
                <SkipPreviousRoundedIcon
                    sx={{ "&:hover": { cursor: "pointer" } }}
                    style={{ color: "white", fontSize: "40px" }}
                />
                {isPlaying ? (
                    <PlayCircleFilledRoundedIcon
                        sx={{ "&:hover": { cursor: "pointer" } }}
                        style={{ color: "white", fontSize: "40px" }}
                        onClick={() =>
                            playButton((studio = { studio }), (deviceId = { deviceId }))
                        }
                    />
                ) : (
                    <PauseCircleRoundedIcon
                        sx={{ "&:hover": { cursor: "pointer" } }}
                        style={{ color: "white", fontSize: "40px" }}
                        onClick={() => setPlaying(!isPlaying)}
                    />
                )}
                <SkipNextRoundedIcon
                    sx={{ "&:hover": { cursor: "pointer" } }}
                    style={{ color: "white", fontSize: "40px" }}
                />
            </div>
            <TimeSlider />
            <VolumeSlider />
        </div>
    );
}

function WebPlayback(props) {
    const [player, setPlayer] = useState({});
    const [myDeviceId, setDeviceId] = useState({});

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        //add try catch around here for access token expiry check
        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: "EarBuddies",
                getOAuthToken: (cb) => {
                    cb(props.token);
                },
                volume: 0.5,
            });

            setPlayer(player);

            player.addListener("ready", ({ device_id }) => {
                console.log("Ready with Device ID", device_id);
                setDeviceId(device_id);
            });

            player.addListener("not_ready", ({ device_id }) => {
                console.log("Device ID has gone offline", device_id);
            });

            player.connect();
        };
    }, []);

    console.log(myDeviceId);

    return (
        <>
            <div className="container">
                <div className="main-wrapper">
                    <SongInfo />
                    <ControlPanel deviceId={myDeviceId} studio={props.studio} />
                </div>
            </div>
        </>
    );
}

export default WebPlayback;
