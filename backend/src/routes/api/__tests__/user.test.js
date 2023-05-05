import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { User, Studio, Chat } from "../../../database/schema.js";
import express from "express";
import request from "supertest";
import routes from "../user.js";

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

function expectUser(actual, expected) {
  expect(actual.username).toBe(expected.username);
  expect(actual.userDisplayName).toBe(expected.userDisplayName);
  expect(actual.spotifyPic).toBe(expected.spotifyPic);
  expect(actual.profilePic).toBe(expected.profilePic);
  expect(actual.userIsActive).toBe(expected.userIsActive);
  expect(actual.userStudios).toEqual(expected.userStudios);
}

test('getting user is successful', (done) => {
    request(app)
        .get('/testUser1')
        .send()
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            const fromApi = res.body;
            expectUser(fromApi, mockUser1);
            return done();
        })
});

test('getting non-existant user is unsuccessful', (done) => {
    request(app)
        .get('/testUser3')
        .send()
        .expect(404, done);
});

test('updating user is successful', (done) => {
    request(app)
    .put('/testUser1')
    .send({
        userDisplayName: "testUser1Updated",
        spotifyPic: "testUser1Updated",
        profilePic: "testUser1Updated",
    })
    .expect(204, done)
});

test("updating non-existant user is unsuccessful", (done) => {
  request(app)
    .put("/testUser4")
    .send({
      userDisplayName: "testUser1Updated",
      spotifyPic: "testUser1Updated",
      profilePic: "testUser1Updated",
    })
    .expect(404, done);
});

test('deleting user is successful', (done) => {
    request(app)
        .delete('/testUser1')
        .send()
        .expect(204, done)
});

test('deleting non-existant user is unsuccessful', (done) => {
    request(app)
        .delete('/testUser3')
        .send()
        .expect(404, done)
});

test('searching for user is successful', (done) => {
    request(app)
        .get('/users/testUser1/testUser')
        .send()
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            const fromApi = res.body;
            expect(fromApi.length).toBe(1);
            return done();
        })
});

test('searching for non-existant user is successful', (done) => {
    request(app)
        .get('/users/testUser1/thisisnotanexistinguser')
        .send()
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            const fromApi = res.body;
            expect(fromApi.length).toBe(0);
            return done();
        })
});

test('searching for studios is successful', (done) => {
    request(app)
        .get('/users/testUser2/testStudio')
        .send()
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            const fromApi = res.body;
            expect(fromApi.length).toBe(0);
            return done();
        })
});

test('logging out a user is successful', (done) => {
    request(app)
        .put('/testUser1/logout')
        .send()
        .expect(204, done)
});