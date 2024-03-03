# BLOG APP
A app which is used to store a list of blogs. The fields include Title,author,url and likes

The application can be found on [Render](https://blog-app-huex.onrender.com/)

##  :hammer: TOOLS AND TECHNOLOGIES USED
  + React
  + Node.js
  + MongoDB
  + ExpressJs
  + bcrypt (for encryption)
  + jwt (token validations)
  + jest (unit testing)
  + cypress (end to end testing)

## :wrench: SETUP
- clone the project
- run `npm install`
  - if you get problem with mongoose version use the command `npm install --legacy-peer-deps`
- start the project with `npm run start`
> [!IMPORTANT]
> This project makes use of Environment variables. Make sure to create a `.env` file with following variables
> - MONGODB_URI (contains url of MongoDB database)
> - PORT : 3001
> - SECRET (secret key for encryption and token validation)
> - TEST_MONGODB_URI (contains url of MongoDB database for testing)
