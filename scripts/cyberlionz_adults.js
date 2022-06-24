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
    "0xfAA547c280AE63471d2EbBDe70EcF2957e867FE2"
  ];