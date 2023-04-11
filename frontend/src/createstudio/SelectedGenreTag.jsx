import styles from './SelectedGenreTag.module.css';
import CheckIcon from "../assets/create_studio/checkicon.png";
import Button from '@mui/material/Button';

export default function SelectedGenreTag({genre}) {
    return (
        <Button sx={{mr: 1}} variant="contained" className={styles.genreButton}>
            <p className={styles.genreLabel}>{genre}</p>
            <img className={styles.genreIcon} src={CheckIcon}></img>
        </Button>  
    )
}