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

const studioName = "Software Swifties";
const backgroundImage = TaylorSwiftImg;
const genres = ["Pop", "Country"];
const hostImage = ProfilePicImg1;
const isListening = true;

const listenersImages = [
	ProfilePicImg1,
	ProfilePicImg2,
	ProfilePicImg3,
	ProfilePicImg4,
	ProfilePicImg5,
	ProfilePicImg6,
];
const listenersActive = [true, true, false, false, true, false];

export default function StudioCard() {
	const { socket, studio } = props;
	// studio will be gotten from backend when set up
	const navigate = useNavigate();
	const room = studio.id; // will be the id of the studio
	const username = "test";

	const handleJoinStudio = () => {
		socket.connect("http://localhost:3000");
		socket.emit("join-room", { username, room });
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
						<ListenerIcons
							isListening={isListening}
							profileImages={listenersImages}
							profileStatus={listenersActive}
							isHomeCard={true}
						/>
						<img className={styles.hostImage} src={hostImage} />
					</div>
				</div>
			</div>
		</div>
	);
}
