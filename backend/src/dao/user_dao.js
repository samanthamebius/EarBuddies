import dotenv from "dotenv";
dotenv.config();
import { User } from "../database/schema.js";
import { getStudio } from "./studio_dao.js";
import mongoose from "mongoose";

await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });

async function createUser(username, userDisplayName, profilePic) {
	const newUser = new User({
		username: username,
		userDisplayName: userDisplayName,
		profilePic: profilePic,
		userIsActive: true,
		userStudios: [],
	});
	return await newUser.save();
}

async function loginUser(spotifyApi, data) {
	return new Promise((resolve, reject) => {
		spotifyApi
			.getMe()
			.then(async function (data) {
				const user = await getUser(data.body.id);
				// check to see if user in db
				if (user.length === 0) {
					await createUser(
						data.body.id,
						data.body.display_name,
						`${data.body.images.length === 0 ? "" : data.body.images[0].url}`
					);
				} else {
					await updateUser(data.body.id);
				}
				resolve(data.body.id);
			})
			.catch(function (err) {
				console.log("Something went wrong!", err);
				reject(err);
			});
	});
}

async function updateUser(username) {
	return await User.findOneAndUpdate(
		{ username: username },
		{ userIsActive: true }
	);
}

async function getUser(username) {
	const user = await User.findOne({ username: username });
	return user;
}

async function getUserId(username) {
	const user = await getUser(username);
	return user._id;
}

async function getUserbyId(id) {
	const user = await User.findOne({ _id: id });
	return user;
}

async function getStudiosId(id) {
	const user = await getUserbyId(id);
	return user.userStudios;
}

async function searchStudios(id) {
	const studiosId = await getStudiosId(id);
	var studioObjects = [];
	for (var i = 0; i < studiosId.length; i++) {
		const studio = await getStudio(studiosId[i]._id);
		studioObjects[i] = studio;
	}
	return studioObjects;
}

async function searchActiveStudios(id) {
	const studioObjects = await searchStudios(id);
	var studiosActive = [];
	for (var i = 0; i < studioObjects.length; i++) {
		if (studioObjects[i].isActive) {
			studiosActive[i] = studioObjects[i];
		}
	}
	return studiosActive;
}


async function updateStudios(username, studios) {
	return await User.findOneAndUpdate(
		{ username: username },
		{ userStudios: studios }
	);
}

async function deleteUser(username) {
	return await User.deleteOne({ username: username });
}

await mongoose.disconnect;

export {
	createUser,
	updateUser,
	getUser,
	loginUser,
	getStudiosId,
	updateStudios,
	getUserId,
	deleteUser,
	getUserbyId,
	searchStudios,
	searchActiveStudios
};
