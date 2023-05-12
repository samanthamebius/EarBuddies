import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * A custom hook that fetches data from the given URL. Includes functionality to determine
 * whether the data is still being loaded or not.
 * Code credit: Andrew Meads (modified)
 * @param {string} url - The URL to fetch the data from.
 * @returns {object} - An object containing the response data, isLoading boolean, and error message if any
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function useGet(url) {
	const [data, setData] = useState(null);
	const [isLoading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [refreshToggle, setRefreshToggle] = useState(false);
	const full_url = BASE_URL + url;
	const access_token = localStorage.getItem('access_token');

	useEffect(() => {
		setRefreshToggle(!refreshToggle);
	}, []);

	useEffect(() => {
		if (!access_token) {
			return;
		}
		async function fetchData() {
			setLoading(true);
			const response = await axios.get(full_url).catch((err) => {
				setError(err);
				return error;
			});
			setData(response.data);
			setLoading(false);
		}
		fetchData();
	}, [url, refreshToggle, access_token]);

	return { data, isLoading, error };
}
