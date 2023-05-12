import React, { useState } from 'react';

export const AppContext = React.createContext({});

/**
 * Provides context about application state to children elements.
 * @param {ReactNode} children - Child components to be rendered with knowledge of the app context.
 * @returns {JSX.Element} - The JSX representation of the AppContextProvider component.
 */
export function AppContextProvider({ children }) {
	const [username, setUsername] = useState('');
	const [displayName, setDisplayName] = useState('');
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
