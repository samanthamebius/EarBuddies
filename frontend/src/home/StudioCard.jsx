import styles from './StudioCard.module.css';
import SoundWaves from '../assets/studio_cards/soundwaves.png';
import ProfilePicImg1 from '../assets/profilepic1.png';
import GenreTag from './GenreTag';
import ListenerIcons from '../shared/ListenerIcons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

/**
 * Card displayed on homepage for each of the user's studios.
 * @param {Object} socket - Communication channel between client and server.
 * @param {Object} studio - Studio that the card is associated with.
 * @returns {JSX.Element} - JSX creating the StudioCard component.
 */
export default function StudioCard({ socket, studio }) {
	const navigate = useNavigate();
	const [hostImage, setHostImage] = useState(ProfilePicImg1);

	const isListening = studio.studioIsActive;

	const BASE_URL = import.meta.env.VITE_API_BASE_URL;
	const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL ?? '';

	const studio_id = studio._id;

	useEffect(() => {
		const fetchHostImg = async () => {
			const hostPic = await axios.get(`${BASE_URL}/api/studio/${studio_id}/host`);
			setHostImage(hostPic.data.profilePic);
		};
		fetchHostImg();
	}, []);

	const handleJoinStudio = () => {
		console.log('Joining studio ' + studio.id);
		navigate(`studio/${studio._id}`);
	};

	return (
		<div
			className={styles.studioCard}
			style={
				studio.studioPicture
					? {
							backgroundImage: `url(${IMAGE_BASE_URL}/${studio.studioPicture})`,
					  }
					: { backgroundColor: '#797979' }
			}
			onClick={() => handleJoinStudio()}>
			<div className={styles.darkLayer}>
				<div className={styles.cardContent}>
					<div className={styles.studioNameSection}>
						<h1 className={styles.studioName}>{studio.studioName}</h1>
						<img
							className={styles.soundWaves}
							src={SoundWaves}
							style={isListening ? {} : { display: 'none' }}
						/>
					</div>
					<div className={styles.genreTags}>
						{studio.studioGenres.map((genre, i) => (
							<GenreTag
								key={i}
								genre={genre}
							/>
						))}
					</div>
					<div className={styles.listeners}>
						<ListenerIcons
							studioUsers={studio.studioUsers}
							isListening={isListening}
							isHomeCard={true}
						/>
						<img
							className={styles.hostImage}
							src={hostImage}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
