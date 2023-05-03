import dotenv from "dotenv";
dotenv.config();
import { User, Studio } from "../database/schema.js";
import { getStudio } from "./studio_dao.js";
import mongoose from "mongoose";

await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });

async function createUser(username, userDisplayName, spotifyPic) {
	const newUser = new User({
		username: username,
		userDisplayName: userDisplayName,
		spotifyPic: spotifyPic,
		profilePic: spotifyPic,
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

async function searchUsers(query, username) {
	const users = await User.find({ userDisplayName: { $regex: query, $options: "i" }, username: { $ne: username } });
	return users;
  }

async function updateUserInfo(username, userDisplayName, spotifyPic, profilePic) {
	return await User.findOneAndUpdate(
		{ username: username },
		{ userDisplayName: userDisplayName, spotifyPic: spotifyPic, profilePic: profilePic }
	);
}

async function getUser(username) {
	const user = await User.findOne({ username: username });
	return user;
}

//TODO: deprecate
async function getUserId(username) {
	const user = await getUser(username);
	return user._id;
}

//TODO: deprecate
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

async function searchStudios(username, query) {
	const studiosId = await getStudiosId(username);
	const studios = await Studio.find({ _id: { $in: studiosId }, studioName: { $regex: query, $options: "i" } });
	return studios;
}

async function searchActiveStudios(username, query) {
	const studiosId = await getStudiosId(username);
	const studios = await Studio.find({ _id: { $in: studiosId }, studioName: { $regex: query, $options: "i" }, studioIsActive: true });
	return studios;
}

async function searchStudioUsers(studioId, query, username) {
	const users = await User.find({ userStudios: { $in: studioId }, userDisplayName: { $regex: query, $options: "i" }, username: { $ne: username } });
	return users;
}

async function updateStudios(id, studios) {
	return await User.findOneAndUpdate(
		{ _id: id },
		{ userStudios: studios }
	);
}

async function updateStudiosUsername(username, studios) {
  return await User.findOneAndUpdate({ username: username }, { userStudios: studios });
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
	searchStudioUsers,
  	updateUserInfo,
	updateStudiosUsername			
};