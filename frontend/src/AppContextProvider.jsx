import React, { useState } from "react";

export const AppContext = React.createContext({});

export function AppContextProvider({ children }) {
	const [username, setUsername] = useState("");
	const [displayName, setDisplayName] = useState("");

	const context = {
		username,
		displayName,
		setUsername,
		setDisplayName,
	};
	return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
}
