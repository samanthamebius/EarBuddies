import React, { useState, useEffect } from 'react';
import StudioCard from './StudioCard';
import styles from './HomePage.module.css';
import Button from '@mui/material/Button';
import SoundWavesGradient from '../assets/home/soundwavesgradient.png';
import SearchBar from '../shared/SearchBar';
import CreateStudioDialog from '../createstudio/CreateStudioDialog';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import axios from 'axios';

/**
 * Home page shown when user successfully logs in
 * @param {Object} socket - Communication channel between client and server
 * @returns {JSX.Element} - A JSX element that diaplays the home page.
 */
function HomePage({ socket }) {
	const BASE_URL = import.meta.env.VITE_API_BASE_URL;
	const current_user = localStorage.getItem('current_user_id');
	const id = JSON.parse(current_user);
	const [studios, setStudios] = useState([]);
	const [activeStudios, setActiveStudios] = useState([]);
	const [studioSearchResults, setStudioSearchResults] = useState([]);
	const [studioSearchTerm, setStudioSearchTerm] = useState('');
	const [activeStudioSearchResults, setActiveStudioSearchResults] = useState([]);
	const [activeStudioSearchTerm, setActiveStudioSearchTerm] = useState('');

	// Get Studios
	useEffect(() => {
		const fetchStudios = async () => {
			const response = await axios.get(`${BASE_URL}/api/home/${id}/studios`);
			setStudios(response.data);
		};
		fetchStudios();
	}, []);

	// Get Active Studios
	useEffect(() => {
		const fetchActiveStudios = async () => {
			const response = await axios.get(`${BASE_URL}/api/user/${id}/active`);
			setActiveStudios(response.data);
		};
		fetchActiveStudios();
	}, []);

	const [isOpen, setIsOpen] = useState(false);

	const handleOpen = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div className={styles.container}>
			<div
				className={styles.containerChild}
				style={{ marginRight: '45px' }}>
				<div className={styles.header}>
					<h1 className={styles.headings}>My Studios</h1>
					<div className={styles.headerChild}>
						<CreateStudioDialog
							isDialogOpened={isOpen}
							handleCloseDialog={() => setIsOpen(false)}
						/>
						<Button
							sx={{ fontWeight: 600 }}
							variant='contained'
							size='large'
							className={styles.button}
							onClick={() => handleOpen()}>
							<AddRoundedIcon sx={{ pr: 1 }} /> Create Studio
						</Button>
					</div>
				</div>
				<SearchBar
					searchType={'studios'}
					label={'Search My Studios ...'}
					studioId={''}
					setResults={setStudioSearchResults}
					onInputChange={setStudioSearchTerm}
				/>
				<div className={styles.cardContainer}>
					{studioSearchResults.length === 0 && !studioSearchTerm
						? studios.map((studio) => (
								<StudioCard
									key={studio.studioName}
									socket={socket}
									studio={studio}
								/>
						  ))
						: studioSearchResults.map((studio) => (
								<StudioCard
									key={studio.studioName}
									socket={socket}
									studio={studio}
								/>
						  ))}
				</div>
			</div>
			<div className={styles.containerChild}>
				<div className={styles.header}>
					<h1 className={styles.headings}>Listening Now</h1>
					<div className={styles.headerChild}>
						<img
							src={SoundWavesGradient}
							className={styles.soundWaves}
							alt='Pink sound waves'></img>
					</div>
				</div>
				<SearchBar
					searchType={'activeStudios'}
					label={'Search Studios Listening Now ...'}
					studioId={''}
					setResults={setActiveStudioSearchResults}
					onInputChange={setActiveStudioSearchTerm}
				/>
				<div className={styles.cardContainer}>
					{activeStudioSearchResults.length === 0 && !activeStudioSearchTerm
						? activeStudios.map((studio) => (
								<StudioCard
									key={studio.studioName}
									socket={socket}
									studio={studio}
								/>
						  ))
						: activeStudioSearchResults.map((studio) => (
								<StudioCard
									key={studio.studioName}
									socket={socket}
									studio={studio}
								/>
						  ))}
				</div>
			</div>
		</div>
	);
}
export default HomePage;
