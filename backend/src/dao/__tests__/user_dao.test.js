import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { User, Studio, Chat } from "../../database/schema.js";
import {
  createUser,
  setUserActive,
  setUserInactive,
  getUser,
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
const mockStudio1 = {
  _id: new mongoose.Types.ObjectId(),
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
  _id: new mongoose.Types.ObjectId(),
  studioName: "testStudio2",
  studioIsActive: false,
  studioUsers: ["testUser3"],
  studioHost: "testUser3",
  studioGenres: ["testGenre2"],
  studioPicture: "testPicture2",
  studioControlHostOnly: false,
  studioPlaylist: "testPlaylist2",
};
const mockStudios = [mockStudio1, mockStudio2];
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
const mockUser3 = {
  username: "testUser3",
  userDisplayName: "testUser3",
  spotifyPic: "testUser3",
  profilePic: "testUser3",
  userIsActive: true,
  userStudios: [mockStudio2._id],
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

const mockUsers = [mockUser1, mockUser2, mockUser3];
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
    expect(users.length).toBe(3);
    expectUser(users[0], mockUser1);
    expectUser(users[1], mockUser2);
    expectUser(users[2], mockUser3);
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

test('set user active is successful', async () => {
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

test('set user inactive is successful', async () => {
    const updatedUser = {
        username: "testUser2",
        userDisplayName: "testUser2",
        spotifyPic: "testUser2",
        profilePic: "testUser2",
        userIsActive: false,
        userStudios: [],
    };
    const username = "testUser2";
    const createdUser = await setUserInactive(username);
    expectUser(createdUser, updatedUser);
});

test('delete user is successful', async () => {
    await deleteUser("testUser1");
    const user = await getUser("testUser1");
    expect(user).toBe(null);
});

test('update user display name is successful', async () => {
    const updatedUser = {
        username: "testUser1",
        userDisplayName: "testUser1Updated",
        spotifyPic: "testUser1",
        profilePic: "testUser1",
        userIsActive: false,
        userStudios: [],
    };
    const username = "testUser1";
    const displayName = "testUser1Updated";
    const createdUser = await updateUserDisplayName(username, displayName);
    expectUser(createdUser, updatedUser);
});

test('update user profile pic is successful', async () => {
    const updatedUser = {
        username: "testUser1",
        userDisplayName: "testUser1",
        spotifyPic: "testUser1",
        profilePic: "testUser1Updated",
        userIsActive: false,
        userStudios: [],
    };
    const username = "testUser1";
    const profilePic = "testUser1Updated";
    const createdUser = await updateUserProfilePic(username, profilePic);
    expectUser(createdUser, updatedUser);
});

test('update studios is successful', async () => {
    const updatedUser = {
        username: "testUser1",
        userDisplayName: "testUser1",
        spotifyPic: "testUser1",
        profilePic: "testUser1",
        userIsActive: false,
        userStudios: [mockStudio1._id],
    };
    const username = "testUser1";
    const studios = [mockStudio1._id];
    const createdUser = await updateStudios(username, studios);
    expectUser(createdUser, updatedUser);
});

test('get studios is successful', async () => {
    const username = "testUser3";
    const studioIds = await getStudiosId(username);
    expect(studioIds.length).toBe(1);
});

test('search studios is successful', async () => {
    const studios = await searchStudios('testUser3', "test");
    expect(studios.length).toBe(1);
});

test('search active studios is successful', async () => {
    const studios = await searchActiveStudios('testUser3', "test");
    expect(studios.length).toBe(0);
});

test('search users is successful', async () => {
    const users = await searchUsers('test', 'testUser3');
    expect(users.length).toBe(2);
});

test('search studio users is successful', async () => {
    const users = await searchStudioUsers(mockStudio2._id, 'test', 'testUser3');
    expect(users.length).toBe(0);
});