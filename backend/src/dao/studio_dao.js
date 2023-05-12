import dotenv from "dotenv";
dotenv.config();
import { Studio } from "../database/schema.js";
import { getUser } from "./user_dao.js";


async function createStudio(name, listeners, host, genres, photo, isHostOnly, playlist) {
	const displayNames = [];
	let numActive = 0;
	for (let i = 0; i < listeners.length; i++) {
		const username = listeners[i];
		const user = await getUser(username);
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

async function getStudio(id) {
	return await Studio.find({ _id: id });
}

async function deleteStudio(id) {
	return await Studio.deleteOne({ _id: id });
}

async function getStudios() {
	return await Studio.find();
}

async function updateStudioControlHostOnly(id, isHostOnly) {
	return await Studio.findOneAndUpdate(
		{ _id: id },
		{ studioControlHostOnly: isHostOnly },
		{ new: true }
	);
}

async function updateStudioIsActive(id, isActive) {
	return await Studio.findOneAndUpdate(
		{ _id: id },
		{ studioIsActive: isActive },
		{ new: true }
	);
}

async function updateStudioUsers(id, listeners) {
	return await Studio.findOneAndUpdate({ _id: id }, { studioUsers: listeners }, { new: true });
}

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

async function updateStudioHost(id, host) {
	return await Studio.findOneAndUpdate({ _id: id }, { studioHost: host }, { new: true });
}

async function updateStudioNames(id, newNames) {
	return await Studio.findOneAndUpdate({ _id: id }, { studioNames: newNames }, { new: true });
}

async function setStudioStatus(studio_id) {
	const studio = await getStudio(studio_id);
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

async function updateStudioPlaylist(id, playlist) {
	return await Studio.findOneAndUpdate({ _id: id }, { studioPlaylist: playlist }, { new: true });
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
};
