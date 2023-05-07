import React, { useState } from "react";

export const AppContext = React.createContext({});

export function AppContextProvider({ children }) {
	const [username, setUsername] = useState("");
	const [displayName, setDisplayName] = useState("");
	const [myDeviceId, setMyDeviceId] = useState({});

	const context = {
		username,
		displayName,
		myDeviceId,
		setUsername,
		setDisplayName,
		setMyDeviceId,
	};
	return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
}
