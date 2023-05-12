import dotenv from "dotenv";
dotenv.config();
import { User, Studio } from "../database/schema.js";

/**
 * Log in user using spotify authentication
 * @param spotifyApi 
 * @param data 
 * @returns promise that resolves to the username of the logged in user
 */
async function loginUser(spotifyApi, data) {
	return new Promise((resolve, reject) => {
		spotifyApi
			.getMe()
			.then(async function (data) {
				const user = await getUser(data.body.id);
				if (!user) {
					// create user if not in database
					await createUser(
						data.body.id,
						data.body.display_name,
						`${data.body.images.length === 0 ? '' : data.body.images[0].url}`
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

/**
 * Creates a new user in the database
 * @param username 
 * @param userDisplayName
 * @param spotifyPic 
 * @returns user
 */
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

/**
 * Set user to active in db
 * @param username 
 * @returns updated user
 */
async function setUserActive(username) {
	return await User.findOneAndUpdate(
		{ username: username },
		{ userIsActive: true },
		{ new: true }
	);
}

/**
 * Set user to inactive in db
 * @param username
 * @returns updated user
 */
async function setUserInactive(username) {
	return await User.findOneAndUpdate(
		{ username: username },
		{ userIsActive: false },
		{ new: true }
	);
}

/**
 * Delete user
 * @param username
 * @returns deleted user
 */
async function deleteUser(username) {
	return await User.deleteOne({ username: username });
}

/**
 * Update user display name
 * @param username
 * @param userDisplayName
 * @returns updated user
 */
async function updateUserDisplayName(username, userDisplayName) {
	return await User.findOneAndUpdate(
		{ username: username },
		{ userDisplayName: userDisplayName },
		{ new: true }
	);
}

/**
 * Update user profile picture
 * @param username
 * @param profilePic
 * @returns updated user
 */
async function updateUserProfilePic(username, profilePic) {
	return await User.findOneAndUpdate(
		{ username: username },
		{ profilePic: profilePic },
		{ new: true }
	);
}

/**
 * Update user spotify picture
 * @param username
 * @param spotifyPic
 * @returns updated user
 */
async function updateUserSpotifyPic(username, spotifyPic) {
	return await User.findOneAndUpdate(
		{ username: username },
		{ spotifyPic: spotifyPic },
		{ new: true }
	);
}

/**
 * Add studio to user
 * @param username
 * @param studioId
 */
async function addStudio(username, studioId) {
	const thisListener = await getUser(username);
	if (!thisListener) {
		return res.status(404).json({ msg: 'Listener not found' });
	}
	const studios = await getStudiosId(username);
	studios.push(studioId);
	await updateStudios(username, studios);
}

/**
 * Updates user's studios
 * @param username
 * @param studios list
 * @returns updated user
 */
async function updateStudios(username, studios) {
	return await User.findOneAndUpdate({ username: username }, { userStudios: studios }, { new: true });
}

/**
 * Get all users
 * @returns all users
 */
async function getUsers() {
	const users = await User.find();
	return users;
}

/**
 * Get user by username
 * @param username
 * @returns user
 */
async function getUser(username) {
	const user = await User.findOne({ username: username });
	return user;
}

/**
 * Get user's studios
 * @param username
 * @returns user's studios
 */
async function getStudiosId(username) {
	const user = await getUser(username);
	return user.userStudios;
}

/**
 * Get user's active studios
 * @param username
 * @returns active studios
 */
async function getActiveStudios(username) {
	const user = await getUser(username);
	const studios = await Studio.find({ _id: { $in: user.userStudios }, studioIsActive: true });
	return studios;
}

/**
 * Search user's studios
 * @param username
 * @param query to search for
 * @returns user's studios
 */
async function searchStudios(username, query) {
	const regex = new RegExp(`^${query}`, 'i');
	const studiosId = await getStudiosId(username);
	let studios;
	if (query.length !== 0) {
		studios = await Studio.find({
			_id: { $in: studiosId },
			studioName: regex,
		});
	} else {
		studios = await Studio.find({
			_id: { $in: studiosId },
		});
	}
	return studios;
}

/**
 * Search user's active studios
 * @param username
 * @param query to search for
 * @returns user's active studios
 */
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

/**
 * Search all users
 * @param query to search for
 * @param username of current user
 * @returns users
 */
async function searchUsers(query, username) {
	const regex = new RegExp(`^${query}`, 'i');
	const users = await User.find({
		userDisplayName: regex,
		username: { $ne: username },
	});
	return users;
}

/**
 * Search studio users
 * @param studioId
 * @param query to search for
 * @param username of current user
 * @returns users
 */
async function searchStudioUsers(studioId, query, username) {
	const regex = new RegExp(`^${query}`, 'i');
	const users = await User.find({
		userStudios: { $in: studioId },
		userDisplayName: regex,
		username: { $ne: username }
	});
	return users;
}

export {
	createUser,
	setUserActive,
	setUserInactive,
	getUser,
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
	updateUserSpotifyPic,
	getActiveStudios,
	addStudio,
};
