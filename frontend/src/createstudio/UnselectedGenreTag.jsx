import styles from './UnselectedGenreTag.module.css';
import Button from '@mui/material/Button';

export default function UnselectedGenreTag({genre, handleClick}) {
    return (
        <Button onClick={handleClick} variant="contained" sx={{ mr: 1, mt: 1, mb: 1, color: '#757575'}} className={styles.genreButton}>
            <p className={styles.genreLabel}>{genre}</p>
        </Button>  
    )
}