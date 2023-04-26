import styles from './SelectedGenreTag.module.css';
import Button from '@mui/material/Button';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';

export default function SelectedGenreTag({genre, handleClick}) {
    return (
        <Button onClick={handleClick} sx={{ mr: 1, mt: 1, mb: 1 }} variant="contained" className={styles.genreButton}>
            <p className={styles.genreLabel}>{genre}</p>
            <CheckCircleOutlineRoundedIcon sx={{ pl: 0.5, color: "#ffffff"}}/>
        </Button>  
    )
}