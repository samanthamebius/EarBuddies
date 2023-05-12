import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../AppContextProvider";
import ControlPanel from "./ControlPanel";
import SongInfo from "./SongInfo";

function WebPlayback(props) {
	const { studio, socket, token, queueIsEmpty, messages } = props;
	const [player, setPlayer] = useState({});
	const { myDeviceId, setMyDeviceId, username } = useContext(AppContext);
	const navigate = useNavigate();
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
