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
    "0x3e497682Bc3119CB6334a18bb6a6171B2b7e15b6"
  ];