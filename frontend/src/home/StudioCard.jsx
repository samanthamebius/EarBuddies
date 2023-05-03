import styles from "./StudioCard.module.css";
import SoundWaves from "../assets/studio_cards/soundwaves.png";
import TaylorSwiftImg from "../assets/taylorswift.png";
import ProfilePicImg1 from "../assets/profilepic1.png";
import ProfilePicImg2 from "../assets/profilepic2.png";
import ProfilePicImg3 from "../assets/profilepic3.png";
import ProfilePicImg4 from "../assets/profilepic4.png";
import ProfilePicImg5 from "../assets/profilepic5.png";
import ProfilePicImg6 from "../assets/profilepic6.png";
import GenreTag from "./GenreTag";
import ListenerIcons from "../shared/ListenerIcons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const studioName = "Software Swifties";
const backgroundImage = TaylorSwiftImg;
const genres = ["Pop", "Country"];
const hostImage = ProfilePicImg1;
const isListening = true;

export default function StudioCard(props) {
	const { socket, studio } = props;
	// studio will be gotten from backend when set up
	const room = studio.id; // will be the id of the studio
	const navigate = useNavigate();

	const handleJoinStudio = () => {
		navigate(`studio/${room}`);
	};

	return (
		<div
			className={styles.studioCard}
			style={
				backgroundImage
					? { backgroundImage: `url(${backgroundImage})` }
					: { backgroundColor: "#797979" }
			}
			onClick={() => handleJoinStudio()}
		>
			<div className={styles.darkLayer}>
				<div className={styles.cardContent}>
					<div className={styles.studioNameSection}>
						<h1 className={styles.studioName}>{studioName}</h1>
						<img
							className={styles.soundWaves}
							src={SoundWaves}
							style={isListening ? {} : { display: "none" }}
						/>
					</div>
					<div className={styles.genreTags}>
						{genres.map((genre, i) => (
							<GenreTag key={i} genre={genre} />
						))}
					</div>
					<div className={styles.listeners}>
						{/* TODO: This is currently broken since not synced with backend - fix following banner structure */}
						<ListenerIcons
							// studioUsers={users} --> ADD IN ONCE BACKEND SYNCED
							isListening={isListening}
							isHomeCard={true}
						/>
						<img className={styles.hostImage} src={hostImage} />
					</div>
				</div>
			</div>
		</div>
	);
}
