import dotenv from "dotenv";
dotenv.config();
import { Studio } from "../database/schema.js";
import mongoose from "mongoose";
import { getUsername, getUser } from "./user_dao.js";

await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });

async function createStudio(name, listeners, host, genres, photo, isHostOnly, playlist) {
	const displayNames = [];

	for (let i = 0; i < listeners.length; i++) {
		const userId = listeners[i];
		const username = await getUsername(userId);
		const user = await getUser(username);
		const displayName = user.userDisplayName;
		displayNames.push(displayName);
	}
	
  const newStudio = new Studio({
    studioName: name,
    studioIsActive: true,
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
		{ studioControlHostOnly: isHostOnly }
	);
}

async function updateStudioIsActive(id, isActive) {
	return await Studio.findOneAndUpdate(
		{ _id: id },
		{ studioIsActive: isActive }
	);
}

async function updateStudioUsers(id, listeners) {
	return await Studio.findOneAndUpdate({ _id: id }, { studioUsers: listeners });
}

async function updateStudioHost(id, host) {
	return await Studio.findOneAndUpdate({ _id: id }, { studioHost: host });
}

async function updateStudioNames(id, newNames) {
	return await Studio.findOneAndUpdate({ _id: id }, { studioNames: newNames })
}

await mongoose.disconnect;
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
};
