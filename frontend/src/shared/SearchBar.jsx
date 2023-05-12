import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, InputAdornment, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ClearRounded from '@mui/icons-material/ClearRounded';
import styles from './SearchBar.module.css';
import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * A component that renders a search bar used throughout web application.
 * @param {string} label - The label for the search bar.
 * @param {string} searchType - The type of content to search (e.g. "artists", "songs", "playlists").
 * @param {*studioId} studioId - The ID of the studio to search in (optional).
 * @param {Function} setResults - A function to set the search results.
 * @param {Function} onInputChange - A function to handle input changes in the search bar.
 * @param {string|null} playlist_id - The ID of the playlist to search in (optional for search bar in other use cases).
 * @returns {JSX.Element} - A JSX element representing the search bar component.
 */
function SearchBar({
	label,
	searchType,
	studioId,
	setResults,
	onInputChange,
	playlist_id = null,
}) {
	const [focused, setFocused] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const navigate = useNavigate();
	const BASE_URL = import.meta.env.VITE_API_BASE_URL;
	const username = localStorage.getItem('current_user_id');

	const theme = createTheme({
		palette: {
			secondary: {
				main: '#CA3FF3',
			},
		},
	});

	const searchUsers = () => {
		try {
			axios
				.get(
					`${BASE_URL}/api/user/users/${username.replace(
						/['"]+/g,
						''
					)}/${searchTerm}`
				)
				.then((response) => {
					setResults(response.data);
				})
				.catch((error) => {
					return <p>Could not load search</p>;
				});
		} catch (error) {
			console.log(error.msg);
		}
	};

	const searchStudioUsers = () => {
		try {
			axios
				.get(
					`${BASE_URL}/api/user/users/${username.replace(
						/['"]+/g,
						''
					)}/${searchTerm}/${studioId}`
				)
				.then((response) => {
					setResults(response.data);
				})
				.catch((error) => {
					return <p>Could not load search</p>;
				});
		} catch (error) {
			console.log(error.msg);
		}
	};

	const searchStudios = () => {
		try {
			axios
				.get(
					`${BASE_URL}/api/user/${username.replace(
						/['"]+/g,
						''
					)}/studios/${searchTerm}`
				)
				.then((response) => {
					setResults(response.data);
				})
				.catch((error) => {
					return <p>Could not load search</p>;
				});
		} catch (error) {
			console.log(error.msg);
		}
	};

	const searchActiveStudios = () => {
		try {
			axios
				.get(
					`${BASE_URL}/api/user/${username.replace(
						/['"]+/g,
						''
					)}/active/${searchTerm}`
				)
				.then((response) => {
					setResults(response.data);
				})
				.catch((error) => {
					return <p>Could not load search</p>;
				});
		} catch (error) {
			console.log(error.msg);
		}
	};

	const searchSongs = () => {
		try {
			axios
				.get(`${BASE_URL}/api/spotify/search/${playlist_id}/${searchTerm}`)
				.then((response) => {
					setResults(response.data);
				})
				.catch((error) => {
					localStorage.removeItem('access_token');
					localStorage.removeItem('refresh_token');
					localStorage.removeItem('expires_in');
					localStorage.removeItem('current_user_id');
					navigate('/login');
					return <p>Could not load search</p>;
				});
		} catch (error) {
			console.log(error.msg);
		}
	};

	const handleCancel = () => {
		setSearchTerm('');
		try {
			setResults([]);
		} catch (error) {
			console.log(error.msg);
		}
	};

	// Determines what to search depending on searchType param
	useEffect(() => {
		if (searchTerm.trim().length > 0) {
			if (searchType === 'users') {
				searchUsers();
			} else if (searchType === 'studios') {
				searchStudios();
			} else if (searchType === 'activeStudios') {
				searchActiveStudios();
			} else if (searchType === 'studioUsers') {
				searchStudioUsers();
			} else if (searchType === 'songs') {
				searchSongs();
			}
		} else {
			handleCancel();
		}
	}, [searchTerm]);

	return (
		<Container
			disableGutters={true}
			className={styles.searchBar}>
			<ThemeProvider theme={theme}>
				<TextField
					autoComplete='off'
					color='secondary'
					id='search'
					type='text'
					label={label}
					value={searchTerm}
					onChange={(event) => {
						setSearchTerm(event.target.value);
						onInputChange(event.target.value);
					}}
					onFocus={() => {
						setFocused(true);
						setSearchTerm('');
					}}
					onBlur={() => setFocused(false)}
					fullWidth
					InputProps={{
						style: { color: 'var(--headingColor)' },
						startAdornment: (
							<SearchRoundedIcon
								style={{ color: 'var(--iconColor)' }}
								position='start'
								className={styles.searchIcon}
							/>
						),
						endAdornment: (
							<InputAdornment position='end'>
								{searchTerm.length > 0 && (
									<ClearRounded
										style={{ color: '#757575' }}
										className={styles.clearIcon}
										onClick={handleCancel}
									/>
								)}
							</InputAdornment>
						),
					}}
					InputLabelProps={{
						shrink: focused || searchTerm.length > 0,
						style: {
							marginLeft: searchTerm || focused ? 0 : 30,
							color: 'var(--headingColor)',
						},
					}}
				/>
			</ThemeProvider>
		</Container>
	);
}

export default SearchBar;
