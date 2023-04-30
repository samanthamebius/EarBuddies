import React, { useContext, useState } from "react";
import StudioCard from "./StudioCard";
import styles from "./HomePage.module.css";
import Button from "@mui/material/Button";
import SoundWavesGradient from "../assets/home/soundwavesgradient.png";
import SearchBar from "../shared/SearchBar";
import CreateStudioDialog from "../createstudio/CreateStudioDialog";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { AppContext } from "../AppContextProvider";

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
	const { socket } = props;
	const [isOpen, setIsOpen] = useState(false);
	const { username } = useContext(AppContext);

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
				<SearchBar label={"Search My Studios ..."} />
				<div className={styles.cardContainer}>
					{mockStudios
						.filter((studio) => studio.studioIsActive === false)
						.map((studio) => (
							<StudioCard
								key={studio.id}
								socket={socket}
								studio={studio}
								username={username}
							/>
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
				<SearchBar label={"Search Studios Listening Now ..."} />
				<div className={styles.cardContainer}>
					{mockStudios
						.filter((studio) => studio.studioIsActive === true)
						.map((studio) => (
							<StudioCard
								key={studio.id}
								socket={socket}
								studio={studio}
								username={username}
							/>
						))}
				</div>
			</div>
		</div>
	);
}
export default HomePage;
