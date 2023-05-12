import styles from './GenreTag.module.css';
import Button from '@mui/material/Button';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';

/**
 * Component for a selected genre to be displayed as a tag in the CreateStudioDialog.
 * @param {string} genre - The name of the selected genre.
 * @param {Function} handleClick - The funciton to handle the click event on the genre tag.
 * @returns {JSX.Element} - The JSX element for the selected genre tag.
 */
export default function GenreTag({ genre, handleClick, isSelected }) {
	return (
		<Button
			onClick={handleClick}
			sx={{ mr: 1, mt: 1, mb: 1 }}
			style={{ color: isSelected ? '#FFFFFF' : '#757575' }}
			variant='contained'
			className={
				isSelected ? styles.selectedGenreButton : styles.unSelectedGenreButton
			}>
			<p
				className={styles.genreLabel}
				style={{ color: isSelected ? '#FFFFFF' : '#757575' }}>
				{genre}
			</p>
			{isSelected && (
				<CheckCircleOutlineRoundedIcon sx={{ pl: 0.5, color: '#FFFFFF' }} />
			)}
		</Button>
	);
}
