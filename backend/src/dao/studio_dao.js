import dotenv from "dotenv";
dotenv.config();
import { Studio } from "../database/schema.js";
import { getStudiosId, getUser, updateStudios } from "./user_dao.js";

/**
 * Create a new studio
 * @param name: String
 * @param listeners: Array of usernames
 * @param host: String
 * @param genres: Array of genres
 * @param photo: String
 * @param isHostOnly: Boolean
 * @param playlist: String
 * @returns created studio
 */
async function createStudio(name, listeners, host, genres, photo, isHostOnly, playlist) {
	const displayNames = [];
	//check if studio is active
	let numActive = 0;
	for (let i = 0; i < listeners.length; i++) {
		const username = listeners[i];
		const user = await getUser(username);
		//add display name
		const displayName = user.userDisplayName.trim();
		displayNames.push(displayName);
		if (user.userIsActive) {
			numActive++;
		}
	}
	let isActive = false;
	if (numActive > 1) {
		isActive = true;
	}

	const newStudio = new Studio({
		studioName: name,
		studioIsActive: isActive,
		studioUsers: listeners,
		studioNames: displayNames,
		studioHost: host,
		studioGenres: genres,
		studioPicture: photo,
		studioControlHostOnly: isHostOnly,
		studioPlaylist: playlist,
	});
	const studio = await newStudio.save();
	return studio;
}

/**
 * Get studio by id
 * @param id 
 * @returns studio
 */
async function getStudio(id) {
	return await Studio.find({ _id: id });
}

/**
 * Delete studio by id
 * @param id
 * @returns deleted studio
 */
async function deleteStudio(id) {
	return await Studio.deleteOne({ _id: id });
}

/**
 * Get all studios
 * @returns all studios
 */
async function getStudios() {
	return await Studio.find();
}

/**
 * Update hostOnly setting
 * @param id
 * @param isHostOnly
 * @returns updated studio
 */
async function updateStudioControlHostOnly(id, isHostOnly) {
	return await Studio.findOneAndUpdate(
		{ _id: id },
		{ studioControlHostOnly: isHostOnly },
		{ new: true }
	);
}

/**
 * Update studio active status
 * @param id
 * @param isActive
 * @returns updated studio
 */
async function updateStudioIsActive(id, isActive) {
	return await Studio.findOneAndUpdate(
		{ _id: id },
		{ studioIsActive: isActive },
		{ new: true }
	);
}

/**
 * Update studio users
 * @param id
 * @param listeners: full list of new listeners
 * @returns updated studio
 */
async function updateStudioUsers(id, listeners) {
	return await Studio.findOneAndUpdate({ _id: id }, { studioUsers: listeners }, { new: true });
}

/**
 * Delete user from studio
 * @param studio_id
 * @param username of user to delete
 * @returns updated studio
 */
async function deleteUserFromStudio(studio_id, username) {
	const studio = await getStudio(studio_id);
	const users = studio[0].studioUsers;
	const index = users.indexOf(username);
	if (index > -1) {
		users.splice(index, 1);
	}
	//if user is host, assign new host
	if (studio[0].studioHost === username) {
		const newHost = users[0];
		//if no new host, delete studio
		if (!newHost) {
			return await deleteStudio(studio_id);
		}
		await updateStudioHost(studio_id, newHost);
	}
	return await Studio.findOneAndUpdate({ _id: studio_id }, { studioUsers: users });
}

/**
 * Update studio host
 * @param id
 * @param host: username of new host
 * @returns updated studio
 */
async function updateStudioHost(id, host) {
	return await Studio.findOneAndUpdate({ _id: id }, { studioHost: host }, { new: true });
}

/**
 * Update studio display names
 * @param id
 * @param newNames: full list of new display names
 * @returns updated studio
 */
async function updateStudioNames(id, newNames) {
	return await Studio.findOneAndUpdate({ _id: id }, { studioNames: newNames }, { new: true });
}

/**
 * Set studio active status
 * Studio is active if at least 2 users are active
 * @param studio_id
 * @returns updated studio
 * @returns null if studio does not exist
 */
async function setStudioStatus(studio_id) {
	const studio = await getStudio(studio_id);
	if (!studio) {
		return;
	}
	const users = studio[0].studioUsers;
	let numActive = 0;
	const promises = users.map(async (user) => {
		const dbUser = await getUser(user);
		if (dbUser.userIsActive) {
			numActive++;
		}
	});

	await Promise.all(promises);

	if (numActive > 1) {
		return await updateStudioIsActive(studio_id, true);
	} else {
		return await updateStudioIsActive(studio_id, false);
	}
}

/**
 * update studio playlist
 * @param id
 * @param playlist: new playlist
 * @returns updated studio
 */
async function updateStudioPlaylist(id, playlist) {
	return await Studio.findOneAndUpdate({ _id: id }, { studioPlaylist: playlist }, { new: true });
}

/**
 * Removes studio from all users
 * @param studio
 */
async function removeStudioFromUsers(studio) {
	const listeners = studio[0].studioUsers;

	listeners.forEach(async (listener) => {
		const studios = await getStudiosId(listener);
		const newStudios = studios.filter(
			(this_studio) => {
				JSON.parse(JSON.stringify(this_studio._id)) !== studio[0]._id}
		);
		await updateStudios(listener, newStudios);
	});
}

/**
 * Sets a users nickname in a studio
 * @param studio_id
 * @param username: user to update
 * @param nickname: new nickname
 */
async function setNickname(studio_id, username, nickname) {
	const studio = await getStudio(studio_id);
	const users = studio[0].studioUsers;
	const nicknames = studio[0].studioNames;
	
	const userPos = users.indexOf(username);
	nicknames[userPos] = nickname;
	await updateStudioNames(studio_id, nicknames);
}

/**
 * Removes a users nickname in a studio
 * @param studio_id
 * @param username: user to update
 */
async function removeNickname(studio, username) {
	const listeners = studio[0].studioUsers;
	const indexToRemove = listeners.indexOf(username);
	const nicknames = studio[0].studioNames;
	const newArray = [
		...nicknames.slice(0, indexToRemove),
		...nicknames.slice(indexToRemove + 1),
	];
	updateStudioNames(studio._id, newArray);
}

export {
	createStudio,
	getStudio,
	getStudios,
	updateStudioControlHostOnly,
	updateStudioIsActive,
	updateStudioUsers,
	updateStudioHost,
	deleteStudio,
	updateStudioNames,
	deleteUserFromStudio,
	setStudioStatus,
	updateStudioPlaylist,
	removeStudioFromUsers,
	setNickname,
	removeNickname,
};
