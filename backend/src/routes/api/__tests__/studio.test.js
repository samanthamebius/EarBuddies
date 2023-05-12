import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { User, Studio, Chat } from "../../../database/schema.js";
import express from "express";
import request from "supertest";
import routes from "../studio.js";
import { getStudio } from "../../../dao/studio_dao.js";

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
  studioNames: [],
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
  studioUsers: ["testUser3", "testUser4"],
  studioNames: ["testUser3", "testUser4"],
  studioHost: "testUser3",
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


const mockStudios = [mockStudio1, mockStudio2];
const mockChats = [mockChat1, mockChat2];

const mockUser3 = {
  username: "testUser3",
  userDisplayName: "testUser3",
  spotifyPic: "testUser3",
  profilePic: "testUser3",
  userIsActive: true,
  userStudios: [mockStudio2._id],
};
const mockUser4 = {
  username: "testUser4",
  userDisplayName: "testUser4",
  spotifyPic: "testUser4",
  profilePic: "testUser4",
  userIsActive: true,
  userStudios: [mockStudio2._id],
};

const mockUsers = [mockUser1, mockUser2, mockUser3, mockUser4];

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

function expectStudio(actual, expected) {
  expect(actual.studioName).toEqual(expected.studioName);
  expect(actual.studioIsActive).toEqual(expected.studioIsActive);
  expect(actual.studioUsers).toEqual(expected.studioUsers);
  expect(actual.studioNames).toEqual(expected.studioNames);
  expect(actual.studioHost).toEqual(expected.studioHost);
  expect(actual.studioGenres).toEqual(expected.studioGenres);
  expect(actual.studioPicture).toEqual(expected.studioPicture);
  expect(actual.studioControlHostOnly).toEqual(expected.studioControlHostOnly);
  expect(actual.studioPlaylist).toEqual(expected.studioPlaylist);
}

//note: cannot test creating studio or other studio routes that require
//spotify authentication because we cannot mock the spotify authentication

test("deleting studio is successful", (done) => {
  request(app)
    .delete(`/${mockStudio1._id}`)
    .expect(204, done);
});

test('toggle control of studio is successful', (done) => {
    const updatedStudio = {
        ...mockStudio1,
        studioControlHostOnly: true
    }
    request(app)
		.put(`/${mockStudio1._id}/isHostOnly`)
		.expect(200, done);
    }
)

test("adding user to studio is successful", (done) => {
  const updatedStudio = {
    ...mockStudio2,
    studioUsers: ["testUser1", "testUser3", "testUser4"],
    studioNames: ["testUser1", "testUser3", "testUser4"],
  };
  request(app)
    .put(`/${mockStudio2._id}/updateListeners`)
    .send({ listeners: ["testUser3", "testUser4", "testUser1"] })
    .expect(200)
    .end((err, res) => {
      if (err) return done(err);
      expectStudio(res.body[0], updatedStudio);
      done();
    });
});

test("removing user from studio is successful", (done) => {
  const updatedStudio = {
    ...mockStudio2,
    studioUsers: ["testUser3"],
    studioNames: ["testUser3"],
  };
  request(app)
    .put(`/${mockStudio2._id}/updateListeners`)
    .send({ listeners: ["testUser3"] })
    .expect(200)
    .end((err, res) => {
      if (err) return done(err);
      expectStudio(res.body[0], updatedStudio);
      done();
    });
});

test('updating list of users in studio is successful', (done) => {
    const updatedStudio = {
        ...mockStudio2,
        studioUsers: ["testUser2", "testUser3"],
        studioNames: ["testUser2", "testUser3"]
    }
    request(app)
      .put(`/${mockStudio2._id}/updateListeners`)
      .send({listeners: ["testUser2", "testUser3"]})
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expectStudio(res.body[0], updatedStudio);
        done();
      }
    );
  }
)
