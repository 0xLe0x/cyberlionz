require('dotenv').config({path:__dirname+'/.env'})

const { 
    WHITELIST,
    URI
} = process.env

module.exports = [
    URI,
    WHITELIST
  ];