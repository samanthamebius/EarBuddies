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

// async function loginUser(spotifyApi, data) {
//   spotifyApi
//     .getMe()
//     .then(async function (data) {
//       const user = await getUser(data.body.id);
//       // console.log("user_dao.js | line 25 | user: " + user)
//       // check to see if user in db
//       if (user.length === 0) {
//         await createUser(
//           data.body.id,
//           data.body.display_name,
//           `${data.body.images.length === null ? "" : data.body.images[0].url}`
//         );
//       } else {
//         await updateUser(data.body.id);
//       }
//       console.log("user_dao.js | line 37 | user_id: " + data.body.id)
//       return data.body.id;
//     })
//     .catch(function (err) {
//       console.log("Something went wrong!", err);
//     });
// }

async function loginUser(spotifyApi, data) {
  return new Promise((resolve, reject) => {
    spotifyApi
      .getMe()
      .then(async function (data) {
        const user = await getUser(data.body.id);
        // console.log("user_dao.js | line 25 | user: " + user)
        // check to see if user in db
        if (user.length === 0) {
          await createUser(
            data.body.id,
            data.body.display_name,
            `${data.body.images.length === null ? "" : data.body.images[0].url}`
          );
        } else {
          await updateUser(data.body.id);
        }
        console.log("user_dao.js | line 37 | user_id: " + data.body.id);
        resolve(data.body.id);
      })
      .catch(function (err) {
        console.log("Something went wrong!", err);
        reject(err);
      });
  });
}

// async function getCurrentUser() {
//   console.log("getting current user");
//   if (currentUserId === null) {
//     console.log("no current user");
//     return null;
//   } else {
//     return await getUser(currentUserId);
//   }
// }

async function updateUser(username) {
  return await User.findOneAndUpdate(
    { username: username },
    { userIsActive: true }
  );
}

async function getUser(username) {
  console.log("user_dao.js | line 61 | getUser username: " + username)
  return await User.find({ username: username });
}

await mongoose.disconnect;

export { createUser, updateUser, getUser, loginUser };
