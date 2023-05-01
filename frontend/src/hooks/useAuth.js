import { useEffect } from "react";
import axios from "axios";
import { useLocalStorage } from "./useLocalStorage";

/**
 * Login to Spotify and get access token
 * @param {*} code
 * @returns {string} - The access token
 */
export default function useAuth(accessToken, code, current_user) {
	const [access_token, setaccess_token] = useLocalStorage(
		"access_token",
		accessToken
	);
	const [refresh_token, setrefresh_token] = useLocalStorage(
		"refresh_token", "");
	const [expires_in, setexpires_in] = useLocalStorage("expires_in", "");
	const [current_user_id, setcurrent_user_id] = useLocalStorage("current_user_id", current_user);

	useEffect(() => {
		if (!access_token && code) {
			const fetchData = async () => {
				try {
					const response = await axios.post("http://localhost:3000/api/login", {
						code,
					});
					const { access_token, refresh_token, expires_in, user_id } =
						response.data;
					setaccess_token(access_token);
					setrefresh_token(refresh_token);
					setexpires_in(expires_in);
					setcurrent_user_id(user_id);
					window.history.pushState({}, null, "/");
				} catch (error) {
					console.error(error);
					window.location = "/";
				}
			};
			fetchData();
		}
	}, [access_token, code, current_user]);


	useEffect(() => {
		if (!access_token || !code) return;

		const fetchData = async () => {
			try {
				const response = await axios.post("http://localhost:3000/api/refresh", {
					refresh_token,
				});
				const { access_token, expires_in } = response.data;
				setaccess_token(access_token);
				setexpires_in(expires_in);
			} catch (error) {
				console.error(error);
				window.location = "/";
			}
		};

		const interval = setInterval(fetchData, (expires_in - 60) * 1000);

		return () => clearInterval(interval);
	}, [
		access_token,
		code,
		refresh_token,
		expires_in,
	]);

	return access_token;
}
