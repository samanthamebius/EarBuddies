import styles from './UnselectedGenreTag.module.css';
import Button from '@mui/material/Button';

export default function UnselectedGenreTag({genre}) {
    return (
        <Button variant="contained" sx={{ color: '#606060'}} className={styles.genreButton}>
            <p className={styles.genreLabel}>{genre}</p>
        </Button>  
    )
}