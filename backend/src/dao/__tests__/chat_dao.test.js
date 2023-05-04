import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { User, Studio, Chat } from "../../database/schema.js";
import {
  getChat,
  createChat,
  getMessages,
  addANewMessage,
  addANewPinnedMessage,
  removePinnedMessage,
  getReactionWithUsername,
  addANewReaction,
  updateReaction,
} from "../chat_dao.js";

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

function expectChat (actual, expected) {
  expect(actual.roomId).toEqual(expected.roomId);
  expect(actual.messages).toEqual(expected.messages);
  expect(actual.pinnedMessages).toEqual(expected.pinnedMessages);
}

function expectMessage (actual, expected) {
    expect(actual.messageId).toEqual(expected.messageId);
    expect(actual.username).toEqual(expected.username);
    expect(actual.userDisplayName).toEqual(expected.userDisplayName);
    expect(actual.message).toEqual(expected.message);
    expect(actual.isReply).toEqual(expected.isReply);
    expect(actual.replyMessage).toEqual(expected.replyMessage);
    expect(actual.reactions).toEqual(expected.reactions);
}

function expectReaction (actual, expected) {
    expect(actual.message).toEqual(expected.message);
    expect(actual.username).toEqual(expected.username);
    expect(actual.userDisplayName).toEqual(expected.userDisplayName);
}

test('get chat is successful', async () => {
    const actual = await getChat(mockChat1.roomId);
    expectChat(actual, mockChat1);
});

test('get chat is unsuccessful', async () => {
    const actual = await getChat("fakeRoomId");
    expect(actual).toBeNull();
});

test('create chat is successful', async () => {
    const newChat = {
        roomId: "newRoomId",
        messages: [],
        pinnedMessages: [],
    };
    await createChat("newRoomId");
    const actual = await getChat("newRoomId");
    expectChat(actual, newChat);
});

test('get messages is successful', async () => {
    const actual = await getMessages(mockChat1.roomId);
    expect(actual.messages).toEqual(mockChat1.messages);
});

test('add a new message is successful', async () => {
    const newMessage = {
        id: "newMessageId",
        username: "testUser1",
        displayName: "testUser1",
        message: "testMessage1",
        isReply: false,
        replyMessage: "",
        reactions: [],
    };
    await addANewMessage(mockChat1.roomId, newMessage);
    const actual = await getMessages(mockChat1.roomId);
    expectMessage(actual.messages[0], newMessage);
});

test('add a new pinned message is successful', async () => {
    const newPinnedMessage = {
        id: "newPinnedMessageId",
        message: "testPinnedMessage1",
        username: "testUser1",
        displayName: "testUser1",
    };
    await addANewPinnedMessage(mockChat1.roomId, newPinnedMessage);
    const actual = await getMessages(mockChat1.roomId);
    expectMessage(actual.pinnedMessages[0], newPinnedMessage);
});

test('remove pinned message is successful', async () => {
    const newPinnedMessage = {
        id: "newPinnedMessageId",
        message: "testPinnedMessage2",
        username: "testUser1",
        displayName: "testUser1",
    };
    await addANewPinnedMessage(mockChat1.roomId, newPinnedMessage);
    await removePinnedMessage(mockChat1.roomId, newPinnedMessage);
    const actual = await getMessages(mockChat1.roomId);
    expect(actual.pinnedMessages).toEqual([]);
});

test('get reaction with username is successful', async () => {
    const newMessage = {
      id: "newMessageId",
      username: "testUser1",
      displayName: "testUser1",
      message: "testMessage1",
      isReply: false,
      replyMessage: "",
      reactions: [
        {
          id: "newReactionId",
          label: "testReaction1",
          username: "testUser1",
          displayName: "testUser1",
        },
      ],
    };
    const newReaction = {
        id: "newReactionId",
        label: "testReaction1",
        username: "testUser1",
        displayName: "testUser1",
    };
    await addANewMessage(mockChat1.roomId, newMessage);
    const actual = await getReactionWithUsername(mockChat1.roomId, newMessage.id, newReaction);
    expectReaction(actual.messages[0].reactions[0], newReaction);
});

test('add reaction is successful', async () => {
    const newMessage = {
      id: "newMessageId",
      username: "testUser1",
      displayName: "testUser1",
      message: "testMessage1",
      isReply: false,
      replyMessage: "",
      reactions: [
        {
          id: "newReactionId",
          label: "testReaction1",
          username: "testUser1",
          displayName: "testUser1",
        },
      ],
    };
    const newReaction = {
        id: "newReactionId",
        label: "testReaction1",
        username: "testUser1",
        displayName: "testUser1",
    };
    await addANewMessage(mockChat1.roomId, newMessage);
    await addANewReaction(mockChat1.roomId, newMessage.id, newReaction);
    const actual = await getReactionWithUsername(
      mockChat1.roomId,
      newMessage.id,
      newReaction
    );
    expectReaction(actual.messages[0].reactions[0], newReaction);
});

