import React, { useState } from "react";

export const AppContext = React.createContext({});

export function AppContextProvider({ children }) {
	const [username, setUsername] = useState("");
	const [displayName, setDisplayName] = useState("");
	const [player, setPlayer] = useState(null);

	const context = {
		username,
		displayName,
		player,
		setUsername,
		setDisplayName,
		setPlayer,
	};
	return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
}
