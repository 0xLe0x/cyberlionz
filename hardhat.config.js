/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 require('dotenv').config();
 require("@nomiclabs/hardhat-waffle");
 require("@nomiclabs/hardhat-etherscan");

 const { 
  ALCHEMY_ROPSTEN_API_KEY,
  ALCHEMY_RINKEBY_API_KEY,
  ALCHEMY_MAINNET_API_KEY,
  CONTRACT_OWNER_PRIVATE_KEY,
  ETHERSCAN_API_KEY
} = process.env;
 
module.exports = {
  solidity: "0.8.13",
  defaultNetwork: "localhost",
  etherscan: {
    apiKey: ETHERSCAN_API_KEY

  },
  networks: {
    localhost: {},
    ropsten: {
      url: `https://eth-ropsten.alchemyapi.io/v2/${ALCHEMY_ROPSTEN_API_KEY}`,
      accounts: [CONTRACT_OWNER_PRIVATE_KEY]
    },
    rinkeby: {
      url: 'https://rinkeby.infura.io/v3/294756524c724e35ae8e7cb59f4eca94',
      accounts: ["33f5a1922e2f346777a5b75e2ef23803c998e6627053fa84da6e237ad180dbb3"]
    },
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_MAINNET_API_KEY}`,
      accounts: [CONTRACT_OWNER_PRIVATE_KEY]
    }
  },
  mocha: {
    timeout: 20000
  }
};
