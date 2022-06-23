require('dotenv').config({path:__dirname+'/.env'})

const { 
    WHITELIST,
    URI,
    REVENUE_RECIPIENT
} = process.env

module.exports = [
    URI,
    WHITELIST,
    REVENUE_RECIPIENT,
    "0x91eE3E58cE10D5cD0533DE36AC6231d115e113d6"
  ];