import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { User, Studio, Chat } from "../../../database/schema.js";
import express from "express";
import request from "supertest";
import routes from "../chat.js";

let mongod;

const app = express();
app.use(express.json());
app.use("/", routes);

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
  studioIsActive: true,
  studioUsers: ["testUser2"],
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

function expectChat(actual, expected) {
  expect(actual.roomId).toEqual(expected.roomId);
  expect(actual.messages).toEqual(expected.messages);
  expect(actual.pinnedMessages).toEqual(expected.pinnedMessages);
}

function expectMessage(actual, expected) {
  expect(actual.messageId).toEqual(expected.messageId);
  expect(actual.username).toEqual(expected.username);
  expect(actual.userDisplayName).toEqual(expected.userDisplayName);
  expect(actual.message).toEqual(expected.message);
  expect(actual.isReply).toEqual(expected.isReply);
  expect(actual.replyMessage).toEqual(expected.replyMessage);
  expect(actual.reactions).toEqual(expected.reactions);
}

function expectReaction(actual, expected) {
  expect(actual.message).toEqual(expected.message);
  expect(actual.username).toEqual(expected.username);
  expect(actual.userDisplayName).toEqual(expected.userDisplayName);
}

test('creating a new chat is successful', (done) => {
    request(app)
        .post("/testRoom3")
        .expect(201, done)
});

test('creating a new chat returns 201', (done) => {
    request(app)
        .post("/testRoom2")
        .expect(201, done)
});

test('getting a chat is successful', (done) => {
    request(app)
        .get("/all-messages/testRoom1")
        .expect(200, done)
});

test('updating a chat is successful', (done) => {
    const newMessage = {
        id: "testMessage1",
        username: "testUser1",
        displayName: "testUser1",
        message: "testMessage1",
        isReply: false,
        replyMessage: "",
        reactions: [],
    };
    request(app)
        .put("/new-message/testRoom1")
        .send(newMessage)
        .expect(204, done)
});

test('updating a pinned message is successful', (done) => {
    const newPinnedMessage = {
        id: "testMessage1",
        message: "testMessage1",
        username: "testUser1",
        displayName: "testUser1",
    };
    request(app)
        .put("/pinned-messages/testRoom1")
        .send(newPinnedMessage)
        .expect(204, done)
});

