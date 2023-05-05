import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { User, Studio, Chat } from "../../database/schema.js";
import {	
  createStudio,
	getStudio,
	getStudios,
	updateStudioControlHostOnly,
	updateStudioIsActive,
	updateStudioUsers,
	updateStudioHost,
	deleteStudio} from "../studio_dao.js";

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

function expectStudio (actual, expected) {
  expect(actual.studioName).toEqual(expected.studioName);
  expect(actual.studioIsActive).toEqual(expected.studioIsActive);
  expect(actual.studioUsers).toEqual(expected.studioUsers);
  expect(actual.studioHost).toEqual(expected.studioHost);
  expect(actual.studioGenres).toEqual(expected.studioGenres);
  expect(actual.studioPicture).toEqual(expected.studioPicture);
  expect(actual.studioControlHostOnly).toEqual(expected.studioControlHostOnly);
  expect(actual.studioPlaylist).toEqual(expected.studioPlaylist);
}

test('create studio is successful', async () => {
    const studio = {
      _id: new mongoose.Types.ObjectId(),
      studioName: "testStudio3",
      studioIsActive: true,
      studioUsers: [],
      studioHost: "testUser3",
      studioGenres: ["testGenre3"],
      studioPicture: "testPicture3",
      studioControlHostOnly: false,
      studioPlaylist: "testPlaylist3",
    };
    const createdStudio = await createStudio("testStudio3", [], "testUser3", ["testGenre3"], "testPicture3", false, "testPlaylist3");
    expectStudio(studio, createdStudio);
});

test('get all studios is successful', async () => {
    const studios = await getStudios();
    expect(studios.length).toEqual(2);
    expectStudio(studios[0], mockStudio1);
    expectStudio(studios[1], mockStudio2);
});

test('get studio is successful', async () => {
    const studio = await getStudio(mockStudio1._id);
    expectStudio(studio[0], mockStudio1);
});

test('delete studio is successful', async () => {
    await deleteStudio(mockStudio1._id);
    const studio = await getStudio(mockStudio1._id);
    expect(studio.length).toEqual(0);
});

test('update studio control is successful', async () => {
    const updatedStudio = {
        _id: mockStudio1._id,
        studioName: mockStudio1.studioName,
        studioIsActive: mockStudio1.studioIsActive,
        studioUsers: mockStudio1.studioUsers,
        studioHost: mockStudio1.studioHost,
        studioGenres: mockStudio1.studioGenres,
        studioPicture: mockStudio1.studioPicture,
        studioControlHostOnly: !mockStudio1.studioControlHostOnly,
        studioPlaylist: mockStudio1.studioPlaylist,
    };
    const studio = await updateStudioControlHostOnly(mockStudio1._id, true);
    expectStudio(studio, updatedStudio);
});

test('update studio is active is successful', async () => {
    const updatedStudio = {
        _id: mockStudio1._id,
        studioName: mockStudio1.studioName,
        studioIsActive: !mockStudio1.studioIsActive,
        studioUsers: mockStudio1.studioUsers,
        studioHost: mockStudio1.studioHost,
        studioGenres: mockStudio1.studioGenres,
        studioPicture: mockStudio1.studioPicture,
        studioControlHostOnly: mockStudio1.studioControlHostOnly,
        studioPlaylist: mockStudio1.studioPlaylist,
    };
    const studio = await updateStudioIsActive(mockStudio1._id, false);
    expectStudio(studio, updatedStudio);
});

test('update studio users is successful', async () => {
    const updatedStudio = {
        _id: mockStudio1._id,
        studioName: mockStudio1.studioName,
        studioIsActive: mockStudio1.studioIsActive,
        studioUsers: [mockUser1.username],
        studioHost: mockStudio1.studioHost,
        studioGenres: mockStudio1.studioGenres,
        studioPicture: mockStudio1.studioPicture,
        studioControlHostOnly: mockStudio1.studioControlHostOnly,
        studioPlaylist: mockStudio1.studioPlaylist,
    };
    const studio = await updateStudioUsers(mockStudio1._id, [mockUser1.username]);
    expectStudio(studio, updatedStudio);
});

test('update studio host is successful', async () => {
    const updatedStudio = {
        _id: mockStudio1._id,
        studioName: mockStudio1.studioName,
        studioIsActive: mockStudio1.studioIsActive,
        studioUsers: mockStudio1.studioUsers,
        studioHost: mockUser2.username,
        studioGenres: mockStudio1.studioGenres,
        studioPicture: mockStudio1.studioPicture,
        studioControlHostOnly: mockStudio1.studioControlHostOnly,
        studioPlaylist: mockStudio1.studioPlaylist,
    };
    const studio = await updateStudioHost(mockStudio1._id, mockUser2.username);
    expectStudio(studio, updatedStudio);
});

