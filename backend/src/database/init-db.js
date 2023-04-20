import * as dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { User, Studio } from './schema';

const users = [
    { username: 'smeb123', userIsActive: true },
    { username: 'bre123', userIsActive: false },
    { username: 'ananya456', userIsActive: true },
    { username: 'amy456', userIsActive: false },
    { username: 'ange789', userIsActive: true },
    { username: 'yuewen789', userIsActive: false }
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

