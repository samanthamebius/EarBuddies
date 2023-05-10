describe('Logger', () => {
    test.todo('please pass');
});

// import '@testing-library/jest-dom';
// import { expect, it } from 'vitest';
// import { getByLabelText, render } from "@testing-library/react"
// import { MemoryRouter } from "react-router-dom"
// import React from "react";
// import StudioPage from '../studio/StudioPage';
// import localStorageMock from './local-storage-mock';
// import { Server } from 'http';
// import { Server as SocketIOServer } from 'socket.io';
// import { io as SocketIO } from 'socket.io-client';


// const mockUser1 = {
//   _id: 1,
//   username: "testUser1",
//   userDisplayName: "Test User 1",
//   spotifyPic: "testUser1Pic",
//   profilePic: "testUser1Pic",
//   userIsActive: false,
//   userStudios: [],
// };

// const mockUser2 = {
//     _id: 2,
//     username: "testUser2",
//     userDisplayName: "Test User 2",
//     spotifyPic: "testUser2Pic",
//     profilePic: "testUser2Pic",
//     userIsActive: false,
//     userStudios: [],
// };

// const mockUser3 = {
//     _id: 3,
//     username: "testUser3",
//     userDisplayName: "Test User 3",
//     spotifyPic: "testUser3Pic",
//     profilePic: "testUser3Pic",
//     userIsActive: false,
//     userStudios: [],
// };

// const mockStudio1 = {
//     _id: 1,
//     studioName: "Test Studio",
//     studioIsActive: true,
//     studioUsers: ["testUser1", "testUser2", "testUser3"],
//     studioNames: ["Test User 1", "Test User 2", "Test User 3"],
//     studioHost: ["testUser1"],
//     studioGenres: [],
//     studioPicture: "/images/defaultBanner.png",
//     studioControlHostOnly: false,
//     studioPlaylist: "playlist1",
// };


// describe("StudioPage", () => {
//     beforeAll(() => {
//       global.localStorage = localStorageMock;
//     });
//     it('renders the studio page correctly', () => {
//         localStorage.setItem('current_user_id', mockUser1._id);
      
//         const httpServer = new Server();
//         const io = new SocketIOServer(httpServer, {
//           cors: {
//             origin: '*',
//           },
//         });
      
//         const socket = new SocketIO(`http://localhost:3000`, {
//           autoConnect: false,
//         });
      
//         const { getByLabelText } = render(
//           <MemoryRouter initialEntries={[`/studio/${mockStudio1._id}`]}>
//             <StudioPage socket={socket} />
//           </MemoryRouter>
//         );
//         console.log(socket)
      
//         expect(getByLabelText('Search Spotify...')).toBeInTheDocument();
      
//         io.close();
//       });
// });