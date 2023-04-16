import { useEffect } from "react";
import axios from "axios";
import { useLocalStorage } from "./useLocalStorage";

/**
 * Login to Spotify and get access token
 * @param {*} code
 * @returns {string} - The access token
 */
export default function useAuth(accessToken, code) {
	const [access_token, setaccess_token] = useLocalStorage(
		"access_token",
		accessToken
	);
	const [refresh_token, setrefresh_token] = useLocalStorage(
		"refresh_token",
		""
	);
	const [expires_in, setexpires_in] = useLocalStorage("expires_in", "");

	useEffect(() => {
		if (access_token === null && code !== null) {
			axios
				.post("http://localhost:3000/api/login", {
					code,
				})
				.then((res) => {
					setaccess_token(res.data.access_token);
					setrefresh_token(res.data.refresh_token);
					setexpires_in(res.data.expires_in);
					window.history.pushState({}, null, "/");
				})
				.catch(() => {
					window.location = "/";
				});
		}
	}, [code, access_token]);

	useEffect(() => {
		if (access_token === null && code !== null) {
			if (!refresh_token || !expires_in) return;
			const interval = setInterval(() => {
				axios
					.post("http://localhost:3000/api/refresh", {
						refresh_token,
					})
					.then((res) => {
						setaccess_token(res.data.access_token);
						setexpires_in(res.data.expires_in);
					})
					.catch(() => {
						window.location = "/";
					});
			}, (expires_in - 60) * 1000);

			return () => clearInterval(interval);
		}
	}, [refresh_token, expires_in, access_token]);

	console.log(access_token);
	return access_token;
}
