import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { User, Studio, Chat } from "../schema.js";

let mongod;

//mock data
const mockUser1 = {
    username: "testUser1",
    userDisplayName: "testUser1",
    spotifyPic: "testUser1",
    profilePic: "testUser1",
    userIsActive: true,
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
    await mongoose.connection.db.dropDatabase();
    const userColl = await mongoose.connection.db.createCollection("users");
    await userColl.insertMany(mockUsers);
    const studioColl = await mongoose.connection.db.createCollection("studios");
    await studioColl.insertMany(mockStudios);
    const chatColl = await mongoose.connection.db.createCollection("chats");
    await chatColl.insertMany(mockChats);
});

function expectUser(actual, expected) {
    expect(actual.username).toBe(expected.username);
    expect(actual.userDisplayName).toBe(expected.userDisplayName);
    expect(actual.spotifyPic).toBe(expected.spotifyPic);
    expect(actual.profilePic).toBe(expected.profilePic);
    expect(actual.userIsActive).toBe(expected.userIsActive);
    expect(actual.userStudios).toEqual(expected.userStudios);
}

function expectStudio(actual, expected) {
    expect(actual.studioName).toBe(expected.studioName);
    expect(actual.studioIsActive).toBe(expected.studioIsActive);
    expect(actual.studioUsers).toEqual(expected.studioUsers);
    expect(actual.studioHost).toBe(expected.studioHost);
    expect(actual.studioGenres).toEqual(expected.studioGenres);
    expect(actual.studioPicture).toBe(expected.studioPicture);
    expect(actual.studioControlHostOnly).toBe(expected.studioControlHostOnly);
    expect(actual.studioPlaylist).toBe(expected.studioPlaylist);
}

function expectChat(actual, expected) {
    expect(actual.roomId).toBe(expected.roomId);
    expect(actual.messages).toEqual(expected.messages);
    expect(actual.pinnedMessages).toEqual(expected.pinnedMessages);
}

test("Getting all users is successful", async () => {
  const users = await User.find();
  expect(users.length).toBe(2);
  expectUser(users[0], mockUser1);
  expectUser(users[1], mockUser2);
});

test("Getting all studios is successful", async () => {
  const studios = await Studio.find();
  expect(studios.length).toBe(2);
  expectStudio(studios[0], mockStudio1);
  expectStudio(studios[1], mockStudio2);
});

test("Getting all chats is successful", async () => {
  const chats = await Chat.find();
  expect(chats.length).toBe(2);
  expectChat(chats[0], mockChat1);
  expectChat(chats[1], mockChat2);
});

test("Getting a user by username is successful", async () => {
  const user = await User.findOne({ username: "testUser1" });
  expectUser(user, mockUser1);
});

test("Getting a chat by room id is successful", async () => {
  const chat = await Chat.findOne({ roomId: "testRoom1" });
  expectChat(chat, mockChat1);
});

test("Creating a user is successful", async () => {
  const newUser = {
    username: "testUser3",
    userDisplayName: "testUser3",
    spotifyPic: "testUser3",
    profilePic: "testUser3",
    userIsActive: true,
    userStudios: [],
  };
  const user = new User(newUser);
  await user.save();
  const userFromDb = await User.findById(user._id);
  expectUser(userFromDb, newUser);
});

test("Creating a studio is successful", async () => {
  const newStudio = {
    studioName: "testStudio3",
    studioIsActive: true,
    studioUsers: [],
    studioHost: "testUser3",
    studioGenres: ["testGenre3"],
    studioPicture: "testPicture3",
    studioControlHostOnly: false,
    studioPlaylist: "testPlaylist3",
  };
  const studio = new Studio(newStudio);
  await studio.save();
  const studioFromDb = await Studio.findById(studio._id);
  expectStudio(studioFromDb, newStudio);
});

test('Creating a chat is successful', async () => {
    const newChat = {
        roomId: "testRoom3",
        messages: [],
        pinnedMessages: [],
    };
    const chat = new Chat(newChat);
    await chat.save();
    const chatFromDb = await Chat.findById(chat._id);
    expectChat(chatFromDb, newChat);
});

test("Updating a user is successful", async () => {
    const user = await User.findOne({ username: "testUser1" });
    user.userDisplayName = "testUser1Updated";
    await user.save();
    const userFromDb = await User.findById(user._id);
    expectUser(userFromDb, user);
});

test("Updating a studio is successful", async () => {
    const studio = await Studio.findOne({ studioName: "testStudio1" });
    studio.studioIsActive = false;
    await studio.save();
    const studioFromDb = await Studio.findById(studio._id);
    expectStudio(studioFromDb, studio);
});

test("Deleting a user is successful", async () => {
    const user = await User.findOne({ username: "testUser1" });
    await User.deleteOne({ username: "testUser1" });
    const userFromDb = await User.findById(user._id);
    expect(userFromDb).toBeNull();
});

test("Deleting a studio is successful", async () => {
    const studio = await Studio.findOne({ studioName: "testStudio1" });
    await Studio.deleteOne({ studioName: "testStudio1" });
    const studioFromDb = await Studio.findById(studio._id);
    expect(studioFromDb).toBeNull();
});

test("Deleting a chat is successful", async () => {
    const chat = await Chat.findOne({ roomId: "testRoom1" });
    await Chat.deleteOne({ roomId: "testRoom1" });
    const chatFromDb = await Chat.findById(chat._id);
    expect(chatFromDb).toBeNull();
});