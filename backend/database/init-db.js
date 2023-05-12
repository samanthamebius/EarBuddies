import _regeneratorRuntime from 'babel-runtime/regenerator';

var main = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
        return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });

                    case 2:
                        console.log('Connected to database!');
                        console.log();

                        _context.next = 6;
                        return User.deleteMany({});

                    case 6:
                        _context.next = 8;
                        return Studio.deleteMany({});

                    case 8:
                        console.log('Deleted all users and studios!');

                        _context.next = 11;
                        return User.insertMany(users);

                    case 11:
                        _context.next = 13;
                        return Studio.insertMany(studios);

                    case 13:
                        console.log('Inserted new users and studios!');

                        _context.next = 16;
                        return mongoose.disconnect();

                    case 16:
                        console.log('Disconnected from database!');

                    case 17:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function main() {
        return _ref.apply(this, arguments);
    };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

import * as dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { User, Studio } from './schema';

var users = [{ username: 'smeb123', userDisplayName: "Samantha Mebius", profilePic: "avatar1.png", userIsActive: true, userStudios: [] }, { username: 'bre123', userDisplayName: "Breanna Jury", profilePic: "avatar2.png", userIsActive: false, userStudios: [] }, { username: 'ananya456', userDisplayName: "Ananya Ahluwalia", profilePic: "avatar3.png", userIsActive: true, userStudios: [] }, { username: 'amy456', userDisplayName: "Amy Rimmer", profilePic: "avatar4.png", userIsActive: false, userStudios: [] }, { username: 'ange789', userDisplayName: "Angela Lorusso", profilePic: "avatar5.png", userIsActive: true, userStudios: [] }, { username: 'yuewen789', userDisplayName: "Yuewen Zheng", profilePic: "avatar6.png", userIsActive: false, userStudios: [] }];

var studios = [{ studioName: 'Software Swifties', studioIsActive: true, studioGenres: ['country', 'pop'], studioPicture: 'softwareswifties.png', studioControlHostOnly: true, studioUsers: [] }, { studioName: 'Country Crew', studioIsActive: false, studioGenres: ['country'], studioPicture: 'countrycrew.png', studioControlHostOnly: false, studioUsers: [] }, { studioName: 'Tune Team', studioIsActive: true, studioGenres: ['country', 'pop'], studioPicture: 'tuneteam.png', studioControlHostOnly: true, studioUsers: [] }, { studioName: 'Sad Club', studioIsActive: false, studioGenres: ['pop'], studioPicture: 'sadclub.png', studioControlHostOnly: true, studioUsers: [] }, { studioName: 'Sound Scholars', studioIsActive: true, studioGenres: ['Lo-Fi'], studioPicture: 'soundscholars.png', studioControlHostOnly: true, studioUsers: [] }, { studioName: 'BLINKS', studioIsActive: false, studioGenres: ['K-Pop'], studioPicture: 'blinks.png', studioControlHostOnly: true, studioUsers: [] }];

main();