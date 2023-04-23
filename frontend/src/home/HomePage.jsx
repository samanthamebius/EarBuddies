import React, { useState } from "react";
import useAuth from "../useAuth";
import StudioCard from "./StudioCard";
import styles from "./HomePage.module.css";
import Button from "@mui/material/Button";
import SoundWavesGradient from "../assets/soundwavesgradient.png";
import SearchBar from "../shared/SearchBar";
import CreateStudioDialog from "../createstudio/CreateStudioDialog";

/**
 * Checks if user is logged in, if not, redirects to login page
 */
function login() {
	console.log("in login homepage");
	const access_token = localStorage.getItem("access_token");
	const code = new URLSearchParams(window.location.search).get("code");
	const current_user_id = localStorage.getItem("current_user_id");
	if (access_token == null) {
		console.log("access token is null");
		//check for code
		if (code == null) {
			//reroute to login page
			console.log("code is null")
			window.location.href = "/login";
			return;
		}
	}
	console.log("access token is not null")
	useAuth(access_token, code, current_user_id);
}

function HomePage() {
	login();

	const [isOpen, setIsOpen] = useState(false);

	const handleOpen = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div className={styles.container}>
			<div className={styles.containerChild} style={{ marginRight: "45px" }}>
				<div className={styles.header}>
					<h1>{localStorage.getItem("access_token")}</h1>
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
