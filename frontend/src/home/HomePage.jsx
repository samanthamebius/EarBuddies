import React, { useState, useEffect } from "react";
import StudioCard from "./StudioCard";
import styles from "./HomePage.module.css";
import Button from "@mui/material/Button";
import SoundWavesGradient from "../assets/home/soundwavesgradient.png";
import SearchBar from "../shared/SearchBar";
import CreateStudioDialog from "../createstudio/CreateStudioDialog";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import axios from "axios";

const mockStudios = [
	{
		id: 1,
		studioName: `smeb's studio`,
		studioIsActive: true,
		studioGenres: ["rock", "pop", "jazz"],
	},
	{
		id: 2,
		studioName: `smeb's studio`,
		studioIsActive: true,
		studioGenres: ["rock", "pop", "jazz"],
	},
	{
		id: 3,
		studioName: `smeb's studio`,
		studioIsActive: false,
		studioGenres: ["rock", "pop", "jazz"],
	},
	{
		id: 4,
		studioName: `smeb's studio`,
		studioIsActive: false,
		studioGenres: ["rock", "pop", "jazz"],
	},
];

function HomePage(props) {
	const BASE_URL = import.meta.env.VITE_API_BASE_URL;
	const current_user = localStorage.getItem("current_user_id");
	const id = JSON.parse(current_user);
	const [studios, setStudios] = useState([]);

	useEffect(() => {
		const fetchStudios = async () => {
			const response = await axios.get(`${BASE_URL}/api/home/${id}/studios`);
			setStudios(response.data);
			console.log("name " + studios[0].studioName);
		}
		fetchStudios();
	},[]);

	const { socket } = props;
	const [isOpen, setIsOpen] = useState(false);

	const handleOpen = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div className={styles.container}>
			<div className={styles.containerChild} style={{ marginRight: "45px" }}>
				<div className={styles.header}>
					<h1 className={styles.headings}>My Studios</h1>
					<div className={styles.headerChild}>
						<CreateStudioDialog
							isDialogOpened={isOpen}
							handleCloseDialog={() => setIsOpen(false)}
						/>
						<Button
							sx={{ fontWeight: 600 }}
							variant="contained"
							size="large"
							className={styles.button}
							onClick={() => handleOpen()}
						>
							<AddRoundedIcon sx={{ pr: 1 }} /> Create Studio
						</Button>
					</div>
				</div>
				<SearchBar searchType={"studios"} label={"Search My Studios ..."} studioId={""} />
				<div className={styles.cardContainer}>
					{studios
						.map((studio) => (
							<StudioCard key={studio.studioName} socket={socket} studio={studio} />
					))}
				</div>
			</div>
			<div className={styles.containerChild}>
				<div className={styles.header}>
					<h1 className={styles.headings}>Listening Now</h1>
					<div className={styles.headerChild}>
						<img src={SoundWavesGradient} className={styles.soundWaves}></img>
					</div>
				</div>
				<SearchBar searchType={"activeStudios"} label={"Search Studios Listening Now ..."} studioId={""} />
				<div className={styles.cardContainer}>
					
				</div>
			</div>
		</div>
	);
}
export default HomePage;
