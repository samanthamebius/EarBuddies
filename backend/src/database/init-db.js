import * as dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { User, Studio } from './schema';

main();

async function main() {
    await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });
    console.log('Connected to database!');
    console.log();

    await User.deleteMany({});
    await Studio.deleteMany({});
    console.log('Deleted all users and studios!');

    // TODO add some users and studios (should i do dummy data originally??)

    await mongoose.disconnect();
    console.log('Disconnected from database!');
}

