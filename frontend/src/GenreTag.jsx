import styles from './GenreTag.module.css';

export default function GenreTag({genre}) {
    return (
        <div className={styles.genreTag}>
            <p className={styles.genreLabel}>{genre}</p>
        </div>   
    )
}