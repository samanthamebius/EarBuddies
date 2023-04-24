import dotenv from "dotenv";
dotenv.config();
import { User } from "./schema.js";
import mongoose from "mongoose";

// var currentUserId = null;
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

await mongoose.disconnect;

export { createUser, updateUser, getUser, loginUser };
