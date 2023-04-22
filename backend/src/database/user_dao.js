import dotenv from "dotenv";
dotenv.config();
import { User } from "./schema.js";
import mongoose from "mongoose";

var currentUserId = null;
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

async function setCurrentUser(spotifyApi, data) {
  console.log("setting current user");
  spotifyApi
    .getMe()
    .then(async function (data) {
      const user = getUser(data.body.id);
      // check to see if user in db
      if (user.length === 0) {
        createUser(
          data.body.id,
          data.body.display_name,
          `${data.body.images.length === null ? "" : data.body.images[0].url}`
        );
      } else {
        updateUser(data.body.id);
      }
      console.log("setting id " + data.body.id);
      currentUserId = data.body.id;
    })
    .catch(function (err) {
      console.log("Something went wrong!", err);
    });
}

async function getCurrentUser() {
  console.log("getting current user");
  if (currentUserId === null) {
    console.log("no current user");
    return null;
  } else {
    return await getUser(currentUserId);
  }
}

async function updateUser(username) {
  return await User.findOneAndUpdate(
    { username: username },
    { userIsActive: true }
  );
}

async function getUser(username) {
  return await User.find({ username: username });
}

export { createUser, updateUser, getUser, setCurrentUser, getCurrentUser };
