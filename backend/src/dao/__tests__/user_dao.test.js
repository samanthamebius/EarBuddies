import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { User, Studio, Chat } from "../../database/schema.js";
import {
  createUser,
  setUserActive,
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
} from "../user_dao.js";

let mongod;

//mock data
const mockUser1 = {
  username: "testUser1",
  userDisplayName: "testUser1",
  spotifyPic: "testUser1",
  profilePic: "testUser1",
  userIsActive: false,
  userStudios: [],
};
const mockUser2 = {
  username: "testUser2",
  userDisplayName: "testUser2",
  spotifyPic: "testUser2",
  profilePic: "testUser2",
  userIsActive: true,
  userStudios: [],
};
const mockStudio1 = {
  studioName: "testStudio1",
  studioIsActive: true,
  studioUsers: [],
  studioHost: "testUser1",
  studioGenres: ["testGenre1"],
  studioPicture: "testPicture1",
  studioControlHostOnly: false,
  studioPlaylist: "testPlaylist1",
};
const mockStudio2 = {
  studioName: "testStudio2",
  studioIsActive: true,
  studioUsers: [],
  studioHost: "testUser2",
  studioGenres: ["testGenre2"],
  studioPicture: "testPicture2",
  studioControlHostOnly: false,
  studioPlaylist: "testPlaylist2",
};
const mockChat1 = {
  roomId: "testRoom1",
  messages: [],
  pinnedMessages: [],
};
const mockChat2 = {
  roomId: "testRoom2",
  messages: [],
  pinnedMessages: [],
};

const mockUsers = [mockUser1, mockUser2];
const mockStudios = [mockStudio1, mockStudio2];
const mockChats = [mockChat1, mockChat2];

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const connectionString = mongod.getUri();
  await mongoose.connect(connectionString, { useNewUrlParser: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

beforeEach(async () => {
    await User.deleteMany({});
    await Studio.deleteMany({});
    await Chat.deleteMany({});
    await User.insertMany(mockUsers);
    await Studio.insertMany(mockStudios);
    await Chat.insertMany(mockChats);
});

function expectUser(actual, expected) {
  expect(actual.username).toBe(expected.username);
  expect(actual.userDisplayName).toBe(expected.userDisplayName);
  expect(actual.spotifyPic).toBe(expected.spotifyPic);
  expect(actual.profilePic).toBe(expected.profilePic);
  expect(actual.userIsActive).toBe(expected.userIsActive);
  expect(actual.userStudios).toEqual(expected.userStudios);
}

test('create user is successful', async () => {
    const newUser = {
        username: "testUser3",
        userDisplayName: "testUser3",
        spotifyPic: "testUser3",
        profilePic: "testUser3",
        userIsActive: true,
        userStudios: [],
    };
    const createdUser = await createUser("testUser3", "testUser3", "testUser3");
    expectUser(createdUser, newUser);
});

test('get all users is successful', async () => {
    const users = await getUsers();
    expect(users.length).toBe(2);
    expectUser(users[0], mockUser1);
    expectUser(users[1], mockUser2);
});

test('get user is successful', async () => {
    const user = {
        username: "testUser1",
        userDisplayName: "testUser1",
        spotifyPic: "testUser1",
        profilePic: "testUser1",
        userIsActive: false,
        userStudios: [],
    };
    const username = "testUser1";
    const createdUser = await getUser(username);
    expectUser(user, createdUser);
});

test('update user is successful', async () => {
    const updatedUser = {
        username: "testUser1",
        userDisplayName: "testUser1",
        spotifyPic: "testUser1",
        profilePic: "testUser1",
        userIsActive: true,
        userStudios: [],
    };
    const username = "testUser1";
    const createdUser = await setUserActive(username);
    expectUser(createdUser, updatedUser);
});

test('delete user is successful', async () => {
    const deletedUser = await deleteUser("testUser1");
    const user = await getUser("testUser1");
    expect(user).toBe(null);
});