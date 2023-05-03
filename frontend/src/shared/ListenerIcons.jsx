import useGet from "../hooks/useGet";
import styles from "./ListenerIcons.module.css";
import AddIcon from "../assets/addListenerIcon.png";
import React, { useEffect, useState } from "react";
import axios from "axios";

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
	studioUsers,
	isListening,
    isHomeCard
}) {
	const [userList, setUserList] = useState([]);
	const BASE_URL = import.meta.env.VITE_API_BASE_URL;
	useEffect(() => {
		if (!studioUsers || !Array.isArray(studioUsers)) {
			console.log("no studio users")
			return;
		}
		async function fetchUserData() {
		const promises = studioUsers.map(user => axios.get(`${BASE_URL}/api/user/${user}`));
		const userDataList = await Promise.all(promises);
		setUserList(userDataList.map(response => response.data));
		}
		fetchUserData();
	}, [studioUsers]);
	const profileImages = userList.map(user => user.profilePic);
	const profileStatus = userList.map(user => user.userIsActive);

	if (!isHomeCard) {
		profileImages.push(AddIcon);
		profileStatus.push(true);
	}
	
	return (
		<div className={styles.listenersImages}>
			{Array.isArray(profileImages)
				? profileImages.map((listenerImage, i) => (
						<img
							key={i} 
							className={styles.listenerImage}
							src={listenerImage}
							style={setListenerImageStyles(i, isListening, profileStatus, isHomeCard)}
						/>
				  ))
				: null}
		</div>
	);
}
