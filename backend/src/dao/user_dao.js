import dotenv from "dotenv";
dotenv.config();
import { User, Studio } from "../database/schema.js";

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
					await setUserActive(data.body.id);
				}
				resolve(data.body.id);
			})
			.catch(function (err) {
				console.log("Something went wrong!", err);
				reject(err);
			});
	});
}

async function setUserActive(username) {
	return await User.findOneAndUpdate(
		{ username: username },
		{ userIsActive: true },
		{ new: true }
	);
}

async function setUserInactive(username) {
	return await User.findOneAndUpdate(
		{ username: username },
		{ userIsActive: false },
		{ new: true }
	);
}

async function getUsers() {
	const users = await User.find();
	return users;
}

async function updateUserDisplayName(username, userDisplayName) {
	return await User.findOneAndUpdate(
		{ username: username },
		{ userDisplayName: userDisplayName },
		{ new: true }
	);
}

async function updateUserProfilePic(username, profilePic) {
	return await User.findOneAndUpdate(
		{ username: username },
		{ profilePic: profilePic },
		{ new: true }
	);
}

async function updateUserSpotifyPic(username, spotifyPic) {
	return await User.findOneAndUpdate(
		{ username: username },
		{ spotifyPic: spotifyPic },
		{ new: true }
	);
}

async function getUser(username) {
	const user = await User.findOne({ username: username });
	return user;
}

async function getStudios(username) {
	const user = await getUserbyId(username);
	return user.userStudios;
}

async function getStudiosId(username) {
	const user = await getUser(username);
	return user.userStudios;
}

async function searchStudios(username, query) {
	const regex = new RegExp(`^${query}`, 'i');
	const studiosId = await getStudiosId(username);
	let studios;
	if (query !== "") {
		studios = await Studio.find({
			_id: { $in: studiosId },
			studioName: regex
		});
	} else {
		studios = await Studio.find({
			_id: { $in: studiosId }
		});
	}
	return studios;
}

async function searchActiveStudios(username, query) {
	const regex = new RegExp(`^${query}`, 'i');
	const studiosId = await getStudiosId(username);
	let studios;
	if (query.length !== 0) {
		studios = await Studio.find({
			_id: { $in: studiosId },
			studioName: regex,
			studioIsActive: true
		});
	} else {	
		studios = await Studio.find({
			_id: { $in: studiosId },
			studioIsActive: true
		});
	}
	return studios;
}

async function searchUsers(query, username) {
	const regex = new RegExp(`^${query}`, 'i');
	const users = await User.find({
		userDisplayName: regex,
		username: { $ne: username },
	});
	return users;
}

async function searchStudioUsers(studioId, query, username) {
	const regex = new RegExp(`^${query}`, 'i');
	const users = await User.find({
		userStudios: { $in: studioId },
		userDisplayName: regex,
		username: { $ne: username }
	});
	return users;
}

async function updateStudios(username, studios) {
	return await User.findOneAndUpdate({ username: username }, { userStudios: studios }, { new: true });
}

async function deleteUser(username) {
	return await User.deleteOne({ username: username });
}

export {
	createUser,
	setUserActive,
	setUserInactive,
	getUser,
	getStudios,
	loginUser,
	getStudiosId,
	updateStudios,
	deleteUser,
	searchStudios,
	searchActiveStudios,
	searchUsers,
	getUsers,
	searchStudioUsers,
	updateUserDisplayName,
	updateUserProfilePic,
	updateUserSpotifyPic
};
