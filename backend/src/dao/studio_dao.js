import dotenv from "dotenv";
dotenv.config();
import { Studio } from "../database/schema.js";
import mongoose from "mongoose";

await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });

async function createStudio(name, listeners, host, genres, photo, isHostOnly, playlist) {
  const newStudio = new Studio({
    studioName: name,
    studioIsActive: true,
    studioUsers: listeners,
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
	return await Studio.findOneAndUpdate({ _id: id }, { studioHost: host });
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
	deleteUserFromStudio,
};
