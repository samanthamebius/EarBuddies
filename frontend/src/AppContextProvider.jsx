import React, { useState } from "react";

export const AppContext = React.createContext({});

export function AppContextProvider({ children }) {
	const [username, setUsername] = useState("");
	const [spotifyUsername, setSpotifyUsername] = useState("");

	const context = {
		username,
		spotifyUsername,
		setUsername,
		setSpotifyUsername,
	};
	return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
}
