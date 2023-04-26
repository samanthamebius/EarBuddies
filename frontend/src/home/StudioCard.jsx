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
import { useContext } from "react";
import { AppContext } from "../AppContextProvider";

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

export default function StudioCard(props) {
	const { socket, studio } = props;
	const { username } = useContext(AppContext);
	// studio will be gotten from backend when set up
	const room = studio.id; // will be the id of the studio
	const navigate = useNavigate();

	const handleJoinStudio = async () => {
		socket.connect("http://localhost:3000");
		socket.emit("join_room", { username, room });

		// create the chat in the DB if it doesn't already exist
		await axios.post(`http://localhost:3000/api/chat/${room}`);

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
