require('dotenv').config({path:__dirname+'/.env'})

const { 
    WHITELIST,
    URI,
    REVENUE_RECIPIENT
} = process.env

module.exports = [
    URI
  ];