# Burgundy Badgers EarBuddies application!

A full-stack MERN application for listening to music with your buddies!

## Authors
Softeng750 Burgundy Badgers
- [Ananya Ahluwalia](https://github.com/ananyaahluwalia01)
- [Angela Lorusso](https://github.com/alor903)
- [Amy Rimmer](https://www.github.com/arim402)
- [Breanna Jury](https://github.com/bjur781)
- [Samantha Mebius](https://github.com/samanthamebius)
- [Yuewen Zheng](https://github.com/azhe202)

# How to run
1. Clone this repository 
2. Open a terminal in the cloned folder and run:
``` 
cd ./backend/
npm install 
npm start
```
3. Open a second terminal and run:
```
cd ./frontend/
npm install
npm run dev
```
5. Open [localhost](http://127.0.0.1:5173/) in your browser. Please use Google Chrome, as the system has not been comprehensively tested on other browsers, and you may encounter unexpected errors. 
7. Log in with a Spotify account. Please use one of the following accounts:  

Testing account 1  (Taylor Swift)  

> username: smeb890@aucklanduni.ac.nz  
> password: softeng750  

Testing account 2  (Florence Welch)  

> username: bjur781@aucklanduni.ac.nz  
> password: softeng750  

## Database
To generate some initialised data, run the following:
```
cd ./backend/
npm run init_db
```

## Testing
### Backend Testing Suite
To run the backend suite:
```
cd ./backend/
npm test
```
To run an individual test (e.g. studio.test.js):
``` 
cd ./backend/
npm test -t studio.test.js
```
### Frontend Testing Suite
To run the frontend suite:
1. In one terminal, run the backend:
```
cd ./backend/
npm start
```
2. In another terminal, run frontend tests:
```
cd ./frontend/
npm test
```
To run an individual test (e.g. create-studio.test.js):
``` 
cd ./frontend/
npm test -t create-studio.test.js
```

# Features
## Login
Log in using your Spotify account with no account creation required  
![image](https://github.com/UOA-CS732-SE750-Students-2023/project-group-burgundy-badgers/assets/79810883/8f21a616-534e-401a-b583-5d2e8c1e350b)


## Home
View your studios - with active studios separated to find your friends easily 🧑‍🤝‍🧑  
![image](https://github.com/UOA-CS732-SE750-Students-2023/project-group-burgundy-badgers/assets/79810883/0468cd7d-4204-4e24-9e67-29d11419fda3)  

Search your studios  
![image](https://github.com/UOA-CS732-SE750-Students-2023/project-group-burgundy-badgers/assets/79810883/fb46c77e-b4a5-40fc-a2af-10a275b30203)  

Create a studio. Customisable with:  
- Name
- Banner photo
- Genres (choose from our pre-set list, or add your own)
- Control settings
- Listeners  

![image](https://github.com/UOA-CS732-SE750-Students-2023/project-group-burgundy-badgers/assets/79810883/6e1d4c7f-a819-4cf3-ade9-43be8432773b)


## Profile
Switch to dark mode! 🌑🌃🌠 perfect for late-night listening sessions  
![image](https://github.com/UOA-CS732-SE750-Students-2023/project-group-burgundy-badgers/assets/79784993/89afb879-c010-4be2-a939-3e3c2eb5781e)

![image](https://github.com/UOA-CS732-SE750-Students-2023/project-group-burgundy-badgers/assets/79810883/e0d3f66e-f787-4c6f-9a1c-08403a207a3b)

Change your display name and photo  
Quick access to your Ppotify dashboard  
Log out or delete your account ☹️👋  
![image](https://github.com/UOA-CS732-SE750-Students-2023/project-group-burgundy-badgers/assets/79810883/81abec40-b188-4177-9497-d8aaed9946d4)


## Studio
### Now Playing 🎵
View the song playing  
Control the volume in the studio  
Play, pause, skip and seek songs  
![image](https://github.com/UOA-CS732-SE750-Students-2023/project-group-burgundy-badgers/assets/79810883/92f958f7-fc07-40b4-b48f-bf2a117f194d)


### Search and Queue Songs 🎼
Search all songs (and podcasts!) in the Spotify library  
Add them to the queue  
Remove from queue  
![image](https://github.com/UOA-CS732-SE750-Students-2023/project-group-burgundy-badgers/assets/79810883/7db95d2c-5001-4b2e-8d38-4bdaeeb8afd9)


### Chat 💬
Send messages to everyone in the studio in a real-time chat  
Quickly and easily mention details about the song playing with quick add buttons  
Reply and react to messages  
Pin messages  
See the song or podcast that was playing at that point in time  
See people's custom nicknames  
![image](https://github.com/UOA-CS732-SE750-Students-2023/project-group-burgundy-badgers/assets/79810883/d3bf4815-70de-4817-9442-d66f15bddf99)
![image](https://github.com/UOA-CS732-SE750-Students-2023/project-group-burgundy-badgers/assets/79810883/4bcfcbbb-9e97-4edd-8a4c-a96c16051c10)


### Manage Studio 🖊️
Leave studio  
Edit nickname (specific to this studio)  
Add listeners (if the host has enabled control)  
![image](https://github.com/UOA-CS732-SE750-Students-2023/project-group-burgundy-badgers/assets/79810883/023798b0-b83c-4cd0-8318-91442c4d13fb)

And if you're the host:
- delete listeners
- assign a new host
- enable/disable control
- delete studio  
![image](https://github.com/UOA-CS732-SE750-Students-2023/project-group-burgundy-badgers/assets/79810883/f69adfa5-e130-48b9-acea-a6a35234418b)

## Error Pages
Handle any errors gracefully
![image](https://github.com/UOA-CS732-SE750-Students-2023/project-group-burgundy-badgers/assets/79810883/1336b2ec-57b4-4a7e-94eb-f687068e7bbc)

