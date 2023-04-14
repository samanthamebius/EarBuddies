import styles from "./ListenerIcons.module.css";

const setListenerImageStyles = (i, isListening, profileStatus, isHomeCard) => {
    
    let baseStyle = { transform: `translate(${70 * i}%)`, float: `right` };

    if (isHomeCard) {
        baseStyle = { transform: `translate(${-70 * i}%)`, float: `left` };
    } 
    
	let greyStyle = { WebkitFilter: "brightness(30%)" };
	let listenerStyles = {};
	if (isListening) {
		if (profileStatus[i]) {
			listenerStyles = { ...baseStyle };
		} else {
			listenerStyles = { ...baseStyle, ...greyStyle };
		}
	} else {
		listenerStyles = { ...baseStyle };
	}
	return listenerStyles;
};

export default function StudioCard({
	isListening,
	profileImages,
	profileStatus,
    isHomeCard
}) {
	return (
		<div className={styles.listenersImages}>
			{Array.isArray(profileImages)
				? profileImages.map((listenerImage, i) => (
						<img
							className={styles.listenerImage}
							src={listenerImage}
							style={setListenerImageStyles(i, isListening, profileStatus, isHomeCard)}
						/>
				  ))
				: null}
		</div>
	);
}
