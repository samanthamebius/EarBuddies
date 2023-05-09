import React, { useState, useEffect } from "react";
import StudioCard from "./StudioCard";
import styles from "./HomePage.module.css";
import Button from "@mui/material/Button";
import SoundWavesGradient from "../assets/home/soundwavesgradient.png";
import SearchBar from "../shared/SearchBar";
import CreateStudioDialog from "../createstudio/CreateStudioDialog";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import axios from "axios";

function HomePage(props) {
	const BASE_URL = import.meta.env.VITE_API_BASE_URL;
	const current_user = localStorage.getItem("current_user_id");
	const id = JSON.parse(current_user);
	const [studios, setStudios] = useState([]);
	const [studioSearchResults, setStudioSearchResults] = useState([]);
	const [studioSearchTerm, setStudioSearchTerm] = useState('');
	// const [activeStudioSearchResults, setActiveStudioSearchResults] = useState([]);

	console.log("studio search term - ", studioSearchTerm)

	useEffect(() => {
		const fetchStudios = async () => {
			const response = await axios.get(`${BASE_URL}/api/home/${id}/studios`);
			setStudios(response.data);
		}
		fetchStudios();
	}, []);

	const { socket } = props;
	const [isOpen, setIsOpen] = useState(false);

	const handleOpen = () => {
		setIsOpen(!isOpen);
	};

	const handleStudioSearchTermChange = (value) => {
		setStudioSearchTerm(value);
	}

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
				<SearchBar
					searchType={"studios"}
					label={"Search My Studios ..."}
					studioId={""}
					setResults={setStudioSearchResults}
					onInputChange={(value) => handleStudioSearchTermChange(value)}
				/>
				<div className={styles.cardContainer}>
					{(studioSearchResults.length === 0) ?
						studios.map((studio) => (
							<StudioCard key={studio.studioName} socket={socket} studio={studio} />
						))
						:
						studioSearchResults.map((studio) => (
							<StudioCard key={studio.studioName} socket={socket} studio={studio} />
						))
					}
				</div>
			</div>
			<div className={styles.containerChild}>
				<div className={styles.header}>
					<h1 className={styles.headings}>Listening Now</h1>
					<div className={styles.headerChild}>
						<img src={SoundWavesGradient} className={styles.soundWaves}></img>
					</div>
				</div>
				<SearchBar
					searchType={"activeStudios"}
					label={"Search Studios Listening Now ..."}
					studioId={""} />
				<div className={styles.cardContainer}>
					{studios
						.filter((studio) => studio.studioIsActive === true)
						.map((studio) => (
							<StudioCard key={studio.studioName} socket={socket} studio={studio} />
						))}

				</div>
			</div>
		</div>
	);
}
export default HomePage;
