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
		"refresh_token", "");
	const [expires_in, setexpires_in] = useLocalStorage("expires_in", "");
	console.log("in useAuth");

	// useEffect(() => {
	// 	console.log("in useAuth useEffect");
	// }, [console.log]);

	useEffect(() => {
		if (!access_token && code) {
			console.log("in useAuth useEffect")
		const fetchData = async () => {
			try {
				const response = await axios.post("http://localhost:3000/api/login", {
					code,
				});
				const { access_token, refresh_token, expires_in } = response.data;
				setaccess_token(access_token);
				setrefresh_token(refresh_token);
				setexpires_in(expires_in);
				window.history.pushState({}, null, "/");
			} catch (error) {
				console.error(error);
				window.location = "/";
			}
		};
		fetchData();
		}
	}, [access_token, code, setaccess_token, setrefresh_token, setexpires_in]);

	// useEffect(() => {
	// 	console.log("in useAuth useEffect");
	// 	if (access_token === null && code !== null) {
	// 		axios
	// 			.post("http://localhost:3000/api/login", {
	// 				code,
	// 			})
	// 			.then((res) => {
	// 				setaccess_token(res.data.access_token);
	// 				setrefresh_token(res.data.refresh_token);
	// 				setexpires_in(res.data.expires_in);
	// 				window.history.pushState({}, null, "/");
	// 			})
	// 			.catch(() => {
	// 				window.location = "/";
	// 			});
	// 	}
	// }, [code, access_token]);

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
		setaccess_token,
		setexpires_in,
	]);

	// useEffect(() => {
	// 	if (access_token === null && code !== null) {
	// 		if (!refresh_token || !expires_in) return;
	// 		const interval = setInterval(() => {
	// 			axios
	// 				.post("http://localhost:3000/api/refresh", {
	// 					refresh_token,
	// 				})
	// 				.then((res) => {
	// 					setaccess_token(res.data.access_token);
	// 					setexpires_in(res.data.expires_in);
	// 				})
	// 				.catch(() => {
	// 					window.location = "/";
	// 				});
	// 		}, (expires_in - 60) * 1000);

	// 		return () => clearInterval(interval);
	// 	}
	// }, [refresh_token, expires_in, access_token]);
	return access_token;
}
