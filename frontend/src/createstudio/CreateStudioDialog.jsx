import {
	TextField,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	Tooltip,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import styles from './CreateStudioDialog.module.css';
import React, { useState } from 'react';
import FileDropZone from './FileDropZone';
import ControlSwitch from './ControlSwitch';
import AddListenersBlock from '../shared/AddListenersBlock';
import GenreTag from './GenreTag';
import { styled } from '@mui/material/styles';
import { tooltipClasses } from '@mui/material/Tooltip';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/**
 * Async function that creates a new studio by making a POST request to backend API.
 * @param {Function} navigate - Function used to navigate to new page.
 * @param {string} name - Name of studio.
 * @param {array} genres - Array of strings for genres associated to studio.
 * @param {FileList} coverPhoto - The coverphoto of studio.
 * @param {array} listeners - Array of strings representing the user IDs of listeners in studio.
 * @param {boolean} isHostOnly - Boolean indicating whether or not only host will have control.
 * @returns {object} - Object containing postStudio function.
 */
function useStudioPost() {
	const postStudio = async (
		navigate,
		name,
		genres,
		coverPhoto,
		listeners,
		isHostOnly
	) => {
		const host = JSON.parse(localStorage.getItem('current_user_id'));
		listeners.push(host);

		const BASE_URL = import.meta.env.VITE_API_BASE_URL;
		const url = `${BASE_URL}/api/studio`;
		let studioBannerImageUrl = '/images/defaultBanner.png';

		if (coverPhoto) {
			// Upload the cover photo image
			const imgUploadConfig = {
				headers: {
					'content-type': 'multipart/form-data',
				},
			};
			const imgFormData = new FormData();
			imgFormData.append('image', coverPhoto[0]);

			const imgUploadResponse = await axios.post(
				`${url}/upload-image`,
				imgFormData,
				imgUploadConfig
			);

			studioBannerImageUrl = imgUploadResponse.headers['location'];
		}

		try {
			const response = await axios.post(`${url}/new`, {
				name,
				listeners,
				host,
				genres,
				studioBannerImageUrl,
				isHostOnly,
			});
			navigate(`/studio/${response.data._id}`);
		} catch (err) {
			if (err.response.status === 403) {
				navigate('/400');
			}
			navigate('/500');
		}
	};

	return { postStudio };
}

/**
 * Component with ControlSwitch component and tooltip to display information about current state of the switch.
 * @param {boolean} checked - The current state of the switch.
 * @param {function} onChange - A function to be called when switchstate changes.
 * @returns {JSX.Element} - A JSX element that diaplays the switch component with a tooltip.
 */
function SwitchWithTooltip({ checked, onChange }) {
	const ToolTip = styled(({ className, ...props }) => (
		<Tooltip
			{...props}
			classes={{ popper: className }}
		/>
	))(({ theme }) => ({
		[`& .${tooltipClasses.arrow}`]: {
			color: theme.palette.common.white,
		},
		[`& .${tooltipClasses.tooltip}`]: {
			backgroundColor: theme.palette.common.white,
			color: 'rgba(0, 0, 0, 0.87)',
			boxShadow: theme.shadows[1],
			fontSize: 14,
			color: '#666666',
			maxWidth: '70%',
		},
	}));

	// Tooltip title dependent on checked status
	const title = checked
		? 'Only you can manage listeners'
		: 'Other users can add listeners to the studio';

	return (
		<ToolTip
			title={title}
			placement='right-end'
			arrow>
			<div className={styles.switchContainer}>
				<ControlSwitch
					checked={checked}
					onChange={(e) => onChange(e.target.checked)}
				/>
			</div>
		</ToolTip>
	);
}

/**
 * Dialog for user to create a new studio.
 * @param {boolean} isDialogOpened - Whether the dialog is open or not.
 * @param {Function} handleCloseDialog - Callback funciton to close the dialog. *
 * @returns {JSX.Element} - The JSX representation of the CreateStudioDialog component.
 */
export default function CreateStudioDialog({ isDialogOpened, handleCloseDialog }) {
	const navigate = useNavigate();
	const { postStudio } = useStudioPost();
	const [isStudioNameErrorMessage, setIsStudioNameErrorMessage] = useState(false);
	const [isGenreInputErrorMessage, setIsGenreInputErrorMessage] = useState(false);
	const [isHostOnly, setIsHostOnly] = useState(false);
	const [genreInput, setGenreInput] = useState('');
	const [studioNameInput, setStudioNameInput] = useState('');
	const [listeners, setNewStudioListeners] = useState([]);
	const [genres, setGenres] = useState([
		{ name: 'Rap', isSelected: false },
		{ name: 'Rock', isSelected: false },
		{ name: 'K-Pop', isSelected: false },
		{ name: 'Country', isSelected: false },
		{ name: 'Classical', isSelected: false },
		{ name: 'R&B', isSelected: false },
		{ name: 'Jazz', isSelected: false },
		{ name: 'Pop', isSelected: false },
	]);
	const [file, setFile] = useState(null);

	const handleFileChange = (selectedFile) => {
		setFile(selectedFile);
	};

	const handleSwitchToggle = (isChecked) => {
		setIsHostOnly(isChecked);
		axios.put(`${BASE_URL}/api/studio/${studioId}/isHostOnly`);
	};

	function toggleGenre(genre) {
		const newGenres = genres.map((obj, i) => {
			if (obj.name === genre) {
				return { ...obj, isSelected: !obj.isSelected };
			}
			return obj;
		});
		setGenres(newGenres);
	}

	function addGenre(genreInput) {
		const isFound = genres.some((obj) => {
			if (obj.name.toLowerCase() === genreInput.toLowerCase()) {
				return true;
			}
		});

		if (isFound) {
			setIsGenreInputErrorMessage(true);
		} else {
			setIsGenreInputErrorMessage(false);
			setGenres([...genres, { name: genreInput, isSelected: true }]);
			setGenreInput('');
		}
	}

	function handleSubmit() {
		if (studioNameInput == '') {
			setIsStudioNameErrorMessage(true);
		} else {
			setIsStudioNameErrorMessage(false);
			const selecetedGenres = getSelectedGenres();
			const listenerUsernames = getListenerUsernames();
			postStudio(
				navigate,
				studioNameInput,
				selecetedGenres,
				file,
				listenerUsernames,
				isHostOnly
			);
		}
	}

	function getSelectedGenres() {
		const selectedGenres = genres.filter((obj) => obj.isSelected);
		const selectedGenreNames = selectedGenres.map((obj) => obj.name);
		return selectedGenreNames;
	}

	function getListenerUsernames() {
		const usernames = listeners.map((listener) => listener.username);
		return usernames;
	}

	const handleClose = () => {
		handleCloseDialog(false);
	};

	function handleKeyPress(event, genreInput) {
		if (event.key == 'Enter') {
			addGenre(genreInput);
		}
	}

	const theme = createTheme({
		palette: {
			secondary: {
				main: '#CA3FF3',
			},
		},
	});

	return (
		<div>
			<Dialog
				fullWidth
				maxWidth='md'
				open={isDialogOpened}
				onClose={handleClose}
				PaperProps={{ style: { backgroundColor: 'var(--dialogColor)' } }}>
				<h1 className={styles.heading}>Create Studio</h1>
				<DialogContent>
					{/* Studio name */}
					<h2 className={styles.sectionHeading}>
						Studio Name<span className={styles.focusText}>*</span>
					</h2>
					<ThemeProvider theme={theme}>
						<TextField
							color='secondary'
							value={studioNameInput}
							error={isStudioNameErrorMessage ? true : false}
							helperText={
								isStudioNameErrorMessage ? 'No Studio Name Entry' : ''
							}
							FormHelperTextProps={{
								style: { backgroundColor: 'var(--dialogColor)' },
							}}
							required
							margin='dense'
							id='name'
							label='Enter a Studio Name ...'
							type='text'
							fullWidth
							variant='outlined'
							onChange={(event) => setStudioNameInput(event.target.value)}
							className={styles.textfield}
							autoComplete='off'
							InputLabelProps={{
								style: { color: 'var(--headingColor)' },
							}}
							InputProps={{
								style: { color: 'var(--headingColor)' },
							}}
						/>
					</ThemeProvider>

					{/* Cover photo */}
					<h2 className={styles.sectionHeading}>Cover Photo</h2>

					{/* File Drop Zone */}
					<FileDropZone onFileChange={handleFileChange} />
					<h2 className={styles.sectionHeading}>Genres</h2>
					{genres.map((genre, i) => (
						<GenreTag
							key={i}
							genre={genre.name}
							handleClick={() => toggleGenre(genre.name)}
							isSelected={genre.isSelected}
						/>
					))}
					<div className={styles.addGenreSection}>
						<ThemeProvider theme={theme}>
							<TextField
								color='secondary'
								margin='dense'
								id='genres'
								label='Add your own genres ...'
								type='text'
								fullWidth
								variant='outlined'
								value={genreInput}
								onChange={(event) => setGenreInput(event.target.value)}
								className={styles.textfield}
								autoComplete='off'
								onKeyDown={(event) => handleKeyPress(event, genreInput)}
								error={isGenreInputErrorMessage ? true : false}
								helperText={
									isGenreInputErrorMessage
										? 'Input is already a genre option'
										: ''
								}
								FormHelperTextProps={{
									style: { backgroundColor: 'var(--dialogColor)' },
								}}
								InputLabelProps={{
									style: { color: 'var(--headingColor)' },
								}}
								InputProps={{
									style: { color: 'var(--headingColor)' },
								}}
							/>
						</ThemeProvider>
						<span className={styles.spacing}></span>
						<Button
							sx={{ fontWeight: 600 }}
							variant='contained'
							onClick={() => addGenre(genreInput)}>
							Add
						</Button>
					</div>

					{/* Control Setting */}
					<div className={styles.controlSection}>
						<h2 className={styles.sectionHeading}>Only I Have Control</h2>
						<SwitchWithTooltip
							checked={isHostOnly}
							onChange={handleSwitchToggle}
						/>
					</div>

					<AddListenersBlock
						studio={null}
						setNewStudioListeners={setNewStudioListeners}
					/>
				</DialogContent>
				<DialogActions
					sx={{ display: 'flex', justifyContent: 'center', mb: 1.5 }}
					className={styles.buttons}>
					<Button
						sx={{ fontWeight: 600, color: '#757575' }}
						variant='contained'
						className={styles.cancelButton}
						onClick={handleClose}>
						Cancel
					</Button>
					<Button
						sx={{ fontWeight: 600 }}
						variant='contained'
						className={styles.createButton}
						onClick={handleSubmit}>
						Create Studio
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
