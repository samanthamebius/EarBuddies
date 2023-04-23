import React, { useState } from "react";
import useAuth from "../useAuth";
import StudioCard from "./StudioCard";
import styles from "./HomePage.module.css";
import Button from "@mui/material/Button";
import SoundWavesGradient from "../assets/soundwavesgradient.png";
import SearchBar from "../shared/SearchBar";
import CreateStudioDialog from "../createstudio/CreateStudioDialog";


function HomePage() {
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
							variant="contained"
							size="large"
							className={styles.button}
							onClick={() => handleOpen()}
						>
							+ Create Studio
						</Button>
					</div>
				</div>
				<SearchBar label={"Search My Studios ..."} />
				<div className={styles.cardContainer}>
					<StudioCard />
					<StudioCard />
					<StudioCard />
					<StudioCard />
					<StudioCard />
					<StudioCard />
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
					<StudioCard />
					<StudioCard />
				</div>
			</div>
		</div>
	);
}
export default HomePage;
