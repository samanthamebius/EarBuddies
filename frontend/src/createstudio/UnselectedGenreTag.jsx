import styles from './UnselectedGenreTag.module.css';
import Button from '@mui/material/Button';

export default function UnselectedGenreTag({genre, handleClick}) {
    return (
        <Button onClick={handleClick} variant="contained" sx={{ mr: 1, color: '#606060'}} className={styles.genreButton}>
            <p className={styles.genreLabel}>{genre}</p>
        </Button>  
    )
}