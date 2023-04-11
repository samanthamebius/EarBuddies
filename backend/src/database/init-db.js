import * as dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { User, Studio } from './schema';

const users = [
    { username: 'smeb', userIsActive: true },
    { username: 'bre', userIsActive: false},
    { username: 'ananya', userIsActive: true},
    { username: 'amy', userIsActive: false },
    { username: 'ange', userIsActive: true },
    { username: 'yuewen', userIsActive: false }
];

const studios = [
    { studioName: 'smeb\'s studio', studioIsActive: true, studioGenres: ['rock', 'pop', 'jazz'] },
    { studioName: 'bre\'s studio', studioIsActive: false, studioGenres: ['rock', 'pop', 'jazz'] },
    { studioName: 'ananya\'s studio', studioIsActive: true, studioGenres: ['rock', 'pop', 'jazz'] },
    { studioName: 'amy\'s studio', studioIsActive: false, studioGenres: ['rock', 'pop', 'jazz'] },
    { studioName: 'ange\'s studio', studioIsActive: true, studioGenres: ['rock', 'pop', 'jazz'] },
    { studioName: 'yuewen\'s studio', studioIsActive: false, studioGenres: ['rock', 'pop', 'jazz'] }
];

main();

async function main() {
    await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });
    console.log('Connected to database!');
    console.log();

    await User.deleteMany({});
    await Studio.deleteMany({});
    console.log('Deleted all users and studios!');

    await User.insertMany(users);
    await Studio.insertMany(studios);
    console.log('Inserted new users and studios!');

    await mongoose.disconnect();
    console.log('Disconnected from database!');
}

