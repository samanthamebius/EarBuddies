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
	const [studioSearchTerm, setStudioSearchTerm] = useState("");
	const [activeStudioSearchResults, setActiveStudioSearchResults] = useState([]);
	const [activeStudioSearchTerm, setActiveStudioSearchTerm] = useState("");

	useEffect(() => {
		const fetchStudios = async () => {
			const response = await axios.get(`${BASE_URL}/api/home/${id}/studios`);
			setStudios(response.data);
		};
		fetchStudios();
	}, []);

    const { socket } = props;
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        setIsOpen(!isOpen);
    };

	console.log(studioSearchResults.length === 0);

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
                        <img src={SoundWavesGradient} className={styles.soundWaves} alt="Pink Sound Waves"></img>
					</div>
				</div>
				<SearchBar
					searchType={"activeStudios"}
					label={"Search Studios Listening Now ..."}
					studioId={""}
					setResults={setActiveStudioSearchResults}
					onInputChange={setActiveStudioSearchTerm}
				/>
				<div className={styles.cardContainer}>
					{activeStudioSearchResults.length === 0 && !activeStudioSearchTerm
						? studios.map((studio) => (
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
