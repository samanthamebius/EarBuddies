import styles from './GenreTag.module.css';

/**
 * Renders a genre tag with the given genre name.
 * @param {string} genre - Genre name to display on the tag.
 * @returns {JSX.Element} - Component that displays the genre tag.
 */
export default function GenreTag({ genre }) {
	return (
		<div className={styles.genreTag}>
			<p className={styles.genreLabel}>{genre}</p>
		</div>
	);
}
