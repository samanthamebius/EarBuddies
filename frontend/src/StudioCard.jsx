import styles from './StudioCard.module.css';
import SoundWaves from './assets/soundwaves.png';
import TaylorSwiftImg from './assets/taylorswift.png';
import ProfilePicImg1 from './assets/profilepic1.png';
import ProfilePicImg2 from './assets/profilepic2.png';
import ProfilePicImg3 from './assets/profilepic3.png';
import ProfilePicImg4 from './assets/profilepic4.png';
import ProfilePicImg5 from './assets/profilepic5.png';
import ProfilePicImg6 from './assets/profilepic6.png';

import GenreTag from './GenreTag';

const studioName = "Software Swifties"
const backgroundImage = TaylorSwiftImg;
const genres = ["Pop", "Country"];
const listenersImages = [ProfilePicImg1, ProfilePicImg2, ProfilePicImg3, ProfilePicImg4, ProfilePicImg5, ProfilePicImg6]; 
const hostImage = ProfilePicImg1;
const isListening = true;

export default function StudioCard() {
    return (
        <div className={styles.studioCard} style={backgroundImage ? {backgroundImage: `url(${backgroundImage})`} : {backgroundColor: '#797979'}}>
            <div className={styles.darkLayer}>
                <div className={styles.cardContent}>
                    <div className={styles.studioNameSection}>
                        <h1 className={styles.studioName}>{studioName}</h1>
                        <img className={styles.soundWaves} src={SoundWaves} style={isListening ? {}: {display: 'none'}}/>
                    </div>
                    <div className={styles.genreTags}>
                        {genres.map((genre, i) => <GenreTag genre={genre}/>)}
                    </div>
                    <div className={styles.listenersImages}>
                        {listenersImages.map((listenerImage, i) => <img className={styles.listenerImage} src={listenerImage} style={i == 0 ? {} : {transform: `translate(${70*i}%)`}}/>)}
                        <img className={styles.hostImage} src={hostImage}/>
                    </div>
                </div>
            </div>
        </div>
    )
}