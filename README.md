# Burgundy Badgers EarBuddies application!

A fullstack MERN application for listening to music with your buddies!

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
2. Open a terminal in the cloned folder and run 
``` 
cd ./backend/
npm install 
npm start
```
3. Open a second terminal and run
```
cd ./frontend/
npm install
npm run dev
```
5. open [localhost](http://127.0.0.1:5173/) in your browser. Please use google chrome, as the system has not been fully tested on other browsers and you may encounter unexpected errors. 
7. log in with spotify. Please use one of the following accounts:  

Testing account 1  (Taylor Swift)  

> username: smeb890@aucklanduni.ac.nz  
> password: softeng750  

Testing account 2  (Florence Welch)  

> username: bjur781@aucklanduni.ac.nz  
> password: softeng750  

## Database
If you want to have some initialised data, run
```
cd ./backend/
npm init_db
```

## Testing
We have two testing suites set up.
To run the backend suite:
```
cd ./backend/
npm test
```
To run an individual test (e.g. studio.test.js)
``` 
cd ./backend/
npm test -t studio.test.js
```
To run the frontend suite:
ADD HERE

# Features
## Login
Log in using your spotify account (no account creation required!)  
![image](https://github.com/UOA-CS732-SE750-Students-2023/project-group-burgundy-badgers/assets/79810883/8f21a616-534e-401a-b583-5d2e8c1e350b)

## Home
View your studios - with active studios seperated to easily find your friends 🧑‍🤝‍🧑  
Search your studios  
Create a studio. Customisable with:  
- name
- banner photo
- genres (choose from our pre-set list, or add your own)
- control settings
- listeners  
![image](https://github.com/UOA-CS732-SE750-Students-2023/project-group-burgundy-badgers/assets/79810883/50c10bf8-523f-4f76-9772-f140fc0ca122)

## Profile
Switch to dark mode! 🌑🌃🌠 perfect for late night listening sessions  
Change your display name and photo  
Quick access to your spotify dashboard  
Log out or delete your account ☹️👋  
![image](https://github.com/UOA-CS732-SE750-Students-2023/project-group-burgundy-badgers/assets/79810883/aa95ad2b-e5df-4398-bc24-f9f0b20cc5c3)

## Studio
### now playing 🎵
View the song playing  
Control the volume in studio  
Play, pause, skip and seek songs  
![image](https://github.com/UOA-CS732-SE750-Students-2023/project-group-burgundy-badgers/assets/79810883/233772aa-478a-4d50-94d8-f9fac5d5776c)

### search and queue songs 🎼

### chat 💬

### manage studio 🖊️
Leave studio  
Edit nickname (specific to this studio)  
Add listeners  
And if you're the host:
- delete listeners
- assign a new host
- enable/disable control
- delete studio
