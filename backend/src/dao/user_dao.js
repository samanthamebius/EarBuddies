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
				if (!user) {
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

async function getUsers() {
	const users = await User.find();
	return users;
}

async function searchUsers(query) {
	const users = await User.find({ userDisplayName: { $regex: query, $options: "i" } });
	return users;
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

async function getUsername(id) {
	const user = await getUserbyId(id);
	return user.username;
}

async function getStudiosId(username) {
	const user = await getUser(username);
	return user.userStudios;
}

async function searchStudios(username) {
	const studiosId = await getStudiosId(username);
	var studioObjects = [];
	for (var i = 0; i < studiosId.length; i++) {
		const studio = await getStudio(studiosId[i]._id);
		studioObjects[i] = studio;
	}
	return studioObjects;
}

async function searchActiveStudios(username) {
	const studioObjects = await searchStudios(username);
	var studiosActive = [];
	for (var i = 0; i < studioObjects.length; i++) {
		if (studioObjects[i][0].studioIsActive) {
			studiosActive.push(studioObjects[i][0]);
		}
	}
	return studiosActive;
}


async function updateStudios(id, studios) {
	return await User.findOneAndUpdate(
		{ _id: id },
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
	searchActiveStudios,
	searchUsers,
	getUsers,
	getUsername,
};
