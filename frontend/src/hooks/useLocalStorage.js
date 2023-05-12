import { useState, useEffect } from 'react';

/**
 * A custom hook wrapping a call to useState() to provide a stateful value, along with a call to useEffect()
 * which saves that value to local storage.
 * @param {string} key - The key to use when storing the value in local storage.
 * @param {*} [initialValue=null] - The initial value to use when there is no existing value in local storage.
 * @returns {Array} - An array containing the current value and a function to update the value.
 */
export function useLocalStorage(key, initialValue = null) {
	const [value, setValue] = useState(() => {
		try {
			const data = window.localStorage.getItem(key);
			return data ? JSON.parse(data) : initialValue;
		} catch {
			return initialValue;
		}
	});

	useEffect(() => {
		window.localStorage.setItem(key, JSON.stringify(value));
	}, [key, value, setValue]);

	return [value, setValue];
}
